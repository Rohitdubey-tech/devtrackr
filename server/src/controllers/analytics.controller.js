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
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get GitHub-proxy analytics (avoids frontend CORS/rate-limit issues)
// @route   GET /api/v1/analytics/github/:username
export const getGithubAnalytics = async (req, res, next) => {
  try {
    const { username } = req.params;

    const [userRes, reposRes, eventsRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`),
      fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`),
      fetch(`https://api.github.com/users/${username}/events?per_page=100`),
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

    // Aggregate recent activity from events
    const activityByDay = {};
    events.forEach((event) => {
      const date = event.created_at.split("T")[0];
      activityByDay[date] = (activityByDay[date] || 0) + 1;
    });

    res.json({
      success: true,
      data: {
        profile: {
          login: user.login,
          name: user.name,
          avatar_url: user.avatar_url,
          bio: user.bio,
          public_repos: user.public_repos,
          followers: user.followers,
          following: user.following,
        },
        repoCount: repos.length,
        totalStars: repos.reduce((sum, r) => sum + r.stargazers_count, 0),
        totalForks: repos.reduce((sum, r) => sum + r.forks_count, 0),
        languageDistribution,
        recentActivity: activityByDay,
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
      },
    });
  } catch (error) {
    next(error);
  }
};
