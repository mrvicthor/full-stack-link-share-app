import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser } from "@/api/auth";

export const AUTH = "auth";

const useAuth = (opts = {}) => {
  const queryClient = useQueryClient();
  const {
    error,
    data: user,
    ...rest
  } = useQuery({
    queryKey: [AUTH],
    queryFn: getUser,
    retry: 1,
    staleTime: Infinity,
    ...opts,
  });

  if (error) {
    queryClient.setQueryData([AUTH], null);
  }

  return { user, error, isAuthenticated: !!user, ...rest };
};

export default useAuth;
