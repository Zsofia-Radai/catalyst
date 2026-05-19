import { Button } from "../../../../ui/Button/Button";
import { HABIT_CATEGORY_META, type Habit } from "../../types/habit";
import { Ellipsis } from "lucide-react";
import styles from "./HabitCard.module.css";
import { Pencil, Archive, Trash2, ArchiveRestore } from "lucide-react";

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
  const meta = HABIT_CATEGORY_META[habit.category];
  const Icon = meta.icon;

  return (
    <article
      key={habit.id}
      className={styles.habitCard}
      style={{ "--card-color": meta.color } as React.CSSProperties}
    >
      <Icon />
      <div>
        <div className={styles.habitName}>{habit.name}</div>
        <div>{habit.goal}</div>
        <div>{habit.loggedHours ?? 0} hrs total</div>
      </div>
      <div className={styles.menuWrapper}>
        <Ellipsis
          className={styles.menuIcon}
          onClick={() => onMenuClicked(habit)}
        />
        <div
          className={`${styles.dropdown} ${isMenuOpen ? styles.dropdownOpen : ""}`}
        >
          {habit.archived && (
            <Button
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
                className={styles.menuItem}
                onClick={() => onEditClicked(habit)}
              >
                <Pencil size={16} />
                <span>Edit</span>
              </Button>
              <Button
                className={styles.menuItem}
                onClick={() => onArchiveClicked(habit.id)}
              >
                <Archive size={16} />
                <span>Archive</span>
              </Button>

              <Button
                className={`${styles.menuItem} ${styles.dangerItem}`}
                onClick={() => onDeleteClicked(habit)}
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
