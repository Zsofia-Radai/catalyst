import type { HabitMeta } from "../../../habits/types/habit";
import type { Session } from "../../types/session";

export const DAY_VIEW_HOUR_HEIGHT = 108;
export const WEEK_VIEW_HOUR_HEIGHT = 72;

export const getSessionStyle = (
  session: Session,
  meta: HabitMeta,
  hourHeight: number,
) => {
  const start = new Date(session.startedAt);
  const end = new Date(session.finishedAt);

  const startMinutes = start.getMinutes();
  let durationMinutes = (end.getTime() - start.getTime()) / 1000 / 60;

  if (durationMinutes < 0) {
    durationMinutes += 24 * 60;
  }

  return {
    top: `${(startMinutes / 60) * hourHeight}px`,
    height: `${(durationMinutes / 60) * hourHeight}px`,
    "--card-color": meta.color,
  };
};
