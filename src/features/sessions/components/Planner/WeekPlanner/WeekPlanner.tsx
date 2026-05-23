import { addDays, startOfWeek } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "../../../../../ui/Button/Button";
import { formatDate, getWeekDates } from "../../../../../utils/dashboardUtils";
import type { Habit } from "../../../../habits/types/habit";
import type { Session } from "../../../types/session";
import { DayPlanner } from "../DayPlanner/DayPlanner";
import type { PlannerViewType } from "../plannerUtils";
import styles from "./WeekPlanner.module.css";

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
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );

  const currentDate = new Date();
  const weekDates = getWeekDates(currentWeekStart);

  const goToNextWeek = () => {
    setCurrentWeekStart((prev) => addDays(prev, 7));
  };

  const goToPreviousWeek = () => {
    setCurrentWeekStart((prev) => addDays(prev, -7));
  };

  return (
    <>
      <header className={styles.calendarHeader}>
        <Button
          className={styles.prevButton}
          onClick={() => goToPreviousWeek()}
        >
          Previous week
        </Button>
        <div className={styles.currentDate}>{formatDate(currentDate)}</div>
        <Button className={styles.nextButton} onClick={() => goToNextWeek()}>
          Next week
        </Button>
      </header>

      <div className={styles.weekPlanner}>
        <ChevronLeft
          className={styles.arrowLeft}
          onClick={() => goToPreviousWeek()}
        />
        <ChevronRight
          className={styles.arrowRight}
          onClick={() => goToNextWeek()}
        />
        {weekDates.map((day) => (
          <div key={day.getDate()}>
            <DayPlanner
              plannerViewType={plannerViewType}
              day={day}
              sessions={sessions}
              habits={habits}
              onAddSession={onAddSession}
              openSessionEditor={openSessionEditor}
            />
          </div>
        ))}
      </div>
    </>
  );
}
