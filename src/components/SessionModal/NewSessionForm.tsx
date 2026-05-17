import { useHabits } from "../../context/HabitsContext";
import { useSessions } from "../../context/SessionsContext";
import type { Habit } from "../../types/habit";
import type { Session } from "../../types/session";
import { SessionFormModal } from "./SessionFormModal";

type Inputs = {
  habitId: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  notes: string;
};

type NewSessionFormProps = {
  onCancel: () => void;
  startTime: number;
  habits: Habit[];
};

function createSession(data: Inputs): Session {
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

function getSessionDurationHours(startedAt: Date, finishedAt: Date) {
  const diffMs = finishedAt.getTime() - startedAt.getTime();
  return diffMs / 1000 / 60 / 60;
}

export function NewSessionForm({
  onCancel,
  startTime,
  habits,
}: NewSessionFormProps) {
  const { addSession } = useSessions();
  const { updateHabitLoggedHours } = useHabits();

  const handleSessionCreated = (data: Inputs) => {
    const session = createSession(data);
    const duration = getSessionDurationHours(
      session.startedAt,
      session.finishedAt,
    );
    updateHabitLoggedHours(session.habitId, duration);
    addSession(session);
    onCancel();
  };
  return (
    <SessionFormModal
      onCancel={onCancel}
      onSubmitForm={handleSessionCreated}
      startTime={startTime}
      habits={habits}
    />
  );
}
