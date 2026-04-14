import { githubApi as api } from "./api";

export const getUser = async (username) => {
  const res = await api.get(`/users/${username}`);
  return res.data;
};

export const getRepos = async (username) => {
  const res = await api.get(`/users/${username}/repos`);
  return res.data;
};