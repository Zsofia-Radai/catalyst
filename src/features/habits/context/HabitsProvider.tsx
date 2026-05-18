import { useEffect, useState } from "react";
import { HabitsContext, type HabitsContextValue } from "./HabitsContext";
import type { Habit } from "../types/habit";

export function HabitsProvider({ children }: { children: React.ReactNode }) {
  const [habits, setHabits] = useState<Habit[]>(() =>
    JSON.parse(localStorage.getItem("habits") || "[]"),
  );

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  const addHabit = (habit: Habit) => {
    setHabits((prev) => [...prev, habit]);
  };

  const updateHabit = (habit: Habit) => {
    setHabits((prev) =>
      prev.map((prevHabit) => (prevHabit.id === habit.id ? habit : prevHabit)),
    );
  };

  const deleteHabit = (habitId: string) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== habitId));
  };

  const updateHabitLoggedHours = (habitId: string, hours: number) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === habitId
          ? { ...habit, loggedHours: (habit.loggedHours ?? 0) + hours }
          : habit,
      ),
    );
  };

  const value: HabitsContextValue = {
    habits,
    addHabit,
    deleteHabit,
    updateHabit,
    updateHabitLoggedHours,
  };
  return (
    <HabitsContext.Provider value={value}>{children}</HabitsContext.Provider>
  );
}
