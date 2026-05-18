import type { Session } from "../../types/session";
import {
  formatSessionTime,
  getHabitData,
} from "../../../../utils/dashboardUtils";
import {
  HABIT_CATEGORY_META,
  type Habit,
  type HabitMeta,
} from "../../../habits/types/habit";
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
  const durationMinutes = (end.getTime() - start.getTime()) / 1000 / 60;

  return {
    top: `${(startMinutes / 60) * HOUR_HEIGHT}px`,
    height: `${(durationMinutes / 60) * HOUR_HEIGHT}px`,
    "--card-color": meta.color,
  };
};

export function SessionBlock({ session, habits, onClick }: SessionProps) {
  const habitData = getHabitData(habits, session.habitId);
  if (!habitData) return null;
  const meta = HABIT_CATEGORY_META[habitData.category];
  const Icon = meta.icon;

  return (
    <div
      key={session.id}
      className={styles.sessionBlock}
      style={getSessionStyle(session, meta)}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <div className={styles.sessionIcon}>
        <Icon />
      </div>

      <strong className={styles.habitName}>{habitData.name}</strong>

      <span className={styles.sessionNote}>{session.notes}</span>

      <span className={styles.sessionTime}>
        {formatSessionTime(session.startedAt)} -{" "}
        {formatSessionTime(session.finishedAt)}
      </span>
    </div>
  );
}
