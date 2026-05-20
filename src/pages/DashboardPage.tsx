import { useState } from "react";
import { SessionBlock } from "../features/sessions/components/SessionBlock/SessionBlock";
import { EditSessionModal } from "../features/sessions/components/SessionModal/EditSessionModal";
import { NewSessionModal } from "../features/sessions/components/SessionModal/NewSessionModal";
import { useHabits } from "../features/habits/context/HabitsContext";
import layout from "../layout/AppLayout.module.css";
import type { Session } from "../features/sessions/types/session";
import { Button } from "../ui/Button/Button";
import { EmptyState } from "../ui/EmptyState/EmptyState";
import {
  DAY_HOURS,
  formatCurrentDate,
  formatTime,
  getSessionForHour,
  isSameDay,
  NIGHT_HOURS,
} from "../utils/dashboardUtils";
import styles from "./DashboardPage.module.css";
import { useSessions } from "../features/sessions/context/SessionsContext";

export function DasboardPage() {
  const { activeHabits } = useHabits();
  const { sessions } = useSessions();
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const [isEditSessionModalOpen, setIsEditSessionModalOpen] = useState(false);
  const [showNightSessions, setShowNightSessions] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const currentDate = new Date();
  const todaysSessions = sessions.filter((session) =>
    isSameDay(new Date(session.startedAt), currentDate),
  );

  const addSession = (hour: number) => {
    setStartTime(hour);
    setIsNewSessionModalOpen(true);
  };

  const openSessionEditor = (session: Session) => {
    setSelectedSession(session);
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
      <div>{formatCurrentDate(currentDate)}</div>
      {!activeHabits && (
        <div>
          <div>No tracked sessions for today yet.</div>
          <EmptyState
            title="No habits yet."
            description="Create your first habit to start tracking sessions."
            actionLabel="Go to habits page"
            actionTo="/habits"
          />
        </div>
      )}
      <div className={styles.timeline}>
        {DAY_HOURS.map((hour) => {
          const hourSessions = getSessionForHour(todaysSessions, hour);
          return (
            <div
              key={hour}
              className={styles.hourRow}
              onClick={() => addSession(hour)}
            >
              <span>{formatTime(hour)}</span>
              <div className={styles.hourContent}>
                {hourSessions.map((session) => (
                  <SessionBlock
                    onClick={() => openSessionEditor(session)}
                    key={session.id}
                    session={session}
                    habits={activeHabits}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

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

      {isNewSessionModalOpen && (
        <NewSessionModal
          closeModal={closeNewSessionModal}
          startTime={startTime}
          habits={activeHabits}
        />
      )}

      {isEditSessionModalOpen && selectedSession && (
        <EditSessionModal
          closeModal={closeEditSessionModal}
          session={selectedSession}
          habits={activeHabits}
        />
      )}
    </div>
  );
}
