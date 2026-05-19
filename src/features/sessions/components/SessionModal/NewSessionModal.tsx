import { useToast } from "../../../../context/ToastContext";
import { Button } from "../../../../ui/Button/Button";
import { Modal } from "../../../../ui/Modal/Modal";
import type { Habit } from "../../../habits/types/habit";
import { useSessions } from "../../context/SessionsContext";
import type { SessionInputs } from "../../types/session";
import { createSession } from "../../utils/sessionsUtils";
import styles from "./NewSessionModal.module.css";
import { SessionForm } from "./SessionForm";

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
  const { showToast } = useToast();

  const handleSessionCreated = (data: SessionInputs) => {
    const session = createSession(data);
    showToast("Session created!", "save");
    addSession(session);
    closeModal();
  };

  return (
    <Modal title="Add session" onClose={closeModal}>
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
    </Modal>
  );
}
