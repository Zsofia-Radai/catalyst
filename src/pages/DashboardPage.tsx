import { useState } from "react";
import { useHabits } from "../features/habits/context/HabitsContext";
import { SessionBlock } from "../features/sessions/components/SessionBlock/SessionBlock";
import { EditSessionModal } from "../features/sessions/components/SessionModal/EditSessionModal";
import { NewSessionModal } from "../features/sessions/components/SessionModal/NewSessionModal";
import { useSessions } from "../features/sessions/context/SessionsContext";
import type { Session } from "../features/sessions/types/session";
import { Button } from "../ui/Button/Button";
import { EmptyState } from "../ui/EmptyState/EmptyState";
import {
  DAY_HOURS,
  formatCurrentDate,
  formatTime,
  getSessionForHour,
  getSessionsForToday,
  NIGHT_HOURS,
  WEEK_DATES,
} from "../utils/dashboardUtils";
import styles from "./DashboardPage.module.css";
import { isSameDay } from "date-fns";

export function DasboardPage() {
  const { activeHabits } = useHabits();
  const { sessions } = useSessions();
  const [isNewSessionModalOpen, setIsNewSessionModalOpen] = useState(false);
  const [isEditSessionModalOpen, setIsEditSessionModalOpen] = useState(false);
  const [showNightSessions, setShowNightSessions] = useState(false);
  const [newSessionstartTime, setNewSessionStartTime] = useState(0);
  const [newSessionDate, setNewSessionDate] = useState(new Date());
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
    <div className={styles.weekPlanner}>
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
      {WEEK_DATES.map((day) => {
        return (
          <div key={day.getDate()}>
            <div className={styles.header}>{formatCurrentDate(day)}</div>
            <div
              className={`${styles.timeline} ${isSameDay(currentDate, day) ? styles.currentDay : ""}`}
            >
              {DAY_HOURS.map((hour) => {
                const hourSessions = getSessionForHour(
                  getSessionsForToday(sessions, day),
                  hour,
                );
                return (
                  <div
                    key={hour}
                    className={styles.hourRow}
                    onClick={() => addSession(hour, day)}
                  >
                    <span>{formatTime(hour)}</span>
                    <div className={styles.hourContent}>
                      {hourSessions.map((session) => (
                        <SessionBlock
                          onClick={() => openSessionEditor(session, day)}
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
          </div>
        );
      })}

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
