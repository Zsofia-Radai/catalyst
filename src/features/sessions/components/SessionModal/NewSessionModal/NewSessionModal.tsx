import { useToast } from "../../../../../context/ToastContext";
import { Button } from "../../../../../ui/Button/Button";
import { Modal } from "../../../../../ui/Modal/Modal";
import type { Habit } from "../../../../habits/types/habit";
import { useCreateSession } from "../../../hooks/useCreateSession";
import { useCreateSessionSeries } from "../../../hooks/useCreateSessionSeries";

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
  const createSession = useCreateSession();
  const createSessionSeries = useCreateSessionSeries();
  const { showToast } = useToast();

  const handleSessionCreated = async (sessionInputs: SessionInputs) => {
    try {
      if (sessionInputs.recurrence.frequency === RECURRENCE_FREQUENCIES.NONE) {
        await createSession.mutateAsync({ sessionInputs, day });
      } else {
        await createSessionSeries.mutateAsync({ sessionInputs, day });
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
