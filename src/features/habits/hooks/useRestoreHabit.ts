import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restoreHabit as restoreHabitApi } from "../../../api/habitsApi";

export function useRestoreHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreHabitApi,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["habits"],
      }),
  });
}
