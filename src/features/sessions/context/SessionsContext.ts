import { createContext, useContext } from "react";
import type { Session, SessionInputs } from "../types/session";

export type SessionContextValue = {
  sessions: Session[];
  createSession: (sessionInputs: SessionInputs, day: Date) => void;
  createSessionSeries: (sessionInputs: SessionInputs, day: Date) => void;
  updateSession: (session: Session) => void;
  updateSessionSeries: (session: Session) => void;
  deleteSession: (sessionId: string) => void;
  deleteSessionSeries: (seriesId: string) => void;
  toggleSessionCompleted: (session: Session) => void;
};

export const SessionsContext = createContext<SessionContextValue | null>(null);

export function useSessions() {
  const context = useContext(SessionsContext);
  if (!context) {
    throw new Error("useSessions must be used within SessionsProvider");
  }
  return context;
}
