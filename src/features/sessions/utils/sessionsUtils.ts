import type { Session, SessionInputs } from "../types/session";

export function createSession(data: SessionInputs, day: Date): Session {
  const { startedAt, finishedAt } = buildSessionDates(data, day);

  return {
    id: crypto.randomUUID(),
    habitId: data.habitId,
    startedAt: startedAt,
    finishedAt: finishedAt,
    notes: data.notes,
  };
}

export function getSessionDurationHours(startedAt: Date, finishedAt: Date) {
  const diffMs = finishedAt.getTime() - startedAt.getTime();
  return diffMs / 1000 / 60 / 60;
}

export function convertSessionToSessionInput(session: Session) {
  return {
    habitId: session.habitId,
    startHour: new Date(session.startedAt).getHours(),
    startMinute: new Date(session.startedAt).getMinutes(),
    endHour: new Date(session.finishedAt).getHours(),
    endMinute: new Date(session.finishedAt).getMinutes(),
    notes: session.notes,
  };
}

function buildSessionDates(data: SessionInputs, day: Date) {
  const startedAt = new Date(day);
  const finishedAt = new Date(day);

  startedAt.setHours(data.startHour, data.startMinute, 0, 0);
  finishedAt.setHours(data.endHour, data.endMinute, 0, 0);

  return { startedAt, finishedAt };
}

export function convertSessionInputToSession(
  data: SessionInputs,
  day: Date,
  existingSession: Session,
): Session {
  const { startedAt, finishedAt } = buildSessionDates(data, day);

  return {
    ...existingSession,
    habitId: data.habitId,
    startedAt: startedAt,
    finishedAt: finishedAt,
    notes: data.notes,
  };
}

export function isEndAfterStart(data: SessionInputs) {
  const startTotal = data.startHour * 60 + data.startMinute;
  const endTotal = data.endHour * 60 + data.endMinute;
  if (endTotal === 0) return true;
  return endTotal > startTotal;
}
