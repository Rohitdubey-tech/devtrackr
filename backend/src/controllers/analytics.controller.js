import Task from "../models/Task.js";
import Snippet from "../models/Snippet.js";

// @desc    Get productivity analytics for current user
// @route   GET /api/v1/analytics/productivity
export const getProductivity = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { days = 30 } = req.query;
    const since = new Date();
    since.setDate(since.getDate() - Number(days));

    // Task completion over time
    const taskTimeline = await Task.aggregate([
      {
        $match: {
          user: userId,
          updatedAt: { $gte: since },
        },
      },
      {
        $group: {
          _id: {
            date: { $dateToString: { format: "%Y-%m-%d", date: "$updatedAt" } },
            status: "$status",
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.date": 1 } },
    ]);

    // Task summary by status
    const taskSummary = await Task.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Task summary by priority
    const prioritySummary = await Task.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$priority",
          count: { $sum: 1 },
        },
      },
    ]);

    // Snippet stats
    const snippetStats = await Snippet.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$language",
          count: { $sum: 1 },
          favorites: { $sum: { $cond: ["$isFavorite", 1, 0] } },
        },
      },
      { $sort: { count: -1 } },
    ]);

    // Weekly productivity (tasks completed per week over last 8 weeks)
    const eightWeeksAgo = new Date();
    eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);

    const weeklyProductivity = await Task.aggregate([
      {
        $match: {
          user: userId,
          status: "DONE",
          updatedAt: { $gte: eightWeeksAgo },
        },
      },
      {
        $group: {
          _id: { $isoWeek: "$updatedAt" },
          completed: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    // --- Streak Calculation ---
    // Get unique dates of any activity (task or snippet creation/update)
    const [taskDates, snippetDates] = await Promise.all([
      Task.distinct("updatedAt", { user: userId }),
      Snippet.distinct("updatedAt", { user: userId })
    ]);

    const allDates = [...new Set([...taskDates, ...snippetDates].map(d => new Date(d).toISOString().split("T")[0]))]
      .sort((a, b) => b.localeCompare(a)); // Sort descending (newest first)

    let currentStreak = 0;
    const today = new Date().toISOString().split("T")[0];
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    // Check if there was activity today or yesterday to continue/start a streak
    if (allDates.length > 0) {
      const latestActivity = allDates[0];
      if (latestActivity === today || latestActivity === yesterdayStr) {
        currentStreak = 1;
        for (let i = 0; i < allDates.length - 1; i++) {
          const current = new Date(allDates[i]);
          const next = new Date(allDates[i + 1]);
          const diffTime = Math.abs(current - next);
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays === 1) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
    }

    // Build local activity map for heatmap
    const localActivity = {};
    [...taskDates, ...snippetDates].forEach(d => {
      const dateStr = new Date(d).toISOString().split("T")[0];
      localActivity[dateStr] = (localActivity[dateStr] || 0) + 1;
    });

    // --- Competitive Programming Stats (Non-blocking with 5s timeout) ---
    let leetcodeStats = null;
    let gfgStats = null;

    const fetchWithTimeout = (url, options = {}, timeout = 5000) => {
      return Promise.race([
        fetch(url, options),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), timeout))
      ]);
    };

    try {
      const promises = [];

      // LeetCode — use their public GraphQL API directly
      if (req.user.leetcodeUsername) {
        const lcQuery = {
          query: `
            query getUserProfile($username: String!) {
              allQuestionsCount { difficulty count }
              matchedUser(username: $username) {
                username
                profile { ranking }
                submitStatsGlobal {
                  acSubmissionNum { difficulty count }
                }
              }
            }
          `,
          variables: { username: req.user.leetcodeUsername }
        };

        promises.push(
          fetchWithTimeout("https://leetcode.com/graphql/", {
            method: "POST",
            headers: { "Content-Type": "application/json", "Referer": "https://leetcode.com" },
            body: JSON.stringify(lcQuery)
          })
            .then(r => r.ok ? r.json() : null)
            .then(json => {
              if (json?.data?.matchedUser) {
                const allQ = json.data.allQuestionsCount;
                const solved = json.data.matchedUser.submitStatsGlobal.acSubmissionNum;
                const findCount = (arr, diff) => (arr.find(x => x.difficulty === diff) || {}).count || 0;

                leetcodeStats = {
                  totalSolved: findCount(solved, "All"),
                  totalQuestions: findCount(allQ, "All"),
                  easySolved: findCount(solved, "Easy"),
                  easyTotal: findCount(allQ, "Easy"),
                  mediumSolved: findCount(solved, "Medium"),
                  mediumTotal: findCount(allQ, "Medium"),
                  hardSolved: findCount(solved, "Hard"),
                  hardTotal: findCount(allQ, "Hard"),
                  ranking: json.data.matchedUser.profile?.ranking || 0,
                };
              }
            })
            .catch(err => { console.error("LeetCode fetch error:", err.message); })
        );
      }

      // GFG — use public profile scraper
      if (req.user.gfgUsername) {
        promises.push(
          fetchWithTimeout(`https://geeks-for-geeks-api.vercel.app/api/${req.user.gfgUsername}`)
            .then(r => r.ok ? r.json() : null)
            .then(data => { if (data) gfgStats = data; })
            .catch(err => { console.error("GFG fetch error:", err.message); })
        );
      }
      
      if (promises.length > 0) await Promise.all(promises);
    } catch (err) {
      console.error("CP stats fetch error:", err);
    }

    res.json({
      success: true,
      data: {
        taskTimeline,
        taskSummary: taskSummary.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        prioritySummary: prioritySummary.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {}),
        snippetStats,
        weeklyProductivity,
        localActivity,
        leetcodeStats,
        gfgStats,
        streak: {
          current: currentStreak,
          totalDays: allDates.length,
          lastActivity: allDates[0] || null
        }
      },
    });
  } catch (error) {
    next(error);
  }
};

