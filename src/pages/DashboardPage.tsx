import { isSameDay } from "date-fns";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  isPastDay,
  NIGHT_HOURS,
  WEEK_DATES,
} from "../utils/dashboardUtils";
import styles from "./DashboardPage.module.css";

export function DasboardPage() {
  const { activeHabits } = useHabits();
  const { sessions } = useSessions();
  const navigate = useNavigate();
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
    <div>
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
        <div className={styles.weekPlanner}>
          {WEEK_DATES.map((day) => {
            const isPast = isPastDay(day);
            return (
              <div key={day.getDate()}>
                <div
                  className={`${styles.header} ${isSameDay(currentDate, day) ? styles.currentDayHeader : ""}`}
                >
                  {formatCurrentDate(day)}
                </div>
                <div
                  className={`${styles.timeline} 
                    ${isSameDay(currentDate, day) ? styles.currentDay : ""} 
                    ${isPast ? styles.pastDay : ""}
                  `}
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
        </div>
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
