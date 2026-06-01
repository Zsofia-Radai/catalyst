import { createContext, useContext } from "react";
import type { Session, SessionInputs } from "../types/session";

export type SessionContextValue = {
  sessions: Session[];
  createSession: (sessionInputs: SessionInputs, day: Date) => Promise<void>;
  createSessionSeries: (
    sessionInputs: SessionInputs,
    day: Date,
  ) => Promise<void>;
  updateSession: (session: Session) => Promise<void>;
  updateSessionSeries: (session: Session) => Promise<void>;
  deleteSession: (sessionId: string) => Promise<void>;
  deleteSessionSeries: (seriesId: string) => Promise<void>;
  toggleSessionCompleted: (session: Session) => Promise<void>;
  isSessionsLoading: boolean;
  error: string | null;
};

export const SessionsContext = createContext<SessionContextValue | null>(null);

export function useSessions() {
  const context = useContext(SessionsContext);
  if (!context) {
    throw new Error("useSessions must be used within SessionsProvider");
  }
  return context;
}
