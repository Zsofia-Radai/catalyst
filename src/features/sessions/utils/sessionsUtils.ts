import {
  RECURRENCE_FREQUENCIES,
  type Recurrence,
  type Session,
  type SessionInputs,
  type SessionRow,
} from "../types/session";

export function buildSessionSeriesRows({
  habitId,
  startedAt,
  finishedAt,
  notes,
  recurrence,
  seriesId,
}: {
  habitId: string;
  startedAt: Date;
  finishedAt: Date;
  notes?: string;
  recurrence: Recurrence;
  seriesId?: string;
}) {
  const finalSeriesId = seriesId ?? crypto.randomUUID();
  const rows = [];

  const currentStart = new Date(startedAt);
  const currentEnd = new Date(finishedAt);
  const endDate = new Date(recurrence.repeatUntil!);
  endDate.setHours(23, 59, 59, 999);

  const today = new Date();

  while (currentStart <= endDate) {
    rows.push({
      habit_id: habitId,
      started_at: currentStart.toISOString(),
      finished_at: currentEnd.toISOString(),
      notes: notes ?? null,
      completed: currentEnd < today,
      frequency: recurrence.frequency,
      repeat_until: recurrence.repeatUntil?.toISOString() ?? null,
      series_id: finalSeriesId,
    });

    if (recurrence.frequency === RECURRENCE_FREQUENCIES.DAILY) {
      currentStart.setDate(currentStart.getDate() + 1);
      currentEnd.setDate(currentEnd.getDate() + 1);
    }

    if (recurrence.frequency === RECURRENCE_FREQUENCIES.WEEKLY) {
      currentStart.setDate(currentStart.getDate() + 7);
      currentEnd.setDate(currentEnd.getDate() + 7);
    }

    if (recurrence.frequency === RECURRENCE_FREQUENCIES.MONTHLY) {
      currentStart.setMonth(currentStart.getMonth() + 1);
      currentEnd.setMonth(currentEnd.getMonth() + 1);
    }

    if (recurrence.frequency === RECURRENCE_FREQUENCIES.YEARLY) {
      currentStart.setFullYear(currentStart.getFullYear() + 1);
      currentEnd.setFullYear(currentEnd.getFullYear() + 1);
    }
  }

  return rows;
}

export function mapSessionFromDb(row: SessionRow): Session {
  return {
    id: row.id,
    habitId: row.habit_id,
    startedAt: new Date(row.started_at),
    finishedAt: new Date(row.finished_at),
    notes: row.notes ?? "",
    completed: row.completed,
    recurrence: {
      frequency: row.frequency,
      repeatUntil: row.repeat_until ? new Date(row.repeat_until) : undefined,
    },
    seriesId: row.series_id ?? undefined,
  };
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

export function buildSessionDates(data: SessionInputs, day: Date) {
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
    recurrence: data.recurrence,
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

export function isNightSession(session: Session) {
  const startHour = new Date(session.startedAt).getHours();
  const endHour = new Date(session.finishedAt).getHours();

  return startHour < 8 || endHour < 8;
}
