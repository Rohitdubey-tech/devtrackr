import { useQuery } from "@tanstack/react-query";
import { getUser, getRepos } from "../../../../services/github.service";

export const useGithub = (username) => {
  const user = useQuery({
    queryKey: ["user", username],
    queryFn: () => getUser(username),
  });

  const repos = useQuery({
    queryKey: ["repos", username],
    queryFn: () => getRepos(username),
  });

  return { user, repos };
};