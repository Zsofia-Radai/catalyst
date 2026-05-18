import type { SessionInputs } from "../features/sessions/components/SessionModal/SessionForm";
import type { Session } from "../features/sessions/types/session";

export function createSession(data: SessionInputs): Session {
  const startedAt = new Date();
  const finishedAt = new Date();
  startedAt.setHours(data.startHour, data.startMinute, 0, 0);
  finishedAt.setHours(data.endHour, data.endMinute, 0, 0);

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

export function convertSessionInputToSession(
  data: SessionInputs,
  existingSession: Session,
): Session {
  const startedAt = new Date();
  const finishedAt = new Date();
  startedAt.setHours(data.startHour, data.startMinute, 0, 0);
  finishedAt.setHours(data.endHour, data.endMinute, 0, 0);

  return {
    id: existingSession.id,
    habitId: data.habitId,
    startedAt: startedAt,
    finishedAt: finishedAt,
    notes: data.notes,
  };
}
