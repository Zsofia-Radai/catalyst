import { useMutation, useQueryClient } from "@tanstack/react-query";
import { archiveHabit as archiveHabitApi } from "../../../api/habitsApi";

export function useArchiveHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: archiveHabitApi,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["habits"],
      }),
  });
}
