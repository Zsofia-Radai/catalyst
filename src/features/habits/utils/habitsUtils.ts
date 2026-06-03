import type { Session } from "../../sessions/types/session";

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
