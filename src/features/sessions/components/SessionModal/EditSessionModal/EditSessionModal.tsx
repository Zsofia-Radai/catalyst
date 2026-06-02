import { useState } from "react";
import { useToast } from "../../../../../context/ToastContext";
import { Button } from "../../../../../ui/Button/Button";
import { Modal } from "../../../../../ui/Modal/Modal";
import type { Habit } from "../../../../habits/types/habit";
import { type Session, type SessionInputs } from "../../../types/session";
import {
  convertSessionInputToSession,
  convertSessionToSessionInput,
} from "../../../utils/sessionsUtils";
import { SeriesUpdateConfirmation } from "../SeriesUpdateConfirmation/SeriesUpdateConfirmation";
import { SessionForm } from "../SessionForm";
import styles from "./EditSessionModal.module.css";
import { getErrorMessage } from "../../../../../utils/errorUtils";
import { useUpdateSession } from "../../../hooks/useUpdateSession";
import { useUpdateSessionSeries } from "../../../hooks/useUpdateSessionSeries";
import { useDeleteSession } from "../../../hooks/useDeleteSession";
import { useDeleteSessionSeries } from "../../../hooks/useDeleteSessionSeries";

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
  const updateSession = useUpdateSession();
  const updateSessionSeries = useUpdateSessionSeries();
  const deleteSession = useDeleteSession();
  const deleteSessionSeries = useDeleteSessionSeries();
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

  const handleSessionSave = async (sessionData: SessionInputs) => {
    try {
      await updateSession.mutateAsync(
        convertSessionInputToSession(sessionData, day, session),
      );
      showToast("Session saved!", "success");
      closeModal();
    } catch (err) {
      showToast(`Failed to save session. ${err}`, "error");
    }
  };

  const handleSessionSeriesSaved = async () => {
    if (!pendingSessionData) return;
    try {
      await updateSessionSeries.mutateAsync({
        updatedSession: convertSessionInputToSession(
          pendingSessionData,
          day,
          session,
        ),
        originalSession: session,
      });
      showToast("Sessions saved!", "success");
      closeModal();
    } catch (err) {
      showToast(`Failed to save sessions. ${getErrorMessage(err)}`, "error");
    }
  };

  const handleSessionDeleteClicked = async () => {
    if (session.seriesId) {
      setDeleteConfirmation(true);
      return;
    }
    await handleSessionDelete();
  };

  const handleSessionDelete = async () => {
    try {
      await deleteSession.mutateAsync(session.id);
      showToast("Session deleted!", "delete");
      closeModal();
    } catch (err) {
      showToast(`Failed to delete session. ${getErrorMessage(err)}`, "error");
    }
  };

  const handleSessionSeriesDelete = async () => {
    if (!session.seriesId) return;
    try {
      await deleteSessionSeries.mutateAsync(session.seriesId);
      showToast("Sessions deleted!", "delete");
      closeModal();
    } catch (err) {
      showToast(`Failed to delete sessions. ${getErrorMessage(err)}`, "error");
    }
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
        <SeriesUpdateConfirmation
          type="edit"
          seriesHandler={handleSessionSeriesSaved}
          singleSessionHandler={() => {
            if (!pendingSessionData) return;
            handleSessionSave(pendingSessionData);
          }}
        />
      )}

      {deleteConfirmation && (
        <SeriesUpdateConfirmation
          type="delete"
          seriesHandler={handleSessionSeriesDelete}
          singleSessionHandler={handleSessionDelete}
        />
      )}
    </Modal>
  );
}
