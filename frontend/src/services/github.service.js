import { api } from "./api";

// Use centralized backend proxy to avoid rate limits and use caching
export const getGithubData = async (username) => {
  const res = await api.get(`/analytics/github/${username}`);
  return res.data.data;
};