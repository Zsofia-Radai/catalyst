import { useQuery } from "@tanstack/react-query";
import { getHabits } from "../../../api/habitsApi";

export function useHabits() {
  return useQuery({
    queryKey: ["habits"],
    queryFn: getHabits,
  });
}
