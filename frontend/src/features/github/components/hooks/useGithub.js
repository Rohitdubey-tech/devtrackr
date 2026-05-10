import { useQuery } from "@tanstack/react-query";
import { getGithubData } from "../../../../services/github.service";

export const useGithub = (username) => {
  const query = useQuery({
    queryKey: ["github", username],
    queryFn: () => getGithubData(username),
    enabled: !!username,
    staleTime: 5 * 60 * 1000, // 5 minutes cache on frontend too
  });

  return {
    isLoading: query.isLoading,
    isError: query.isError,
    data: query.data,
    repos: query.data?.repos || [],
    user: query.data?.profile || null
  };
};