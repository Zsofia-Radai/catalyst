import type { Habit, HabitInputs } from "../features/habits/types/habit";
import { buildHabit } from "../features/habits/utils/habitsUtils";

const HABITS_STORAGE_KEY = "habits";

export async function getHabits(): Promise<Habit[]> {
  const habits = localStorage.getItem("habits");

  if (!habits) {
    return [];
  }

  return JSON.parse(habits) as Habit[];
}

export async function saveHabits(habits: Habit[]): Promise<void> {
  localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habits));
}

export async function createHabit(habitInputs: HabitInputs): Promise<Habit> {
  const habits = await getHabits();
  const habit = buildHabit(habitInputs);

  const updatedHabits = [...habits, habit];

  await saveHabits(updatedHabits);

  return habit;
}

export async function deleteHabit(habitId: string): Promise<void> {
  const habits = await getHabits();
  const updatedHabits = habits.filter((habit) => habit.id !== habitId);
  await saveHabits(updatedHabits);
}

export async function updateHabit(updatedHabit: Habit): Promise<void> {
  const habits = await getHabits();
  const updatedHabits = habits.map((habit) =>
    habit.id === updatedHabit.id ? updatedHabit : habit,
  );
  await saveHabits(updatedHabits);
}

export async function archiveHabit(habitId: string): Promise<void> {
  const habits = await getHabits();
  const updatedHabits = habits.map((habit) =>
    habit.id === habitId ? { ...habit, archived: true } : habit,
  );
  await saveHabits(updatedHabits);
}

export async function restoreHabit(habitId: string): Promise<void> {
  const habits = await getHabits();
  const updatedHabits = habits.map((habit) =>
    habit.id === habitId ? { ...habit, archived: false } : habit,
  );
  await saveHabits(updatedHabits);
}
