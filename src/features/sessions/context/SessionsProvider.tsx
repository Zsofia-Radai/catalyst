import { useEffect, useState } from "react";
import type { Session } from "../types/session";
import { SessionsContext, type SessionContextValue } from "./SessionsContext";

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

  const updateSession = (session: Session) => {
    setSessions((prev) =>
      prev.map((currentSession) =>
        currentSession.id === session.id ? session : currentSession,
      ),
    );
  };

  const deleteSession = (sessionId: string) => {
    setSessions((prev) => prev.filter((session) => session.id !== sessionId));
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
    updateSession,
    deleteSession,
    toggleSessionCompleted,
  };

  return (
    <SessionsContext.Provider value={value}>
      {children}
    </SessionsContext.Provider>
  );
}
