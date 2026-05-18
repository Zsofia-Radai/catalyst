import type { Habit, HabitInputs } from "../types/habit";

export function createHabit(data: HabitInputs): Habit {
  return {
    id: crypto.randomUUID(),
    name: data.name,
    category: data.category,
    createdAt: Date.now(),
    goal: data.goal,
    loggedHours: 0,
    archived: false,
  };
}
