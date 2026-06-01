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
  const [selectedSessionDate, setSelectedSessionDate] = useState(new Date());
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const currentDate = new Date();
  const activeHabits = habits.filter((habit) => !habit.archived);
  const errors = [habitsError, sessionsError]
    .filter(Boolean)
    .map(getErrorMessage)
    .join("\n");

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

      {plannerView === PLANNER_VIEW_TYPES.WEEK ? (
        <WeekPlanner
          plannerViewType={PLANNER_VIEW_TYPES.WEEK}
          sessions={sessions}
          habits={activeHabits}
          onAddSession={addSession}
          openSessionEditor={openSessionEditor}
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
          />
        </div>
      )}

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
