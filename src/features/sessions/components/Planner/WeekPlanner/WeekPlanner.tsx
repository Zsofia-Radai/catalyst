import type { Habit } from "../../../../habits/types/habit";
import type { Session } from "../../../types/session";
import { DayPlanner } from "../DayPlanner/DayPlanner";
import type { PlannerViewType } from "../plannerUtils";
import styles from "./WeekPlanner.module.css";

type WeekPlannerProps = {
  sessions: Session[];
  habits: Habit[];
  plannerViewType: PlannerViewType;
  daytime?: boolean;
  onAddSession: (hour: number, day: Date) => void;
  openSessionEditor: (session: Session, day: Date) => void;
  weekDates: Date[];
};

export function WeekPlanner({
  sessions,
  habits,
  plannerViewType,
  daytime = true,
  onAddSession,
  openSessionEditor,
  weekDates,
}: WeekPlannerProps) {
  return (
    <div className={styles.weekPlanner}>
      {weekDates.map((day) => (
        <div key={day.getDate()}>
          <DayPlanner
            plannerViewType={plannerViewType}
            day={day}
            sessions={sessions}
            habits={habits}
            onAddSession={onAddSession}
            openSessionEditor={openSessionEditor}
            daytime={daytime}
          />
        </div>
      ))}
    </div>
  );
}
