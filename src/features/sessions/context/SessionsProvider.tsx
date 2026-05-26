import { useEffect, useState } from "react";
import type { Session } from "../types/session";
import { SessionsContext, type SessionContextValue } from "./SessionsContext";
import { copyTimeToDate } from "../utils/sessionsUtils";

export function SessionsProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>(() =>
    JSON.parse(localStorage.getItem("sessions") || "[]"),
  );

  useEffect(() => {
    localStorage.setItem("sessions", JSON.stringify(sessions));
  }, [sessions]);

  const addSession = (session: Session) => {
    setSessions((prev) => [...prev, session]);
  };

  const addSessions = (sessions: Session[]) => {
    setSessions((prev) => [...prev, ...sessions]);
  };

  const updateSession = (session: Session) => {
    setSessions((prev) =>
      prev.map((currentSession) =>
        currentSession.id === session.id ? session : currentSession,
      ),
    );
  };

  const updateSessionSeries = (updatedSession: Session) => {
    setSessions((prev) =>
      prev.map((currentSession) =>
        currentSession.seriesId === updatedSession.seriesId
          ? {
              ...currentSession,
              habitId: updatedSession.habitId,
              notes: updatedSession.notes,
              recurrence: updatedSession.recurrence,
              startedAt: copyTimeToDate(
                currentSession.startedAt,
                updatedSession.startedAt,
              ),
              finishedAt: copyTimeToDate(
                currentSession.finishedAt,
                updatedSession.finishedAt,
              ),
            }
          : currentSession,
      ),
    );
  };

  const deleteSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((session) => session.id !== sessionId));
  };

  const deleteSessionSeries = (seriesId: string) => {
    setSessions((prev) =>
      prev.filter((session) => session.seriesId !== seriesId),
    );
  };

  const toggleSessionCompleted = (sessionId: string) => {
    setSessions((prev) =>
      prev.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              completed: !session.completed,
            }
          : session,
      ),
    );
  };

  const value: SessionContextValue = {
    sessions,
    addSession,
    addSessions,
    updateSession,
    updateSessionSeries,
    deleteSession,
    deleteSessionSeries,
    toggleSessionCompleted,
  };

  return (
    <SessionsContext.Provider value={value}>
      {children}
    </SessionsContext.Provider>
  );
}
