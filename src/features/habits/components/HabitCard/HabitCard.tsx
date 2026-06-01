import { Button } from "../../../../ui/Button/Button";
import { HABIT_CATEGORY_META, type Habit } from "../../types/habit";
import { Ellipsis } from "lucide-react";
import styles from "./HabitCard.module.css";
import { Pencil, Archive, Trash2, ArchiveRestore } from "lucide-react";
import { calculateHabitLoggedHours } from "../../utils/habitsUtils";
import { useSessions } from "../../../sessions/hooks/useSessions";

type HabitCardProps = {
  habit: Habit;
  isMenuOpen: boolean;
  onMenuClicked: (habit: Habit) => void;
  onDeleteClicked: (habit: Habit) => void;
  onEditClicked: (habit: Habit) => void;
  onArchiveClicked: (habitId: string) => void;
  onRestoreClicked: (habitId: string) => void;
};

export function HabitCard({
  habit,
  onMenuClicked,
  isMenuOpen,
  onDeleteClicked,
  onEditClicked,
  onArchiveClicked,
  onRestoreClicked,
}: HabitCardProps) {
  const { data: sessions = [] } = useSessions();
  const meta = HABIT_CATEGORY_META[habit.category];
  const Icon = meta.icon;
  const loggedHours = calculateHabitLoggedHours(habit.id, sessions);

  return (
    <article
      key={habit.id}
      className={styles.habitCard}
      style={{ "--card-color": habit.color } as React.CSSProperties}
    >
      <div className={styles.menuWrapper}>
        <Ellipsis
          aria-label="Open habit menu"
          className={styles.menuIcon}
          onClick={() => onMenuClicked(habit)}
        />
        <div
          className={`${styles.dropdown} ${isMenuOpen ? styles.dropdownOpen : ""}`}
        >
          {habit.archived && (
            <Button
              aria-label="Restore habit"
              className={styles.menuItem}
              onClick={() => onRestoreClicked(habit.id)}
            >
              <ArchiveRestore size={16} />
              <span>Restore</span>
            </Button>
          )}

          {!habit.archived && (
            <>
              <Button
                aria-label="Edit habit"
                className={styles.menuItem}
                onClick={() => onEditClicked(habit)}
              >
                <Pencil size={16} />
                <span>Edit</span>
              </Button>
              <Button
                aria-label="Archive habit"
                className={styles.menuItem}
                onClick={() => onArchiveClicked(habit.id)}
              >
                <Archive size={16} />
                <span>Archive</span>
              </Button>
            </>
          )}
          <Button
            aria-label="Delete habit"
            className={`${styles.menuItem} ${styles.dangerItem}`}
            onClick={() => onDeleteClicked(habit)}
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </Button>
        </div>
      </div>
      <div className={styles.habit}>
        <Icon size={23} />
        <div className={styles.habitName}>{habit.name}</div>
        <div className={styles.habitGoal}>
          {habit.goal ? `Goal: ${habit.goal}` : null}
        </div>
        <div className={styles.loggedHours}>{loggedHours ?? 0} hrs total</div>
      </div>
    </article>
  );
}
