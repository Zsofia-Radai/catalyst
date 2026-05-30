import { isPast } from "date-fns";
import {
  RECURRENCE_FREQUENCIES,
  type Session,
  type SessionInputs,
} from "../types/session";

export function buildSession(data: SessionInputs, day: Date): Session {
  const { startedAt, finishedAt } = buildSessionDates(data, day);

  const session: Session = {
    id: crypto.randomUUID(),
    habitId: data.habitId,
    startedAt: startedAt,
    finishedAt: finishedAt,
    notes: data.notes,
    completed: false,
    recurrence: data.recurrence,
  };

  if (
    isPast(session.finishedAt) &&
    session.recurrence.frequency === RECURRENCE_FREQUENCIES.NONE
  ) {
    return { ...session, completed: true };
  }

  return session;
}

export function buildSessionSeries(session: Session): Session[] {
  if (!session.recurrence) {
    return [session];
  }

  const { frequency, repeatUntil } = session.recurrence;

  if (frequency === RECURRENCE_FREQUENCIES.NONE || !repeatUntil) {
    return [session];
  }

  const seriesId = crypto.randomUUID();
  const sessions: Session[] = [];

  const currentStart = new Date(session.startedAt);
  const currentEnd = new Date(session.finishedAt);
  const endDate = new Date(repeatUntil);
  endDate.setHours(23, 59, 59, 999);

  const today = new Date();

  while (currentStart <= endDate) {
    sessions.push({
      ...session,
      id: crypto.randomUUID(),
      seriesId,
      startedAt: new Date(currentStart),
      finishedAt: new Date(currentEnd),
    });

    if (currentEnd < today) {
      sessions[sessions.length - 1].completed = true;
    }

    if (frequency === RECURRENCE_FREQUENCIES.DAILY) {
      currentStart.setDate(currentStart.getDate() + 1);
      currentEnd.setDate(currentEnd.getDate() + 1);
    }

    if (frequency === RECURRENCE_FREQUENCIES.WEEKLY) {
      currentStart.setDate(currentStart.getDate() + 7);
      currentEnd.setDate(currentEnd.getDate() + 7);
    }

    if (frequency === RECURRENCE_FREQUENCIES.MONTHLY) {
      currentStart.setMonth(currentStart.getMonth() + 1);
      currentEnd.setMonth(currentEnd.getMonth() + 1);
    }

    if (frequency === RECURRENCE_FREQUENCIES.YEARLY) {
      currentStart.setFullYear(currentStart.getFullYear() + 1);
      currentEnd.setFullYear(currentEnd.getFullYear() + 1);
    }
  }

  return sessions;
}

export function getSessionDurationHours(session: Session) {
  const startedAt = new Date(session.startedAt);
  const finishedAt = new Date(session.finishedAt);
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
    recurrence: session.recurrence,
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

export function copyTimeToDate(targetDate: Date, sourceDate: Date) {
  const result = new Date(targetDate);

  result.setHours(
    sourceDate.getHours(),
    sourceDate.getMinutes(),
    sourceDate.getSeconds(),
    sourceDate.getMilliseconds(),
  );

  return result;
}
