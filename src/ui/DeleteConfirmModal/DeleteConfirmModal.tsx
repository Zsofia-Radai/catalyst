import { Button } from "../Button/Button";
import { Modal } from "../Modal/Modal";
import styles from "./DeleteConfirmModal.module.css";

type DeleteConfirmModalProps = {
  objectToDelete?: string;
  title: string;
  details?: string;
  onDelete: () => void;
  onCancel: () => void;
};

export function DeleteConfirmModal({
  objectToDelete,
  title,
  details,
  onDelete,
  onCancel,
}: DeleteConfirmModalProps) {
  return (
    <Modal title={title} onClose={onCancel} deleteModal={true}>
      <div className={styles.modalBody}>
        <div className={styles.name}>{objectToDelete}</div>
        <div>{details}</div>
      </div>
      <div className={styles.footer}>
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="delete" onClick={onDelete}>
          Delete
        </Button>
      </div>
    </Modal>
  );
}
