import { useEffect, useState } from "react";
import layout from "../layout/AppLayout.module.css";
import { EmptyState } from "../ui/EmptyState/EmptyState";
import {
  formatCurrentDate,
  formatSessionTime,
  formatTime,
  getHabitData,
  HOURS,
} from "../utils/dashboardUtils";
import styles from "./DashboardPage.module.css";
import { SessionModal } from "../components/SessionModal/SessionModal";
import type { Session } from "../types/session";
import { HABIT_CATEGORY_META, type Habit } from "../types/habit";

const HOUR_HEIGHT = 72;

function isSameDay(date1: Date, date2: Date) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

function getSessionForHour(sessions: Session[], hour: number) {
  const sessionsForHour: Session[] = [];
  sessions.map((session) => {
    const sessionHour = new Date(session.startedAt).getHours();
    if (sessionHour === hour) {
      sessionsForHour.push(session);
    }
  });
  return sessionsForHour;
}

function getSessionStyle(session: Session) {
  const start = new Date(session.startedAt);
  const end = new Date(session.finishedAt);

  const startMinutes = start.getMinutes();

  const durationMinutes = (end.getTime() - start.getTime()) / 1000 / 60;

  return {
    top: `${(startMinutes / 60) * HOUR_HEIGHT}px`,
    height: `${(durationMinutes / 60) * HOUR_HEIGHT}px`,
  };
}

export function DasboardPage() {
  const [storedHabits] = useState<Habit[]>(() =>
    JSON.parse(localStorage.getItem("habits") || "[]"),
  );
  const [storedSessions, setStoredSessions] = useState<Session[]>(() =>
    JSON.parse(localStorage.getItem("sessions") || "[]"),
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const currentDate = new Date();
  const todaysSessions = storedSessions.filter((session) =>
    isSameDay(new Date(session.startedAt), currentDate),
  );

  useEffect(() => {
    localStorage.setItem("sessions", JSON.stringify(storedSessions));
    console.log(todaysSessions);
  }, [storedSessions, todaysSessions]);

  const addSession = (hour: number) => {
    setStartTime(hour);
    setIsModalOpen(true);
  };

  const cancelSessionModal = () => {
    setIsModalOpen(false);
  };

  const handleSessionCreated = (session: Session) => {
    setStoredSessions((prev: Session[]) => [...prev, session]);
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
          const sessions = getSessionForHour(storedSessions, hour);
          return (
            <div
              key={hour}
              className={styles.hourRow}
              onClick={() => addSession(hour)}
            >
              <span>{formatTime(hour)}</span>
              <div className={styles.hourContent}>
                {sessions.map((session) => {
                  const habitData = getHabitData(storedHabits, session.habitId);
                  if (!habitData) return null;
                  const meta = HABIT_CATEGORY_META[habitData.category];
                  const Icon = meta.icon;
                  return (
                    <div
                      key={session.id}
                      className={styles.sessionBlock}
                      style={getSessionStyle(session)}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className={styles.sessionIcon}>
                        <Icon />
                      </div>

                      <strong className={styles.habitName}>
                        {habitData.name}
                      </strong>

                      <span className={styles.sessionNote}>
                        {session.notes}
                      </span>

                      <span className={styles.sessionTime}>
                        {formatSessionTime(session.startedAt)} -{" "}
                        {formatSessionTime(session.finishedAt)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {isModalOpen && (
        <SessionModal
          onCancel={cancelSessionModal}
          onSessionCreated={handleSessionCreated}
          startTime={startTime}
          habits={storedHabits}
        />
      )}
    </div>
  );
}
