import { CircleX } from "lucide-react";
import styles from "./Modal.module.css";

type ModalProps = {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
};

export function Modal({ title, onClose, children }: ModalProps) {
  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <div className={styles.title}>{title}</div>
          <CircleX className={styles.deleteIcon} onClick={onClose} />
        </header>

        <div className="modalBody">{children}</div>
      </div>
    </div>
  );
}
