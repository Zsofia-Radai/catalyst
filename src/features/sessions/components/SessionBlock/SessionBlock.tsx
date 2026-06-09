import { Check, Pencil, Repeat } from "lucide-react";
import { Button } from "../../../../ui/Button/Button";
import {
  formatSessionTime,
  getHabitData,
} from "../../../../utils/dashboardUtils";
import { HABIT_CATEGORY_META, type Habit } from "../../../habits/types/habit";
import { RECURRENCE_FREQUENCIES, type Session } from "../../types/session";
import {
  getSessionDurationMinutes,
  getSessionStyle,
  HOUR_HEIGHTS,
  PLANNER_VIEW_TYPES,
  type PlannerViewType,
} from "../Planner/plannerUtils";
import styles from "./SessionBlock.module.css";
import { isFuture } from "date-fns";
import { useToast } from "../../../../context/ToastContext";
import { useToggleSessionCompleted } from "../../hooks/useToggleSessionCompleted";

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
  const toggleSessionCompleted = useToggleSessionCompleted();
  const { showToast } = useToast();
  if (!habit) return null;
  const meta = HABIT_CATEGORY_META[habit.category];
  const Icon = meta.icon;
  const hourHeight = HOUR_HEIGHTS[plannerViewType];
  const badgeSize = plannerViewType === PLANNER_VIEW_TYPES.DAY ? 20 : 16;
  const durationMinutes = getSessionDurationMinutes(session);
  const compactClass =
    durationMinutes <= 15
      ? styles.tinySession
      : durationMinutes <= 30
        ? styles.compactSession
        : "";

  const handleSessionToggleCompleted = async () => {
    try {
      await toggleSessionCompleted.mutateAsync({
        sessionId: session.id,
        completed: !session.completed,
      });
    } catch (err) {
      showToast(`Failed to toggle session completed status. ${err}`, "error");
    }
  };

  return (
    <div
      key={session.id}
      className={`${styles.sessionBlock} ${
        session.completed ? styles.completed : ""
      } ${compactClass}`}
      style={getSessionStyle(session, habit, hourHeight)}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className={styles.actions}>
        {!isFuture(new Date(session.finishedAt)) && (
          <Button
            aria-label="Complete session toggle"
            variant="icon"
            style={{ color: "var(--text)" }}
            onClick={(e) => {
              e.stopPropagation();
              handleSessionToggleCompleted();
            }}
          >
            <Check size={18} />
          </Button>
        )}

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
      {plannerViewType === PLANNER_VIEW_TYPES.DAY && (
        <span className={styles.sessionNote}>{session.notes}</span>
      )}
      <span className={styles.sessionTime}>
        {formatSessionTime(session.startedAt)} -{" "}
        {formatSessionTime(session.finishedAt)}
      </span>

      {session.recurrence.frequency !== RECURRENCE_FREQUENCIES.NONE && (
        <Repeat className={styles.recurrenceBadge} size={14} />
      )}

      {session.completed && (
        <div className={styles.completedBadge}>
          <Check size={badgeSize} />
        </div>
      )}
    </div>
  );
}
