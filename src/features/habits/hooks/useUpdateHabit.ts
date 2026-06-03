import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateHabit as updateHabitApi } from "../../../api/habitsApi";

export function useUpdateHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateHabitApi,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["habits"],
      }),
  });
}
