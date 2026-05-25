import { Repeat } from "lucide-react";
import { useState } from "react";
import { useToast } from "../../../../context/ToastContext";
import { Button } from "../../../../ui/Button/Button";
import { Modal } from "../../../../ui/Modal/Modal";
import type { Habit } from "../../../habits/types/habit";
import { useSessions } from "../../context/SessionsContext";
import { type Session, type SessionInputs } from "../../types/session";
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
  const {
    updateSession,
    updateSessionSeries,
    deleteSession,
    deleteSessionSeries,
  } = useSessions();
  const { showToast } = useToast();
  const [deleteConfirmation, setDeleteConfirmation] = useState<boolean>(false);
  const [editConfirmation, setEditConfirmation] = useState<boolean>(false);
  const [pendingSessionData, setPendingSessionData] =
    useState<SessionInputs | null>(null);
  const modalTitle = deleteConfirmation ? "Delete session" : "Edit session";

  const handleSessionSubmit = (sessionData: SessionInputs) => {
    if (session.seriesId) {
      setPendingSessionData(sessionData);
      setEditConfirmation(true);
      return;
    }
    handleSessionSave(sessionData);
  };

  const handleSessionSave = (sessionData: SessionInputs) => {
    updateSession(convertSessionInputToSession(sessionData, day, session));
    showToast("Session saved!", "save");
    closeModal();
  };

  const handleSessionSeriesSaved = () => {
    if (!pendingSessionData) return;
    updateSessionSeries(
      convertSessionInputToSession(pendingSessionData, day, session),
    );
    showToast("Sessions saved!", "save");
    closeModal();
  };

  const handleSessionDeleteClicked = () => {
    if (session.seriesId) {
      setDeleteConfirmation(true);
      return;
    }
    deleteSession(session.id);
    showToast("Session deleted!", "delete");
    closeModal();
  };

  const handleSessionDelete = () => {
    deleteSession(session.id);
    showToast("Session deleted!", "delete");
    closeModal();
  };

  const handleSessionSeriesDelete = () => {
    if (!session.seriesId) return;
    deleteSessionSeries(session.seriesId);
    showToast("Sessions deleted!", "delete");
    closeModal();
  };

  return (
    <Modal title={modalTitle} onClose={closeModal}>
      {!deleteConfirmation && !editConfirmation && (
        <>
          <SessionForm
            onSubmitForm={handleSessionSubmit}
            editedSession={convertSessionToSessionInput(session)}
            habits={habits}
          />
          <div className={styles.actions}>
            <Button
              type="button"
              variant="delete"
              onClick={() => handleSessionDeleteClicked()}
            >
              Delete session
            </Button>
            <Button variant="save" type="submit" form="session-form">
              Save session
            </Button>
          </div>
        </>
      )}

      {editConfirmation && (
        <div>
          <div className={styles.container}>
            <div className={styles.confirmMessage}>
              <Repeat size={16} />
              <div>This is a recurring session.</div>
            </div>
            <div>Do you want to edit:</div>
            <div className={styles.footer}>
              <Button
                variant="secondary"
                onClick={() => handleSessionSeriesSaved()}
              >
                Entire series
              </Button>
              <Button
                variant="neutral"
                onClick={() => {
                  if (!pendingSessionData) return;
                  handleSessionSave(pendingSessionData);
                }}
              >
                Only this session
              </Button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmation && (
        <div className={styles.container}>
          <div className={styles.confirmMessage}>
            <Repeat size={16} />
            <div>This is a recurring session.</div>
          </div>
          <div>Do you want to delete:</div>
          <div className={styles.footer}>
            <Button
              variant="delete"
              onClick={() => handleSessionSeriesDelete()}
            >
              Entire series
            </Button>
            <Button variant="neutral" onClick={() => handleSessionDelete()}>
              Only this session
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
