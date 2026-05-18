import { CircleX } from "lucide-react";
import { useHabits } from "../../context/HabitsContext";
import { useSessions } from "../../context/SessionsContext";
import type { Habit } from "../../types/habit";
import { Button } from "../../ui/Button/Button";
import {
  createSession,
  getSessionDurationHours,
} from "../../utils/SessionsUtils";
import styles from "./NewSessionModal.module.css";
import { SessionForm, type SessionInputs } from "./SessionForm";

type NewSessionModalProps = {
  closeModal: () => void;
  startTime: number;
  habits: Habit[];
};

export function NewSessionModal({
  closeModal,
  startTime,
  habits,
}: NewSessionModalProps) {
  const { addSession } = useSessions();
  const { updateHabitLoggedHours } = useHabits();

  const handleSessionCreated = (data: SessionInputs) => {
    const session = createSession(data);
    const duration = getSessionDurationHours(
      session.startedAt,
      session.finishedAt,
    );
    updateHabitLoggedHours(session.habitId, duration);
    addSession(session);
    closeModal();
  };

  return (
    <div className={styles.backdrop} onClick={closeModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.title}>Add session</div>
          <CircleX className={styles.deleteIcon} onClick={closeModal} />
        </div>
        <SessionForm
          onSubmitForm={handleSessionCreated}
          startTime={startTime}
          habits={habits}
        />
        <Button
          type="submit"
          variant="create"
          form="session-form"
          className={styles.saveButton}
        >
          Save session
        </Button>
      </div>
    </div>
  );
}
