import { isPast } from "date-fns";
import { useToast } from "../../../../../context/ToastContext";
import { Button } from "../../../../../ui/Button/Button";
import { Modal } from "../../../../../ui/Modal/Modal";
import type { Habit } from "../../../../habits/types/habit";
import { useSessions } from "../../../context/SessionsContext";
import {
  RECURRENCE_FREQUENCIES,
  type SessionInputs,
} from "../../../types/session";
import {
  createSession,
  createSessionSeries,
} from "../../../utils/sessionsUtils";
import styles from "./NewSessionModal.module.css";
import { SessionForm } from "../SessionForm";

type NewSessionModalProps = {
  closeModal: () => void;
  startTime: number;
  day: Date;
  habits: Habit[];
};

export function NewSessionModal({
  closeModal,
  startTime,
  day,
  habits,
}: NewSessionModalProps) {
  const { addSessions } = useSessions();
  const { showToast } = useToast();

  const handleSessionCreated = (data: SessionInputs) => {
    let session = createSession(data, day);
    if (
      isPast(session.finishedAt) &&
      session.recurrence.frequency === RECURRENCE_FREQUENCIES.NONE
    ) {
      session = { ...session, completed: true };
    }
    showToast("Session created!", "save");
    const sessionsToSave = createSessionSeries(session);

    addSessions(sessionsToSave);
    closeModal();
  };

  return (
    <Modal title="New session" onClose={closeModal}>
      <SessionForm
        onSubmitForm={handleSessionCreated}
        startTime={startTime}
        habits={habits}
      />
      <Button
        variant="save"
        type="submit"
        form="session-form"
        className={styles.saveButton}
      >
        Save session
      </Button>
    </Modal>
  );
}
