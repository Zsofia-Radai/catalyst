import { Check, Pencil } from "lucide-react";
import { Button } from "../../../../ui/Button/Button";
import {
  formatSessionTime,
  getHabitData,
} from "../../../../utils/dashboardUtils";
import {
  HABIT_CATEGORY_META,
  type Habit,
  type HabitMeta,
} from "../../../habits/types/habit";
import { useSessions } from "../../context/SessionsContext";
import type { Session } from "../../types/session";
import styles from "./SessionBlock.module.css";

type SessionProps = {
  session: Session;
  habits: Habit[];
  onClick: () => void;
};
const HOUR_HEIGHT = 72;

const getSessionStyle = (session: Session, meta: HabitMeta) => {
  const start = new Date(session.startedAt);
  const end = new Date(session.finishedAt);

  const startMinutes = start.getMinutes();
  let durationMinutes = (end.getTime() - start.getTime()) / 1000 / 60;

  if (durationMinutes < 0) {
    durationMinutes += 24 * 60;
  }

  return {
    top: `${(startMinutes / 60) * HOUR_HEIGHT}px`,
    height: `${(durationMinutes / 60) * HOUR_HEIGHT}px`,
    "--card-color": meta.color,
  };
};

export function SessionBlock({ session, habits, onClick }: SessionProps) {
  const habitData = getHabitData(habits, session.habitId);
  const { toggleSessionCompleted } = useSessions();
  if (!habitData) return null;
  const meta = HABIT_CATEGORY_META[habitData.category];
  const Icon = meta.icon;

  return (
    <div
      key={session.id}
      className={`${styles.sessionBlock} ${
        session.completed ? styles.completed : ""
      }`}
      style={getSessionStyle(session, meta)}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className={styles.actions}>
        <Button
          aria-label="complete-session-toggle"
          variant="icon"
          style={{ color: "var(--text)" }}
          onClick={(e) => {
            e.stopPropagation();
            toggleSessionCompleted(session.id);
          }}
        >
          <Check size={18} />
        </Button>

        <Button
          aria-label="edit-session"
          variant="icon"
          style={{ color: "var(--text)" }}
          onClick={(e) => {
            e.stopPropagation();
            onClick();
          }}
        >
          <Pencil size={18} />
        </Button>
      </div>
      <div className={styles.sessionIcon}>
        <Icon />
      </div>

      <strong className={styles.habitName}>{habitData.name}</strong>

      <span className={styles.sessionNote}>{session.notes}</span>

      <span className={styles.sessionTime}>
        {formatSessionTime(session.startedAt)} -{" "}
        {formatSessionTime(session.finishedAt)}
      </span>

      {session.completed && (
        <div className={styles.completedBadge}>
          <Check size={16} />
        </div>
      )}
    </div>
  );
}
