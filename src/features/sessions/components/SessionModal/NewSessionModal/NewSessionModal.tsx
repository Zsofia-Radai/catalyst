import { useToast } from "../../../../../context/ToastContext";
import { Button } from "../../../../../ui/Button/Button";
import { Modal } from "../../../../../ui/Modal/Modal";
import type { Habit } from "../../../../habits/types/habit";
import { useSessions } from "../../../context/SessionsContext";
import {
  RECURRENCE_FREQUENCIES,
  type SessionInputs,
} from "../../../types/session";
import { SessionForm } from "../SessionForm";
import styles from "./NewSessionModal.module.css";

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
  const { createSession, createSessionSeries } = useSessions();
  const { showToast } = useToast();

  const handleSessionCreated = async (data: SessionInputs) => {
    try {
      if (data.recurrence.frequency === RECURRENCE_FREQUENCIES.NONE) {
        await createSession(data, day);
      } else {
        await createSessionSeries(data, day);
      }
      showToast("Session created!", "success");
      closeModal();
    } catch (err) {
      showToast(`Failed to create session. ${err}`, "error");
    }
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
