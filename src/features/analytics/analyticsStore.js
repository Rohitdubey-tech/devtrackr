import { create } from "zustand";

// Generate realistic-looking contribution data for last 20 weeks
const generateHeatmapData = () => {
  const data = [];
  const today = new Date();
  for (let week = 19; week >= 0; week--) {
    for (let day = 0; day < 7; day++) {
      const date = new Date(today);
      date.setDate(date.getDate() - (week * 7 + (6 - day)));
      const isWeekend = day === 0 || day === 6;
      const maxContribs = isWeekend ? 6 : 14;
      const contributions = Math.random() > 0.25 ? Math.floor(Math.random() * maxContribs) : 0;
      data.push({
        date: date.toISOString().split("T")[0],
        count: contributions,
        day,
        week: 19 - week,
      });
    }
  }
  return data;
};

const languageData = [
  { name: "JavaScript", value: 42, color: "#f7df1e" },
  { name: "TypeScript", value: 28, color: "#3178c6" },
  { name: "Python", value: 15, color: "#3572A5" },
  { name: "Go", value: 8, color: "#00ADD8" },
  { name: "Rust", value: 4, color: "#dea584" },
  { name: "Other", value: 3, color: "#6b7280" },
];

const weeklyProductivity = [
  { week: "W1", commits: 34, prs: 8, reviews: 12, issues: 5 },
  { week: "W2", commits: 41, prs: 11, reviews: 9, issues: 3 },
  { week: "W3", commits: 28, prs: 6, reviews: 15, issues: 7 },
  { week: "W4", commits: 55, prs: 14, reviews: 11, issues: 4 },
  { week: "W5", commits: 39, prs: 9, reviews: 18, issues: 6 },
  { week: "W6", commits: 47, prs: 12, reviews: 13, issues: 2 },
  { week: "W7", commits: 62, prs: 16, reviews: 20, issues: 8 },
  { week: "W8", commits: 51, prs: 13, reviews: 17, issues: 5 },
];

export const useAnalyticsStore = create((set) => ({
  heatmapData: generateHeatmapData(),
  languageData,
  weeklyProductivity,
  timeRange: "8w",
  setTimeRange: (range) => set({ timeRange: range }),
  regenerateHeatmap: () => set({ heatmapData: generateHeatmapData() }),
}));
