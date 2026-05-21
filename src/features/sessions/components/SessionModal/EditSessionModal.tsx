import { useToast } from "../../../../context/ToastContext";
import { Button } from "../../../../ui/Button/Button";
import { Modal } from "../../../../ui/Modal/Modal";
import type { Habit } from "../../../habits/types/habit";
import { useSessions } from "../../context/SessionsContext";
import type { Session, SessionInputs } from "../../types/session";
import {
  convertSessionInputToSession,
  convertSessionToSessionInput,
} from "../../utils/sessionsUtils";
import styles from "./EditSessionModal.module.css";
import { SessionForm } from "./SessionForm";

type EditSessionModalProps = {
  closeModal: () => void;
  session: Session;
  habits: Habit[];
  day: Date;
};

export function EditSessionModal({
  closeModal,
  session,
  day,
  habits,
}: EditSessionModalProps) {
  const { updateSession, deleteSession } = useSessions();
  const { showToast } = useToast();

  const handleSessionSave = (sessionData: SessionInputs) => {
    updateSession(convertSessionInputToSession(sessionData, day, session));
    showToast("Session saved!", "save");
    closeModal();
  };

  const handleSessionDelete = () => {
    deleteSession(session.id);
    showToast("Session deleted!", "delete");
    closeModal();
  };

  return (
    <Modal title="Edit session" onClose={closeModal}>
      <SessionForm
        onSubmitForm={handleSessionSave}
        editedSession={convertSessionToSessionInput(session)}
        habits={habits}
      />
      <div className={styles.actions}>
        <Button
          type="button"
          variant="delete"
          onClick={() => handleSessionDelete()}
        >
          Delete session
        </Button>
        <Button variant="save" type="submit" form="session-form">
          Save session
        </Button>
      </div>
    </Modal>
  );
}