// Simple in-memory cache for GitHub data (lasts 10 minutes)
const githubCache = new Map();
const CACHE_TTL = 10 * 60 * 1000;

// @desc    Get GitHub-proxy analytics (avoids frontend CORS/rate-limit issues)
// @route   GET /api/v1/analytics/github/:username
export const getGithubAnalytics = async (req, res, next) => {
  try {
    const { username } = req.params;
    const cacheKey = username.toLowerCase();

    // Check cache
    if (githubCache.has(cacheKey)) {
      const cached = githubCache.get(cacheKey);
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        console.log(`[Cache Hit] Returning cached data for: ${username}`);
        return res.json({ success: true, data: cached.data });
      }
    }

    console.log(`[Cache Miss] Fetching fresh GitHub data for: ${username}`);
    
    // Use OAuth client credentials for higher rate limits (5000/hr vs 60/hr)
    const ghAuth = process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET
      ? `client_id=${process.env.GITHUB_CLIENT_ID}&client_secret=${process.env.GITHUB_CLIENT_SECRET}`
      : "";
    const sep = (url) => url.includes("?") ? "&" : "?";

    const [userRes, reposRes, eventsRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}${sep(`https://api.github.com/users/${username}`)}${ghAuth}`, { headers: { "User-Agent": "DevTrackr" } }),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated&${ghAuth}`, { headers: { "User-Agent": "DevTrackr" } }),
      fetch(`https://api.github.com/users/${username}/events?per_page=100&${ghAuth}`, { headers: { "User-Agent": "DevTrackr" } }),
    ]);

    if (!userRes.ok) {
      return res.status(userRes.status).json({
        success: false,
        message: "GitHub user not found",
      });
    }

    const [user, repos, events] = await Promise.all([
      userRes.json(),
      reposRes.json(),
      eventsRes.json(),
    ]);

    // Aggregate language distribution from repos
    const languageMap = {};
    repos.forEach((repo) => {
      if (repo.language) {
        languageMap[repo.language] = (languageMap[repo.language] || 0) + 1;
      }
    });

    const languageDistribution = Object.entries(languageMap)
      .map(([name, count]) => ({ name, count, percentage: Math.round((count / repos.length) * 100) }))
      .sort((a, b) => b.count - a.count);

    // Aggregate recent activity and weekly productivity from events
    const activityByDay = {};
    const weeklyProductivityRaw = {};
    const today = new Date();

    // Initialize 8 weeks
    for (let i = 0; i < 8; i++) {
       weeklyProductivityRaw[`W${8 - i}`] = { week: `W${8 - i}`, commits: 0, prs: 0, reviews: 0, issues: 0 };
    }

    events.forEach((event) => {
      const eventDate = new Date(event.created_at);
      const dateStr = event.created_at.split("T")[0];
      activityByDay[dateStr] = (activityByDay[dateStr] || 0) + 1;

      // Calculate which week this event falls into (0-7 weeks ago)
      const diffTime = Math.abs(today - eventDate);
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const weekAgo = Math.floor(diffDays / 7);
      
      if (weekAgo < 8) {
         const weekKey = `W${8 - weekAgo}`;
         if (event.type === 'PushEvent') weeklyProductivityRaw[weekKey].commits += event.payload?.commits?.length || 1;
         else if (event.type === 'PullRequestEvent') weeklyProductivityRaw[weekKey].prs += 1;
         else if (event.type === 'PullRequestReviewEvent' || event.type === 'PullRequestReviewCommentEvent') weeklyProductivityRaw[weekKey].reviews += 1;
         else if (event.type === 'IssuesEvent') weeklyProductivityRaw[weekKey].issues += 1;
      }
    });

    const weeklyProductivity = Object.values(weeklyProductivityRaw).sort((a, b) => a.week.localeCompare(b.week));

    const result = {
      profile: {
        login: user.login,
        name: user.name,
        avatar_url: user.avatar_url,
        bio: user.bio,
        public_repos: user.public_repos,
        followers: user.followers,
        following: user.following,
        location: user.location,
        company: user.company,
        html_url: user.html_url,
      },
      repoCount: repos.length,
      totalStars: repos.reduce((sum, r) => sum + r.stargazers_count, 0),
      totalForks: repos.reduce((sum, r) => sum + r.forks_count, 0),
      languageDistribution,
      recentActivity: activityByDay,
      weeklyProductivity,
      repos: repos.map(r => ({
        id: r.id,
        name: r.name,
        description: r.description,
        stargazers_count: r.stargazers_count,
        forks_count: r.forks_count,
        language: r.language,
        html_url: r.html_url,
        updated_at: r.updated_at
      })),
      topRepos: repos
        .sort((a, b) => b.stargazers_count - a.stargazers_count)
        .slice(0, 5)
        .map((r) => ({
          name: r.name,
          stars: r.stargazers_count,
          forks: r.forks_count,
          language: r.language,
          url: r.html_url,
        })),
    };

    // Store in cache
    githubCache.set(cacheKey, { timestamp: Date.now(), data: result });

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};
