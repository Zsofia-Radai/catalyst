import { SessionForm } from "./SessionForm";
import styles from "./EditSessionModal.module.css";
import { CircleX } from "lucide-react";
import type { Habit } from "../../../habits/types/habit";
import type { Session, SessionInputs } from "../../types/session";
import { useSessions } from "../../context/SessionsContext";
import { Button } from "../../../../ui/Button/Button";
import {
  convertSessionInputToSession,
  convertSessionToSessionInput,
} from "../../utils/sessionsUtils";
import { useToast } from "../../../../context/ToastContext";

type EditSessionModalProps = {
  closeModal: () => void;
  session: Session;
  habits: Habit[];
};

export function EditSessionModal({
  closeModal,
  session,
  habits,
}: EditSessionModalProps) {
  const { updateSession, deleteSession } = useSessions();
  const { showToast } = useToast();

  const handleSessionSave = (sessionData: SessionInputs) => {
    updateSession(convertSessionInputToSession(sessionData, session));
    showToast("Session saved!", "save");
    closeModal();
  };

  const handleSessionDelete = () => {
    deleteSession(session.id);
    showToast("Session deleted!", "delete");
    closeModal();
  };

  return (
    <div className={styles.backdrop} onClick={closeModal}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.title}>Edit session</div>
          <CircleX className={styles.deleteIcon} onClick={closeModal} />
        </div>
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
          <Button type="submit" variant="create" form="session-form">
            Save session
          </Button>
        </div>
      </div>
    </div>
  );
}
