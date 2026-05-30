import { useEffect, useState } from "react";
import { getHabits } from "../../../api/habitsApi";
import type { Session } from "../../sessions/types/session";
import type { Habit, HabitInputs } from "../types/habit";
import { calculateHabitLoggedHours } from "../utils/habitsUtils";
import { HabitsContext, type HabitsContextValue } from "./HabitsContext";
import {
  createHabit as createHabitApi,
  deleteHabit as deleteHabitApi,
  updateHabit as updateHabitApi,
  archiveHabit as archiveHabitApi,
  restoreHabit as restoreHabitApi,
} from "../../../api/habitsApi";

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>([]);

  useEffect(() => {
    async function loadHabits() {
      const habits = await getHabits();
      setHabits(habits);
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
    const habit = await createHabitApi(habitInputs);
    setHabits((prev) => [...prev, habit]);
  };

  const updateHabit = async (habit: Habit) => {
    await updateHabitApi(habit);
    setHabits((prev: Habit[]) =>
      prev.map((prevHabit) => (prevHabit.id === habit.id ? habit : prevHabit)),
    );
  };

  const deleteHabit = async (habitId: string) => {
    await deleteHabitApi(habitId);
    setHabits((prev: Habit[]) => prev.filter((habit) => habit.id !== habitId));
  };

  const archiveHabit = async (habitId: string) => {
    await archiveHabitApi(habitId);
    setHabits((prev: Habit[]) =>
      prev.map((prevHabit) =>
        prevHabit.id === habitId ? { ...prevHabit, archived: true } : prevHabit,
      ),
    );
  };

  const restoreHabit = async (habitId: string) => {
    await restoreHabitApi(habitId);
    setHabits((prev: Habit[]) =>
      prev.map((prevHabit) =>
        prevHabit.id === habitId
          ? { ...prevHabit, archived: false }
          : prevHabit,
      ),
    );
  };

  const habitsWithLoggedHours = (sessions: Session[]) =>
    habits.map((habit) => ({
      ...habit,
      loggedHours: calculateHabitLoggedHours(habit.id, sessions),
    }));

  const value: HabitsContextValue = {
    habits,
    activeHabits,
    archivedHabits,
    createHabit,
    deleteHabit,
    updateHabit,
    archiveHabit,
    restoreHabit,
    habitsWithLoggedHours,
  };
  return (
    <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>
  );
}
