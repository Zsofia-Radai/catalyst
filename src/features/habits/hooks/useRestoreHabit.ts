import { useMutation, useQueryClient } from "@tanstack/react-query";
import { restoreHabit as restoreHabitApi } from "../../../api/habitsApi";
import type { Habit } from "../types/habit";

export function useRestoreHabit() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: restoreHabitApi,

    onMutate: async (habitId: string) => {
      await queryClient.cancelQueries({
        queryKey: ["habits"],
      });

      const previousHabits = queryClient.getQueryData<Habit[]>(["habits"]);

      queryClient.setQueryData<Habit[]>(["habits"], (old) =>
        old?.map((habit) =>
          habit.id === habitId ? { ...habit, archived: false } : habit,
        ),
      );

      return { previousHabits };
    },

    onError: (_error, _habitId, context) => {
      queryClient.setQueryData(["habits"], context?.previousHabits);
    },

    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["habits"],
      });
    },
  });
}
