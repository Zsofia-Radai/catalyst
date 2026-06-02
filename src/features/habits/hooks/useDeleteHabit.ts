import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteHabit as deleteHabitApi } from "../../../api/habitsApi";

export function useDeleteHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteHabitApi,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["habits"],
      }),
  });
}
