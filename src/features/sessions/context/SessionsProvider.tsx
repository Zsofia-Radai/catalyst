import { useEffect, useState } from "react";
import {
  createSession as createSessionApi,
  createSessionSeries as createSessionSeriesApi,
  deleteSession as deleteSessionApi,
  deleteSessionSeries as deleteSessionSeriesApi,
  getSessions,
  setSessionCompleted,
  updateSession as updateSessionApi,
  updateSessionSeries as updateSessionSeriesApi,
} from "../../../api/sessionsApi";
import type { Session, SessionInputs } from "../types/session";
import { SessionsContext, type SessionContextValue } from "./SessionsContext";
import { getErrorMessage } from "../../../utils/errorUtils";

export function SessionsProvider({ children }: { children: React.ReactNode }) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isSessionsInitialized, setIsSessionsInitialized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSessions() {
      try {
        const savedSessions = await getSessions();
        setSessions(savedSessions || []);
      } catch {
        setError("Failed to load sessions.");
      } finally {
        setIsSessionsInitialized(true);
      }
    }

    loadSessions();
  }, []);

  const createSession = async (sessionInputs: SessionInputs, day: Date) => {
    setError(null);

    try {
      const session = await createSessionApi(sessionInputs, day);
      setSessions((prev) => [...prev, session]);
    } catch (err) {
      const message = getErrorMessage(err);
      throw new Error(message, { cause: err });
    }
  };

  const createSessionSeries = async (
    sessionInputs: SessionInputs,
    day: Date,
  ) => {
    setError(null);

    try {
      const sessions = await createSessionSeriesApi(sessionInputs, day);
      setSessions((prev) => [...prev, ...sessions]);
    } catch (err) {
      const message = getErrorMessage(err);
      throw new Error(message, { cause: err });
    }
  };

  const updateSession = async (session: Session) => {
    setError(null);

    try {
      await updateSessionApi(session);
      setSessions((prev: Session[]) =>
        prev.map((currentSession) =>
          currentSession.id === session.id ? session : currentSession,
        ),
      );
    } catch (err) {
      const message = getErrorMessage(err);
      throw new Error(message, { cause: err });
    }
  };

  const updateSessionSeries = async (updatedSession: Session) => {
    setError(null);

    try {
      await updateSessionSeriesApi(updatedSession);
      setSessions((prev) =>
        prev.map((currentSession) =>
          currentSession.seriesId === updatedSession.seriesId
            ? updatedSession
            : currentSession,
        ),
      );
    } catch (err) {
      const message = getErrorMessage(err);
      throw new Error(message, { cause: err });
    }
  };

  const deleteSession = async (sessionId: string) => {
    setError(null);

    try {
      await deleteSessionApi(sessionId);
      setSessions((prev) => prev.filter((session) => session.id !== sessionId));
    } catch (err) {
      const message = getErrorMessage(err);
      throw new Error(message, { cause: err });
    }
  };

  const deleteSessionSeries = async (seriesId: string) => {
    setError(null);

    try {
      await deleteSessionSeriesApi(seriesId);
      setSessions((prev) =>
        prev.filter((session) => session.seriesId !== seriesId),
      );
    } catch (err) {
      const message = getErrorMessage(err);
      throw new Error(message, { cause: err });
    }
  };

  const toggleSessionCompleted = async (session: Session) => {
    setError(null);

    try {
      const updatedSession = await setSessionCompleted(
        session.id,
        !session.completed,
      );

      setSessions((prev) =>
        prev.map((s) => (s.id === updatedSession.id ? updatedSession : s)),
      );
    } catch (err) {
      const message = getErrorMessage(err);
      throw new Error(message, { cause: err });
    }
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
    isSessionsInitialized,
    error,
  };

  return (
    <SessionsContext.Provider value={value}>
      {children}
    </SessionsContext.Provider>
  );
}
