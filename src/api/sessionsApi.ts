import { isPast } from "date-fns";
import {
  RECURRENCE_FREQUENCIES,
  type Session,
  type SessionInputs,
  type SessionRow,
} from "../features/sessions/types/session";
import {
  buildSessionDates,
  buildSessionSeriesRows,
  copyTimeToDate,
  getSeriesRebuildDates,
  mapSessionFromDb,
} from "../features/sessions/utils/sessionsUtils";
import { supabase } from "../lib/supabase";

export async function getSessions(): Promise<Session[]> {
  const { data, error } = await supabase.from("sessions").select("*");

  if (error) throw error;

  return (data ?? []).map(mapSessionFromDb);
}

export async function createSession(
  sessionInputs: SessionInputs,
  day: Date,
): Promise<Session> {
  const { startedAt, finishedAt } = buildSessionDates(sessionInputs, day);

  const completed =
    isPast(finishedAt) &&
    sessionInputs.recurrence.frequency === RECURRENCE_FREQUENCIES.NONE;

  const { data, error } = await supabase
    .from("sessions")
    .insert({
      habit_id: sessionInputs.habitId,
      started_at: startedAt.toISOString(),
      finished_at: finishedAt.toISOString(),
      notes: sessionInputs.notes ?? null,
      completed: completed,
      frequency: sessionInputs.recurrence.frequency,
      repeat_until: sessionInputs.recurrence.repeatUntil
        ? sessionInputs.recurrence.repeatUntil.toISOString()
        : null,
      series_id: sessionInputs.seriesId ?? null,
    })
    .select()
    .single();

  if (error) throw error;

  return mapSessionFromDb(data);
}

export async function createSessionSeries(
  sessionInputs: SessionInputs,
  day: Date,
): Promise<Session[]> {
  const { startedAt, finishedAt } = buildSessionDates(sessionInputs, day);

  const sessionsToInsert = buildSessionSeriesRows({
    habitId: sessionInputs.habitId,
    startedAt,
    finishedAt,
    notes: sessionInputs.notes,
    recurrence: sessionInputs.recurrence,
  });

  const { data, error } = await supabase
    .from("sessions")
    .insert(sessionsToInsert)
    .select();

  if (error) throw error;

  return (data ?? []).map(mapSessionFromDb);
}

export async function deleteSession(sessionId: string): Promise<void> {
  const { error } = await supabase
    .from("sessions")
    .delete()
    .eq("id", sessionId);

  if (error) throw error;
}

export async function deleteSessionSeries(seriesId: string): Promise<void> {
  const { error } = await supabase
    .from("sessions")
    .delete()
    .eq("series_id", seriesId);

  if (error) throw error;
}

export async function updateSession(updatedSession: Session): Promise<Session> {
  const { data, error } = await supabase
    .from("sessions")
    .update({
      habit_id: updatedSession.habitId,
      started_at: updatedSession.startedAt.toISOString(),
      finished_at: updatedSession.finishedAt.toISOString(),
      notes: updatedSession.notes,
      completed: updatedSession.completed,
      // For single session updates, we reset recurrence to NONE to remove from a series, if it was part of one.
      frequency: RECURRENCE_FREQUENCIES.NONE,
      repeat_until: null,
      series_id: null,
    })
    .eq("id", updatedSession.id)
    .select()
    .single();

  if (error) throw error;
  return mapSessionFromDb(data);
}

export async function updateSessionSeries(
  updatedSession: Session,
  originalSession: Session,
): Promise<Session[]> {
  if (!updatedSession.seriesId) return [];

  const { data: seriesSessions, error: fetchError } = await supabase
    .from("sessions")
    .select("*")
    .eq("series_id", updatedSession.seriesId);

  if (fetchError) throw fetchError;

  const frequencyChanged =
    originalSession.recurrence.frequency !==
    updatedSession.recurrence.frequency;

  const repeatUntilChanged =
    originalSession.recurrence.repeatUntil?.getTime() !==
    updatedSession.recurrence.repeatUntil?.getTime();

  if (frequencyChanged || repeatUntilChanged) {
    return rebuildSessionSeries(updatedSession, seriesSessions);
  }

  const updatedSessions = seriesSessions.map((currentSession) => {
    const startedAt = copyTimeToDate(
      new Date(currentSession.started_at),
      updatedSession.startedAt,
    );

    const finishedAt = copyTimeToDate(
      new Date(currentSession.finished_at),
      updatedSession.finishedAt,
    );

    return {
      id: currentSession.id,
      habit_id: updatedSession.habitId,
      notes: updatedSession.notes ?? null,
      frequency: updatedSession.recurrence.frequency,
      repeat_until: updatedSession.recurrence.repeatUntil
        ? updatedSession.recurrence.repeatUntil.toISOString()
        : null,
      started_at: startedAt.toISOString(),
      finished_at: finishedAt.toISOString(),
      series_id: updatedSession.seriesId,
    };
  });

  const { data, error } = await supabase
    .from("sessions")
    .upsert(updatedSessions)
    .select();

  if (error) throw error;

  return (data ?? []).map(mapSessionFromDb);
}

export async function rebuildSessionSeries(
  updatedSession: Session,
  seriesSessions: Pick<SessionRow, "started_at" | "finished_at">[] = [],
): Promise<Session[]> {
  if (!updatedSession.seriesId) return [];

  const { startedAt, finishedAt } = getSeriesRebuildDates(
    updatedSession,
    seriesSessions,
  );

  const { error: deleteError } = await supabase
    .from("sessions")
    .delete()
    .eq("series_id", updatedSession.seriesId);

  if (deleteError) throw deleteError;

  const sessionsToInsert = buildSessionSeriesRows({
    habitId: updatedSession.habitId,
    startedAt,
    finishedAt,
    notes: updatedSession.notes,
    recurrence: updatedSession.recurrence,
    seriesId: updatedSession.seriesId,
  });

  const { data, error } = await supabase
    .from("sessions")
    .insert(sessionsToInsert)
    .select();

  if (error) throw error;

  return (data ?? []).map(mapSessionFromDb);
}

export async function setSessionCompleted(
  sessionId: string,
  completed: boolean,
): Promise<Session> {
  const { data, error } = await supabase
    .from("sessions")
    .update({ completed })
    .eq("id", sessionId)
    .select()
    .single();

  if (error) throw error;

  return mapSessionFromDb(data);
}
