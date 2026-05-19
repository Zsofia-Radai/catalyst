import { createContext, useContext } from "react";
import type { Habit } from "../types/habit";

export type HabitsContextValue = {
  habits: Habit[];
  activeHabits: Habit[];
  archivedHabits: Habit[];
  addHabit: (habit: Habit) => void;
  deleteHabit: (habitId: string) => void;
  restoreHabit: (habitId: string) => void;
  archiveHabit: (habitId: string) => void;
  updateHabit: (habit: Habit) => void;
};

export const HabitsContext = createContext<HabitsContextValue | null>(null);

export function useHabits() {
  const context = useContext(HabitsContext);

  if (!context) {
    throw new Error("useHabits must be used within HabitsProvider");
  }

  return context;
}
