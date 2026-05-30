import type { Session } from "../../sessions/types/session";
import type { Habit, HabitInputs } from "../types/habit";

export function buildHabit(data: HabitInputs): Habit {
  return {
    id: crypto.randomUUID(),
    name: data.name,
    category: data.category,
    createdAt: Date.now(),
    goal: data.goal,
    loggedHours: 0,
    archived: false,
    color: data.color,
  };
}

export function calculateHabitLoggedHours(
  habitId: string,
  sessions: Session[],
) {
  return sessions
    .filter((session) => session.habitId === habitId)
    .filter((session) => session.completed)
    .reduce((total, session) => {
      const started = new Date(session.startedAt).getTime();
      const finished = new Date(session.finishedAt).getTime();

      const durationInHours = (finished - started) / 1000 / 60 / 60;

      return total + durationInHours;
    }, 0);
}
