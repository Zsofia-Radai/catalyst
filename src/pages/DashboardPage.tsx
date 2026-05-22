import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHabits } from "../features/habits/context/HabitsContext";
import { DayPlanner } from "../features/sessions/components/Planner/DayPlanner/DayPlanner";
import {
  PLANNER_VIEW_TABS,
  PLANNER_VIEW_TYPES,
  type PlannerViewType,
} from "../features/sessions/components/Planner/plannerUtils";
import { WeekPlanner } from "../features/sessions/components/Planner/WeekPlanner/WeekPlanner";
import { EditSessionModal } from "../features/sessions/components/SessionModal/EditSessionModal";
import { NewSessionModal } from "../features/sessions/components/SessionModal/NewSessionModal";
import { useSessions } from "../features/sessions/context/SessionsContext";
import type { Session } from "../features/sessions/types/session";
import layout from "../layout/AppLayout.module.css";
import { EmptyState } from "../ui/EmptyState/EmptyState";
import { Tabs } from "../ui/Tabs/Tabs";
import { formatCurrentDate } from "../utils/dashboardUtils";
import styles from "./DashboardPage.module.css";

export function DasboardPage() {
  const { activeHabits } = useHabits();
  const { sessions } = useSessions();
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

  return (
    <div className={layout.page}>
      {activeHabits.length === 0 ? (
        <div className={styles.emptyState}>
          <EmptyState
            title="No active habits yet."
            description="Create your first habit to start tracking sessions."
            actionLabel="Go to habits page"
            action={() => navigate("/habits")}
          />
        </div>
      ) : (
        <>
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
              <div className={styles.dayHeader}>
                {formatCurrentDate(currentDate)}
              </div>
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
        </>
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
