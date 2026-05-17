import { useState } from "react";
import { SessionBlock } from "../components/SessionBlock/SessionBlock";
import { EditSessionModal } from "../components/SessionModal/EditSessionModal";
import { NewSessionModal } from "../components/SessionModal/NewSessionModal";
import { useHabits } from "../context/HabitsContext";
import { useSessions } from "../context/SessionsContext";
import layout from "../layout/AppLayout.module.css";
import type { Session } from "../types/session";
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

export function DasboardPage() {
  const { habits } = useHabits();
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

  const closeNewSessionModal = () => {
    setIsNewSessionModalOpen(false);
  };

  const closeEditSessionModal = () => {
    setIsEditSessionModalOpen(false);
  };

  const handleSessionBlockClicked = (sessionId: string) => {
    const session = sessions.find((session) => session.id === sessionId);
    if (!session) return;
    setSelectedSession(session);
    setIsEditSessionModalOpen(true);
  };

  return (
    <div className={layout.page}>
      <div>{formatCurrentDate(currentDate)}</div>
      {!habits && (
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
          const sessions = getSessionForHour(todaysSessions, hour);
          return (
            <div
              key={hour}
              className={styles.hourRow}
              onClick={() => addSession(hour)}
            >
              <span>{formatTime(hour)}</span>
              <div className={styles.hourContent}>
                {sessions.map((session) => (
                  <SessionBlock
                    onClick={() => handleSessionBlockClicked(session.id)}
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
          habits={habits}
        />
      )}

      {isEditSessionModalOpen && selectedSession && (
        <EditSessionModal
          closeModal={closeEditSessionModal}
          session={selectedSession}
          habits={habits}
        />
      )}
    </div>
  );
}
