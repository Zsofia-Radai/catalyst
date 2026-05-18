import { createContext, useContext } from "react";
import type { Session } from "../types/session";

export type SessionContextValue = {
  sessions: Session[];
  addSession: (session: Session) => void;
  updateSession: (session: Session) => void;
  deleteSession: (sessionId: string) => void;
};

export const SessionsContext = createContext<SessionContextValue | null>(null);

export function useSessions() {
  const context = useContext(SessionsContext);
  if (!context) {
    throw new Error("useSessions must be used within SessionsProvider");
  }
  return context;
}
