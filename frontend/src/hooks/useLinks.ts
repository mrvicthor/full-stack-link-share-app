import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getLinks } from "@/api/auth";

export const LINKS = "links";

const useLinks = (opts = {}) => {
  const queryClient = useQueryClient();
  const {
    error,
    data: links,
    ...rest
  } = useQuery({
    queryKey: [LINKS],
    queryFn: getLinks,
    retry: 1,
    staleTime: Infinity,
    ...opts,
  });

  if (error) {
    queryClient.setQueryData([LINKS], null);
  }
  return { links, ...rest };
};

export default useLinks;
