import { create } from "zustand";
import { api } from "../../services/api";

const languageColors = {
  JavaScript: "#f7df1e",
  TypeScript: "#3178c6",
  Python: "#3572A5",
  Go: "#00ADD8",
  Rust: "#dea584",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Java: "#b07219",
  C: "#555555",
  "C++": "#f34b7d",
  "C#": "#178600",
  PHP: "#4F5D95",
  Ruby: "#701516",
  Other: "#6b7280",
};

// Map GitHub recentActivity object to heatmap format
const formatHeatmapData = (recentActivity) => {
  const data = [];
  const today = new Date();
  
  for (let week = 19; week >= 0; week--) {
    for (let day = 0; day < 7; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (week * 7 + (6 - day)));
      const dateStr = date.toISOString().split("T")[0];
      
      data.push({
        date: dateStr,
        count: recentActivity[dateStr] || 0,
        day,
        week: 19 - week,
      });
    }
  }
  return data;
};

export const useAnalyticsStore = create((set) => ({
  heatmapData: [],
  githubHeatmapData: [],
  localHeatmapData: [],
  languageData: [],
  weeklyProductivity: [],
  timeRange: "8w",
  isLoading: false,
  
  setTimeRange: (range) => set({ timeRange: range }),
  
  fetchRealAnalytics: async (githubUsername, localActivity = {}) => {
    set({ isLoading: true });
    
    // Always build local heatmap from local activity
    const localHeatmap = formatHeatmapData(localActivity);

    try {
      const { data } = await api.get(`/analytics/github/${githubUsername || "unknown"}`);
      const result = data.data;
      
      if (result) {
        // GitHub-only activity
        const githubActivity = result.recentActivity || {};
        const githubHeatmap = formatHeatmapData(githubActivity);

        // Merged activity for the combined heatmap
        const combinedActivity = { ...localActivity };
        Object.entries(githubActivity).forEach(([date, count]) => {
          combinedActivity[date] = (combinedActivity[date] || 0) + count;
        });

        // Format language distribution with colors
        const formattedLanguageData = (result.languageDistribution || []).map(lang => ({
          name: lang.name,
          value: lang.percentage,
          color: languageColors[lang.name] || languageColors.Other
        }));
        
        set({
          heatmapData: formatHeatmapData(combinedActivity),
          githubHeatmapData: githubHeatmap,
          localHeatmapData: localHeatmap,
          languageData: formattedLanguageData,
          weeklyProductivity: result.weeklyProductivity || [],
          isLoading: false
        });
      }
    } catch (error) {
      // If GitHub fails, still show local activity
      set({ 
        heatmapData: localHeatmap,
        githubHeatmapData: [],
        localHeatmapData: localHeatmap,
        isLoading: false 
      });
      console.error("Failed to fetch GitHub analytics:", error);
    }
  }
}));
