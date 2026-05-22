import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useHabits } from "../features/habits/context/HabitsContext";
import { DayPlanner } from "../features/sessions/components/Planner/DayPlanner/DayPlanner";
import { WeekPlanner } from "../features/sessions/components/Planner/WeekPlanner/WeekPlanner";
import { EditSessionModal } from "../features/sessions/components/SessionModal/EditSessionModal";
import { NewSessionModal } from "../features/sessions/components/SessionModal/NewSessionModal";
import { useSessions } from "../features/sessions/context/SessionsContext";
import type { Session } from "../features/sessions/types/session";
import layout from "../layout/AppLayout.module.css";
import { Button } from "../ui/Button/Button";
import { EmptyState } from "../ui/EmptyState/EmptyState";
import {
  formatCurrentDate,
  formatTime,
  NIGHT_HOURS,
} from "../utils/dashboardUtils";
import styles from "./DashboardPage.module.css";

type PlannerViewType = "day" | "week";

export function DasboardPage() {
  const { activeHabits } = useHabits();
  const { sessions } = useSessions();
  const navigate = useNavigate();
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const [isEditSessionModalOpen, setIsEditSessionModalOpen] = useState(false);
  const [showNightSessions, setShowNightSessions] = useState(false);
  const [newSessionstartTime, setNewSessionStartTime] = useState(0);
  const [newSessionDate, setNewSessionDate] = useState(new Date());
  const [plannerView, setPlannerView] = useState<PlannerViewType>("week");
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
          <div className={styles.tabs}>
            <div
              className={plannerView === "day" ? styles.activeTab : styles.tab}
              onClick={() => setPlannerView("day")}
            >
              Day plan
            </div>
            <div
              className={plannerView === "week" ? styles.activeTab : styles.tab}
              onClick={() => setPlannerView("week")}
            >
              Week plan
            </div>
          </div>

          {plannerView === "week" ? (
            <WeekPlanner
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

      {activeHabits.length !== 0 && (
        <section className={styles.nightSessions}>
          <Button
            type="button"
            onClick={() => setShowNightSessions((prev) => !prev)}
          >
            Show night sessions
          </Button>

          <div
            className={`${styles.nightDrawer} ${
              showNightSessions ? styles.open : ""
            }`}
          >
            <div className={styles.nightDrawerInner}>
              <div className={styles.timeline}>
                {NIGHT_HOURS.map((hour) => {
                  return (
                    <div key={hour} className={styles.hourRow}>
                      <span>{formatTime(hour)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
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
