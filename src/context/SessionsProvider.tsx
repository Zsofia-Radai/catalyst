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

  const value: SessionContextValue = { sessions, addSession };

  return (
    <SessionsContext.Provider value={value}>
      {children}
    </SessionsContext.Provider>
  );
}
