import { useEffect, useState } from "react";
import {
  archiveHabit as archiveHabitApi,
  createHabit as createHabitApi,
  deleteHabit as deleteHabitApi,
  getHabits,
  restoreHabit as restoreHabitApi,
  updateHabit as updateHabitApi,
} from "../../../api/habitsApi";
import { getErrorMessage } from "../../../utils/errorUtils";
import type { Habit, HabitInputs } from "../types/habit";
import { HabitsContext, type HabitsContextValue } from "./HabitsContext";

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isHabitsInitialized, setIsHabitsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadHabits() {
      try {
        const habits = await getHabits();
        setHabits(habits);
      } catch {
        setError("Failed to load habits.");
      } finally {
        setIsHabitsInitialized(true);
      }
    }

    loadHabits();
  }, []);

  const activeHabits = habits.filter(
    (habit: Habit) => habit.archived === false,
  );
  const archivedHabits = habits.filter(
    (habit: Habit) => habit.archived === true,
  );

  const createHabit = async (habitInputs: HabitInputs) => {
    setError(null);

    try {
      const habit = await createHabitApi(habitInputs);
      setHabits((prev) => [...prev, habit]);
    } catch (err) {
      const message = getErrorMessage(err);
      throw new Error(message, { cause: err });
    }
  };

  const updateHabit = async (habit: Habit) => {
    setError(null);

    try {
      await updateHabitApi(habit);
      setHabits((prev: Habit[]) =>
        prev.map((prevHabit) =>
          prevHabit.id === habit.id ? habit : prevHabit,
        ),
      );
    } catch (err) {
      const message = getErrorMessage(err);
      throw new Error(message, { cause: err });
    }
  };

  const deleteHabit = async (habitId: string) => {
    setError(null);

    try {
      await deleteHabitApi(habitId);
      setHabits((prev: Habit[]) =>
        prev.filter((habit) => habit.id !== habitId),
      );
    } catch (err) {
      const message = getErrorMessage(err);
      throw new Error(message, { cause: err });
    }
  };

  const archiveHabit = async (habitId: string) => {
    setError(null);

    try {
      await archiveHabitApi(habitId);
      setHabits((prev: Habit[]) =>
        prev.map((prevHabit) =>
          prevHabit.id === habitId
            ? { ...prevHabit, archived: true }
            : prevHabit,
        ),
      );
    } catch (err) {
      const message = getErrorMessage(err);
      throw new Error(message, { cause: err });
    }
  };

  const restoreHabit = async (habitId: string) => {
    setError(null);

    try {
      await restoreHabitApi(habitId);
      setHabits((prev: Habit[]) =>
        prev.map((prevHabit) =>
          prevHabit.id === habitId
            ? { ...prevHabit, archived: false }
            : prevHabit,
        ),
      );
    } catch (err) {
      const message = getErrorMessage(err);
      throw new Error(message, { cause: err });
    }
  };

  const value: HabitsContextValue = {
    habits,
    activeHabits,
    archivedHabits,
    createHabit,
    deleteHabit,
    updateHabit,
    archiveHabit,
    restoreHabit,
    isHabitsInitialized,
    error,
  };
  return (
    <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>
  );
}
