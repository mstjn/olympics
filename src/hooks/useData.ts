import { useQuery } from "@tanstack/react-query";
import { getOlympics } from "../api/api";

export const useData = () => {
  return useQuery({
    queryKey: ["olympics"],
    queryFn: getOlympics,
    staleTime: 1000 * 60 * 5,
  });
};