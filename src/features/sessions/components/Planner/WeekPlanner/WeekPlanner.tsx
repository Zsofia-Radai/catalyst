import { isSameDay } from "date-fns";
import {
  formatDate,
  isPastDay,
  WEEK_DATES,
} from "../../../../../utils/dashboardUtils";
import { DayPlanner } from "../DayPlanner/DayPlanner";
import type { Session } from "../../../types/session";
import type { Habit } from "../../../../habits/types/habit";
import styles from "./WeekPlanner.module.css";
import type { PlannerViewType } from "../plannerUtils";

type WeekPlannerProps = {
  sessions: Session[];
  habits: Habit[];
  plannerViewType: PlannerViewType;
  onAddSession: (hour: number, day: Date) => void;
  openSessionEditor: (session: Session, day: Date) => void;
};

export function WeekPlanner({
  sessions,
  habits,
  plannerViewType,
  onAddSession,
  openSessionEditor,
}: WeekPlannerProps) {
  const currentDate = new Date();

  return (
    <div className={styles.weekPlanner}>
      {WEEK_DATES.map((day) => {
        const isPast = isPastDay(day);
        return (
          <div key={day.getDate()}>
            <div
              className={`${styles.header} ${isSameDay(currentDate, day) ? styles.currentDayHeader : ""}`}
            >
              {formatDate(day)}
            </div>

            <DayPlanner
              className={`${isSameDay(currentDate, day) ? styles.currentDay : ""} ${
                isPast ? styles.pastDay : ""
              }`}
              plannerViewType={plannerViewType}
              day={day}
              sessions={sessions}
              habits={habits}
              onAddSession={onAddSession}
              openSessionEditor={openSessionEditor}
            />
          </div>
        );
      })}
    </div>
  );
}
