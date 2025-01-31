import { getPreview } from "@/api/auth";
import { useQuery } from "@tanstack/react-query";

export const PREVIEW = "preview";
const useDetails = (id: string, opts = {}) => {
  const query = useQuery({
    queryKey: [PREVIEW, id],
    queryFn: () => getPreview(id),
    select: (response) => response.data.userToReturn,
    retry: 1,
    staleTime: Infinity,
    ...opts,
  });

  return { user: query.data, ...query };
};

export default useDetails;
