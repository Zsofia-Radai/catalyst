import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  archiveHabit as archiveHabitApi,
  createHabit as createHabitApi,
  deleteHabit as deleteHabitApi,
  getHabits,
  restoreHabit as restoreHabitApi,
  updateHabit as updateHabitApi,
} from "../../../api/habitsApi";
import type { Habit, HabitInputs } from "../types/habit";
import { HabitsContext, type HabitsContextValue } from "./HabitsContext";
import { getErrorMessage } from "../../../utils/errorUtils";

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["habits"],
    queryFn: getHabits,
  });

  const invalidateHabits = () =>
    queryClient.invalidateQueries({
      queryKey: ["habits"],
    });

  const createHabitMutation = useMutation({
    mutationFn: createHabitApi,
    onSuccess: invalidateHabits,
  });

  const updateHabitMutation = useMutation({
    mutationFn: updateHabitApi,
    onSuccess: invalidateHabits,
  });

  const deleteHabitMutation = useMutation({
    mutationFn: deleteHabitApi,
    onSuccess: invalidateHabits,
  });

  const archiveHabitMutation = useMutation({
    mutationFn: archiveHabitApi,
    onSuccess: invalidateHabits,
  });

  const restoreHabitMutation = useMutation({
    mutationFn: restoreHabitApi,
    onSuccess: invalidateHabits,
  });

  const createHabit = async (habitInputs: HabitInputs) => {
    await createHabitMutation.mutateAsync(habitInputs);
  };

  const updateHabit = async (habit: Habit) => {
    await updateHabitMutation.mutateAsync(habit);
  };

  const deleteHabit = async (habitId: string) => {
    await deleteHabitMutation.mutateAsync(habitId);
  };

  const archiveHabit = async (habitId: string) => {
    await archiveHabitMutation.mutateAsync(habitId);
  };

  const restoreHabit = async (habitId: string) => {
    await restoreHabitMutation.mutateAsync(habitId);
  };

  const value: HabitsContextValue = {
    habits: query.data ?? [],
    createHabit,
    deleteHabit,
    updateHabit,
    archiveHabit,
    restoreHabit,
    isHabitsLoading: query.isLoading,
    error: query.error ? getErrorMessage(query.error) : null,
  };
  return (
    <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>
  );
}
