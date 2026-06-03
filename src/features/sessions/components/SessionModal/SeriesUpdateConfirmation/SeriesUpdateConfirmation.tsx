import { Repeat } from "lucide-react";
import { Button } from "../../../../../ui/Button/Button";
import styles from "./SeriesUpdateConfirmation.module.css";

type ConfirmType = "delete" | "edit";

type SeriesUpdateConfirmationProps = {
  type: ConfirmType;
  seriesHandler: () => void;
  singleSessionHandler: () => void;
};

export function SeriesUpdateConfirmation({
  type,
  seriesHandler,
  singleSessionHandler,
}: SeriesUpdateConfirmationProps) {
  return (
    <div className={styles.container}>
      <div className={styles.messageContainer}>
        <div className={styles.confirmMessage}>
          <Repeat size={16} />
          <div>This is a recurring session.</div>
        </div>
        <div>Do you want to {type}:</div>
      </div>
      <div className={styles.footer}>
        <Button variant="secondary" onClick={seriesHandler}>
          Entire series
        </Button>
        <Button variant="neutral" onClick={singleSessionHandler}>
          Only this session
        </Button>
      </div>
    </div>
  );
}
