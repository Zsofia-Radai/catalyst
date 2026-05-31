import type { Habit, HabitInputs } from "../features/habits/types/habit";
import { supabase } from "../lib/supabase";

export async function getHabits(): Promise<Habit[]> {
  const { data, error } = await supabase.from("habits").select("*");

  if (error) throw error;

  return data;
}

export async function createHabit(habitInputs: HabitInputs): Promise<Habit> {
  const { data, error } = await supabase
    .from("habits")
    .insert({
      name: habitInputs.name,
      category: habitInputs.category,
      goal: habitInputs.goal ?? null,
      color: habitInputs.color,
      archived: false,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function deleteHabit(habitId: string): Promise<void> {
  const { error } = await supabase.from("habits").delete().eq("id", habitId);

  if (error) throw error;
}

export async function updateHabit(updatedHabit: Habit): Promise<Habit> {
  const { data, error } = await supabase
    .from("habits")
    .update({
      name: updatedHabit.name,
      category: updatedHabit.category,
      goal: updatedHabit.goal ?? null,
      color: updatedHabit.color,
      archived: updatedHabit.archived,
    })
    .eq("id", updatedHabit.id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function archiveHabit(habitId: string): Promise<void> {
  const { error } = await supabase
    .from("habits")
    .update({
      archived: true,
    })
    .eq("id", habitId);

  if (error) throw error;
}

export async function restoreHabit(habitId: string): Promise<void> {
  const { error } = await supabase
    .from("habits")
    .update({
      archived: false,
    })
    .eq("id", habitId);

  if (error) throw error;
}
