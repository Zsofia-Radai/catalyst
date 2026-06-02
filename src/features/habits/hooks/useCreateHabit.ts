import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createHabit as createHabitApi } from "../../../api/habitsApi";

export function useCreateHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createHabitApi,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["habits"],
      }),
  });
}
