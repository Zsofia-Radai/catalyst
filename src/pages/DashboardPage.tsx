import { useEffect, useState } from "react";
import { SessionBlock } from "../components/SessionBlock/SessionBlock";
import { SessionFormModal } from "../components/SessionModal/SessionFormModal";
import layout from "../layout/AppLayout.module.css";
import { type Habit } from "../types/habit";
import type { Session } from "../types/session";
import { Button } from "../ui/Button/Button";
import { EmptyState } from "../ui/EmptyState/EmptyState";
import {
  formatCurrentDate,
  formatTime,
  getSessionForHour,
  HOURS,
  isSameDay,
  NIGHT_HOURS,
} from "../utils/dashboardUtils";
import styles from "./DashboardPage.module.css";

export function DasboardPage() {
  const [storedHabits, setStoredHabits] = useState<Habit[]>(() =>
    JSON.parse(localStorage.getItem("habits") || "[]"),
  );
  const [storedSessions, setStoredSessions] = useState<Session[]>(() =>
    JSON.parse(localStorage.getItem("sessions") || "[]"),
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNightSessions, setShowNightSessions] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const currentDate = new Date();
  const todaysSessions = storedSessions.filter((session) =>
    isSameDay(new Date(session.startedAt), currentDate),
  );

  useEffect(() => {
    localStorage.setItem("sessions", JSON.stringify(storedSessions));
    localStorage.setItem("habits", JSON.stringify(storedHabits));
  }, [storedSessions, todaysSessions, storedHabits]);

  const addSession = (hour: number) => {
    setStartTime(hour);
    setIsModalOpen(true);
  };

  const cancelSessionModal = () => {
    setIsModalOpen(false);
  };

  function getSessionDurationHours(startedAt: Date, finishedAt: Date) {
    const diffMs = finishedAt.getTime() - startedAt.getTime();
    return diffMs / 1000 / 60 / 60;
  }

  const updateHabitLoggedHours = (habitId: string, hours: number) => {
    setStoredHabits((prev) =>
      prev.map((habit) =>
        habit.id === habitId
          ? { ...habit, loggedHours: (habit.loggedHours ?? 0) + hours }
          : habit,
      ),
    );
  };

  const handleSessionCreated = (session: Session) => {
    setStoredSessions((prev: Session[]) => [...prev, session]);
    const duration = getSessionDurationHours(
      session.startedAt,
      session.finishedAt,
    );
    updateHabitLoggedHours(session.habitId, duration);
    cancelSessionModal();
  };

  return (
    <div className={layout.page}>
      <div>{formatCurrentDate(currentDate)}</div>
      {!storedHabits && (
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
        {HOURS.map((hour) => {
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
                  <SessionBlock session={session} habits={storedHabits} />
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

      {isModalOpen && (
        <SessionFormModal
          onCancel={cancelSessionModal}
          onSessionCreated={handleSessionCreated}
          startTime={startTime}
          habits={storedHabits}
        />
      )}
    </div>
  );
}
