import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  DAY_HOURS,
  formatDate,
  formatTime,
  getSessionForHour,
  getSessionsForToday,
  isPastDay,
  NIGHT_HOURS,
} from "../../../../../utils/dashboardUtils";
import type { Habit } from "../../../../habits/types/habit";
import type { Session } from "../../../types/session";
import { SessionBlock } from "../../SessionBlock/SessionBlock";
import {
  HOUR_HEIGHTS,
  PLANNER_VIEW_TYPES,
  type PlannerViewType,
} from "../plannerUtils";
import styles from "./DayPlanner.module.css";
import { addDays, isSameDay } from "date-fns";
import { useState } from "react";

type DayPlannerProps = {
  day: Date;
  sessions: Session[];
  habits: Habit[];
  plannerViewType: PlannerViewType;
  daytime: boolean;
  onAddSession: (hour: number, day: Date) => void;
  openSessionEditor: (session: Session, day: Date) => void;
};

export function DayPlanner({
  day,
  sessions,
  habits,
  plannerViewType,
  onAddSession,
  openSessionEditor,
  daytime,
}: DayPlannerProps) {
  const [currentDay, setCurrentDay] = useState(day);
  const hourHeight = HOUR_HEIGHTS[plannerViewType];
  const currentDate = new Date();
  const isPast = isPastDay(day);
  const HOURS = daytime ? DAY_HOURS : NIGHT_HOURS;
  const timelineBorder =
    plannerViewType === PLANNER_VIEW_TYPES.WEEK
      ? isSameDay(currentDate, day)
        ? styles.currentDay
        : ""
      : "";

  const goToNextDay = () => {
    setCurrentDay((prev) => addDays(prev, 1));
  };

  const goToPreviousDay = () => {
    setCurrentDay((prev) => addDays(prev, -1));
  };

  return (
    <div className={`${styles.dayPlanner} ${isPast ? styles.pastDay : ""}`}>
      {plannerViewType === PLANNER_VIEW_TYPES.DAY && (
        <div>
          <ChevronLeft
            className={styles.arrowLeft}
            onClick={() => goToPreviousDay()}
          />
          <ChevronRight
            className={styles.arrowRight}
            onClick={() => goToNextDay()}
          />
        </div>
      )}
      <div
        className={`${styles.header} ${isSameDay(currentDate, currentDay) ? styles.currentDayHeader : ""}`}
      >
        {formatDate(currentDay)}
      </div>
      <div className={`${styles.timeline} ${timelineBorder}`}>
        {HOURS.map((hour) => {
          const hourSessions = getSessionForHour(
            getSessionsForToday(sessions, currentDay),
            hour,
          );
          return (
            <div
              key={hour}
              className={styles.hourRow}
              style={{ minHeight: hourHeight }}
              onClick={() => onAddSession(hour, currentDay)}
            >
              <span>{formatTime(hour)}</span>
              <div className={styles.hourContent}>
                {hourSessions.map((session) => (
                  <SessionBlock
                    plannerViewType={plannerViewType}
                    onClick={() => openSessionEditor(session, currentDay)}
                    key={session.id}
                    session={session}
                    habits={habits}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
