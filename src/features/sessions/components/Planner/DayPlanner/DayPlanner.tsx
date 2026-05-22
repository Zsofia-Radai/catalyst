import {
  DAY_HOURS,
  formatTime,
  getSessionForHour,
  getSessionsForToday,
} from "../../../../../utils/dashboardUtils";
import type { Habit } from "../../../../habits/types/habit";
import type { Session } from "../../../types/session";
import { SessionBlock } from "../../SessionBlock/SessionBlock";
import { HOUR_HEIGHTS, type PlannerViewType } from "../plannerUtils";
import styles from "./DayPlanner.module.css";

type DayPlannerProps = {
  className?: string;
  day: Date;
  sessions: Session[];
  habits: Habit[];
  plannerViewType: PlannerViewType;
  onAddSession: (hour: number, day: Date) => void;
  openSessionEditor: (session: Session, day: Date) => void;
};

export function DayPlanner({
  className,
  day,
  sessions,
  habits,
  plannerViewType,
  onAddSession,
  openSessionEditor,
}: DayPlannerProps) {
  const hourHeight = HOUR_HEIGHTS[plannerViewType];

  return (
    <div className={`${styles.timeline} ${className ?? ""}`}>
      {DAY_HOURS.map((hour) => {
        const hourSessions = getSessionForHour(
          getSessionsForToday(sessions, day),
          hour,
        );
        return (
          <div
            key={hour}
            className={styles.hourRow}
            style={{ minHeight: hourHeight }}
            onClick={() => onAddSession(hour, day)}
          >
            <span>{formatTime(hour)}</span>
            <div className={styles.hourContent}>
              {hourSessions.map((session) => (
                <SessionBlock
                  plannerViewType={plannerViewType}
                  onClick={() => openSessionEditor(session, day)}
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
  );
}
