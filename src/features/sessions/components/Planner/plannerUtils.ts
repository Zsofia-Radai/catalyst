import type { HabitMeta } from "../../../habits/types/habit";
import type { Session } from "../../types/session";

export const DAY_VIEW_HOUR_HEIGHT = 108;
export const WEEK_VIEW_HOUR_HEIGHT = 72;

export const PLANNER_VIEW_TYPES = {
  DAY: "day",
  WEEK: "week",
} as const;

export const HOUR_HEIGHTS = {
  [PLANNER_VIEW_TYPES.DAY]: DAY_VIEW_HOUR_HEIGHT,
  [PLANNER_VIEW_TYPES.WEEK]: WEEK_VIEW_HOUR_HEIGHT,
};

export type PlannerViewType =
  (typeof PLANNER_VIEW_TYPES)[keyof typeof PLANNER_VIEW_TYPES];

export const PLANNER_VIEW_TABS: { label: string; value: PlannerViewType }[] = [
  {
    label: "Day plan",
    value: "day",
  },
  {
    label: "Week plan",
    value: "week",
  },
];

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
