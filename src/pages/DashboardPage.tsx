import { useState } from "react";
import { SessionBlock } from "../components/SessionBlock/SessionBlock";
import { NewSessionForm } from "../components/SessionModal/NewSessionForm";
import layout from "../layout/AppLayout.module.css";
import { type Habit } from "../types/habit";
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
import { useSessions } from "../context/SessionsContext";

export function DasboardPage() {
  const [storedHabits] = useState<Habit[]>(() =>
    JSON.parse(localStorage.getItem("habits") || "[]"),
  );
  const { sessions } = useSessions();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showNightSessions, setShowNightSessions] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const currentDate = new Date();
  const todaysSessions = sessions.filter((session) =>
    isSameDay(new Date(session.startedAt), currentDate),
  );

  const addSession = (hour: number) => {
    setStartTime(hour);
    setIsModalOpen(true);
  };

  const cancelSessionModal = () => {
    setIsModalOpen(false);
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
                    key={session.id}
                    session={session}
                    habits={storedHabits}
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

      {isModalOpen && (
        <NewSessionForm
          onCancel={cancelSessionModal}
          startTime={startTime}
          habits={storedHabits}
        />
      )}
    </div>
  );
}
