import { createContext, useContext } from "react";
import type { Habit, HabitInputs } from "../types/habit";

export type HabitsContextValue = {
  habits: Habit[];
  activeHabits: Habit[];
  archivedHabits: Habit[];
  createHabit: (habitInputs: HabitInputs) => Promise<void>;
  deleteHabit: (habitId: string) => Promise<void>;
  restoreHabit: (habitId: string) => Promise<void>;
  archiveHabit: (habitId: string) => Promise<void>;
  updateHabit: (habit: Habit) => Promise<void>;
  isHabitsInitialized: boolean;
  error: string | null;
};

export const HabitsContext = createContext<HabitsContextValue | null>(null);

export function useHabits() {
  const context = useContext(HabitsContext);

  if (!context) {
    throw new Error("useHabits must be used within HabitsProvider");
  }

  return context;
}
