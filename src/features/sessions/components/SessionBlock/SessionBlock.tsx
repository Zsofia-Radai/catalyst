import { Check, Pencil } from "lucide-react";
import { Button } from "../../../../ui/Button/Button";
import {
  formatSessionTime,
  getHabitData,
} from "../../../../utils/dashboardUtils";
import { HABIT_CATEGORY_META, type Habit } from "../../../habits/types/habit";
import { useSessions } from "../../context/SessionsContext";
import type { Session } from "../../types/session";
import {
  getSessionStyle,
  HOUR_HEIGHTS,
  PLANNER_VIEW_TYPES,
  type PlannerViewType,
} from "../Planner/plannerUtils";
import styles from "./SessionBlock.module.css";

type SessionProps = {
  session: Session;
  habits: Habit[];
  plannerViewType: PlannerViewType;
  onClick: () => void;
};

export function SessionBlock({
  session,
  habits,
  plannerViewType,
  onClick,
}: SessionProps) {
  const habit = getHabitData(habits, session.habitId);
  const { toggleSessionCompleted } = useSessions();
  if (!habit) return null;
  const meta = HABIT_CATEGORY_META[habit.category];
  const Icon = meta.icon;
  const hourHeight = HOUR_HEIGHTS[plannerViewType];
  const badgeSize = plannerViewType === PLANNER_VIEW_TYPES.DAY ? 20 : 16;

  return (
    <div
      key={session.id}
      className={`${styles.sessionBlock} ${
        session.completed ? styles.completed : ""
      }`}
      style={getSessionStyle(session, habit, hourHeight)}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className={styles.actions}>
        <Button
          aria-label="Complete session toggle"
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
          aria-label="Edit session"
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
        <Icon size={20} />
      </div>
      <span className={styles.habitName}>{habit.name}</span>
      <span className={styles.sessionNote}>{session.notes}</span>
      <span className={styles.sessionTime}>
        {formatSessionTime(session.startedAt)} -{" "}
        {formatSessionTime(session.finishedAt)}
      </span>

      {session.completed && (
        <div className={styles.completedBadge}>
          <Check size={badgeSize} />
        </div>
      )}
    </div>
  );
}
