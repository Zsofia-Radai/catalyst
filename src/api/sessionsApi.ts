import type {
  Session,
  SessionInputs,
} from "../features/sessions/types/session";
import {
  buildSession,
  buildSessionSeries,
  copyTimeToDate,
} from "../features/sessions/utils/sessionsUtils";

const SESSIONS_STORAGE_KEY = "sessions";

export async function getSessions(): Promise<Session[]> {
  const sessions = localStorage.getItem(SESSIONS_STORAGE_KEY);

  if (!sessions) {
    return [];
  }

  return JSON.parse(sessions) as Session[];
}

export async function saveSessions(sessions: Session[]): Promise<void> {
  localStorage.setItem(SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
}

export async function createSession(
  sessionInputs: SessionInputs,
  day: Date,
): Promise<Session> {
  const sessions = await getSessions();
  const session = buildSession(sessionInputs, day);

  const updatedSessions = [...sessions, session];

  await saveSessions(updatedSessions);
  return session;
}

export async function createSessionSeries(
  sessionInputs: SessionInputs,
  day: Date,
): Promise<Session[]> {
  const session = buildSession(sessionInputs, day);
  const sessionsToSave = buildSessionSeries(session);
  const sessions = await getSessions();
  const updatedSessions = [...sessions, ...sessionsToSave];
  await saveSessions(updatedSessions);
  return sessionsToSave;
}

export async function deleteSession(sessionId: string): Promise<void> {
  const sessions = await getSessions();
  const updatedSessions = sessions.filter(
    (session) => session.id !== sessionId,
  );
  await saveSessions(updatedSessions);
}

export async function deleteSessionSeries(seriesId: string): Promise<void> {
  const sessions = await getSessions();
  const updatedSessions = sessions.filter(
    (session) => session.seriesId !== seriesId,
  );
  await saveSessions(updatedSessions);
}

export async function updateSession(updatedSession: Session): Promise<void> {
  const sessions = await getSessions();
  const updatedSessions = sessions.map((session) =>
    session.id === updatedSession.id ? updatedSession : session,
  );
  await saveSessions(updatedSessions);
}

export async function updateSessionSeries(
  updatedSession: Session,
): Promise<void> {
  const sessions = await getSessions();
  const updatedSessions = sessions.map((currentSession) =>
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
  );
  await saveSessions(updatedSessions);
}
