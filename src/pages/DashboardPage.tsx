import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DayPlanner } from "../features/sessions/components/Planner/DayPlanner/DayPlanner";
import {
  PLANNER_VIEW_TABS,
  PLANNER_VIEW_TYPES,
  type PlannerViewType,
} from "../features/sessions/components/Planner/plannerUtils";
import { WeekPlanner } from "../features/sessions/components/Planner/WeekPlanner/WeekPlanner";
import { EditSessionModal } from "../features/sessions/components/SessionModal/EditSessionModal/EditSessionModal";
import { NewSessionModal } from "../features/sessions/components/SessionModal/NewSessionModal/NewSessionModal";
import type { Session } from "../features/sessions/types/session";
import layout from "../layout/AppLayout.module.css";
import { EmptyState } from "../ui/EmptyState/EmptyState";
import { Tabs } from "../ui/Tabs/Tabs";
import styles from "./DashboardPage.module.css";
import { PageLoader } from "../ui/PageLoader/PageLoader";
import { useHabits } from "../features/habits/hooks/useHabits";
import { getErrorMessage } from "../utils/errorUtils";
import { useSessions } from "../features/sessions/hooks/useSessions";
import { Button } from "../ui/Button/Button";
import { isNightSession } from "../features/sessions/utils/sessionsUtils";
import { formatDate, getWeekDates } from "../utils/dashboardUtils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { addDays, startOfWeek } from "date-fns";

export function DashboardPage() {
  const {
    data: habits = [],
    isLoading: isHabitsLoading,
    error: habitsError,
  } = useHabits();
  const {
    data: sessions = [],
    isLoading: isSessionsLoading,
    error: sessionsError,
  } = useSessions();
  const navigate = useNavigate();
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const [isEditSessionModalOpen, setIsEditSessionModalOpen] = useState(false);
  const [newSessionstartTime, setNewSessionStartTime] = useState(0);
  const [newSessionDate, setNewSessionDate] = useState(new Date());
  const [plannerView, setPlannerView] = useState<PlannerViewType>(
    PLANNER_VIEW_TYPES.WEEK,
  );
  const [showNightSessions, setShowNightSessions] = useState(false);

  const nightSessions = sessions.filter((session) => isNightSession(session));
  const [selectedSessionDate, setSelectedSessionDate] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const currentDate = new Date();
  const activeHabits = habits.filter((habit) => !habit.archived);
  const errors = [habitsError, sessionsError]
    .filter(Boolean)
    .map(getErrorMessage)
    .join("\n");
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );
  const weekDates = getWeekDates(currentWeekStart);

  const addSession = (hour: number, day: Date) => {
    setNewSessionStartTime(hour);
    setNewSessionDate(day);
    setIsNewSessionModalOpen(true);
  };

  const openSessionEditor = (session: Session, day: Date) => {
    setSelectedSession(session);
    setSelectedSessionDate(day);
    setIsEditSessionModalOpen(true);
  };

  const closeNewSessionModal = () => {
    setIsNewSessionModalOpen(false);
  };

  const closeEditSessionModal = () => {
    setIsEditSessionModalOpen(false);
  };

  const goToNextWeek = () => {
    setCurrentWeekStart((prev) => addDays(prev, 7));
  };

  const goToPreviousWeek = () => {
    setCurrentWeekStart((prev) => addDays(prev, -7));
  };

  if (isSessionsLoading || isHabitsLoading) {
    return (
      <div className={layout.page}>
        <PageLoader />
      </div>
    );
  }

  if (sessionsError || habitsError) {
    return (
      <div className={layout.page}>
        <EmptyState title="Error" description={errors} />
      </div>
    );
  }

  if (activeHabits.length === 0) {
    return (
      <div className={layout.page}>
        <EmptyState
          title="No active habits yet."
          description="Create your first habit to start tracking sessions."
          actionLabel="Go to habits page"
          action={() => navigate("/habits")}
        />
      </div>
    );
  }

  return (
    <div className={layout.page}>
      <Tabs
        tabs={PLANNER_VIEW_TABS}
        value={plannerView}
        onChange={setPlannerView}
      />

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

      <div className={styles.plannerContainer}>
        <ChevronLeft
          className={styles.arrowLeft}
          onClick={() => goToPreviousWeek()}
        />
        <ChevronRight
          className={styles.arrowRight}
          onClick={() => goToNextWeek()}
        />

        {plannerView === PLANNER_VIEW_TYPES.WEEK ? (
          <WeekPlanner
            plannerViewType={PLANNER_VIEW_TYPES.WEEK}
            sessions={sessions}
            habits={activeHabits}
            onAddSession={addSession}
            openSessionEditor={openSessionEditor}
            weekDates={weekDates}
          />
        ) : (
          <div className={styles.dayPlan}>
            <DayPlanner
              plannerViewType={PLANNER_VIEW_TYPES.DAY}
              day={currentDate}
              sessions={sessions}
              habits={activeHabits}
              onAddSession={addSession}
              openSessionEditor={openSessionEditor}
              daytime={true}
            />
          </div>
        )}
      </div>
      <Button
        variant="secondary"
        onClick={() => setShowNightSessions(!showNightSessions)}
      >
        Show night sessions
      </Button>

      {showNightSessions &&
        (plannerView === PLANNER_VIEW_TYPES.WEEK ? (
          <WeekPlanner
            plannerViewType={PLANNER_VIEW_TYPES.WEEK}
            sessions={nightSessions}
            habits={activeHabits}
            onAddSession={addSession}
            openSessionEditor={openSessionEditor}
            daytime={false}
            weekDates={weekDates}
          />
        ) : (
          <div className={styles.dayPlan}>
            <DayPlanner
              plannerViewType={PLANNER_VIEW_TYPES.DAY}
              day={currentDate}
              sessions={nightSessions}
              habits={activeHabits}
              onAddSession={addSession}
              openSessionEditor={openSessionEditor}
              daytime={false}
            />
          </div>
        ))}

      {isNewSessionModalOpen && (
        <NewSessionModal
          closeModal={closeNewSessionModal}
          startTime={newSessionstartTime}
          day={newSessionDate}
          habits={activeHabits}
        />
      )}

      {isEditSessionModalOpen && selectedSession && (
        <EditSessionModal
          closeModal={closeEditSessionModal}
          session={selectedSession}
          day={selectedSessionDate}
          habits={activeHabits}
        />
      )}
    </div>
  );
}
