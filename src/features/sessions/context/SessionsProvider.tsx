import { useEffect, useState } from "react";
import {
  createSession as createSessionApi,
  createSessionSeries as createSessionSeriesApi,
  deleteSession as deleteSessionApi,
  deleteSessionSeries as deleteSessionSeriesApi,
  getSessions,
  updateSession as updateSessionApi,
  updateSessionSeries as updateSessionSeriesApi,
} from "../../../api/sessionsApi";
import type { Session, SessionInputs } from "../types/session";
import { SessionsContext, type SessionContextValue } from "./SessionsContext";

export function SessionsProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const loadSessions = async () => {
      const savedSessions = await getSessions();
      setSessions(savedSessions || []);
    };

    loadSessions();
  }, []);

  const createSession = async (sessionInputs: SessionInputs, day: Date) => {
    const session = await createSessionApi(sessionInputs, day);
    setSessions((prev) => [...prev, session]);
  };

  const createSessionSeries = async (
    sessionInputs: SessionInputs,
    day: Date,
  ) => {
    const sessions = await createSessionSeriesApi(sessionInputs, day);
    setSessions((prev) => [...prev, ...sessions]);
  };

  const updateSession = async (session: Session) => {
    await updateSessionApi(session);
    setSessions((prev: Session[]) =>
      prev.map((currentSession) =>
        currentSession.id === session.id ? session : currentSession,
      ),
    );
  };

  const updateSessionSeries = async (updatedSession: Session) => {
    await updateSessionSeriesApi(updatedSession);
    setSessions((prev) =>
      prev.map((currentSession) =>
        currentSession.seriesId === updatedSession.seriesId
          ? updatedSession
          : currentSession,
      ),
    );
  };

  const deleteSession = async (sessionId: string) => {
    await deleteSessionApi(sessionId);
    setSessions((prev) => prev.filter((session) => session.id !== sessionId));
  };

  const deleteSessionSeries = async (seriesId: string) => {
    await deleteSessionSeriesApi(seriesId);
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
    createSession,
    createSessionSeries,
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
