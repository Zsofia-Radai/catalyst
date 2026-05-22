import { Button } from "../Button/Button";
import styles from "./EmptyState.module.css";

type EmptyStateProps = {
  title: string;
  description?: string;
  actionLabel?: string;
  action?: () => void;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  action,
}: EmptyStateProps) {
  return (
    <div className={styles.container}>
      <div>{title}</div>
      <div>{description}</div>
      {action && (
        <Button
          onClick={action}
          className={styles.actionButton}
          type="button"
          variant="secondary"
        >
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
