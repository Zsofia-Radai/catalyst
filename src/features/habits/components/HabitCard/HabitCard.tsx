import { Button } from "../../../../ui/Button/Button";
import { HABIT_CATEGORY_META, type Habit } from "../../types/habit";
import { Ellipsis } from "lucide-react";
import styles from "./HabitCard.module.css";

type HabitCardProps = {
  habit: Habit;
  onMenuClicked: (habit: Habit) => void;
  menuOpenForHabit: string | null;
  onDeleteClicked: (habit: Habit) => void;
  onEditClicked: (habit: Habit) => void;
};

export function HabitCard({
  habit,
  onMenuClicked,
  menuOpenForHabit,
  onDeleteClicked,
  onEditClicked,
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
          className={`${styles.dropdown} ${
            menuOpenForHabit === habit.id ? styles.dropdownOpen : ""
          }`}
        >
          <Button onClick={() => onEditClicked(habit)}>Edit</Button>
          <Button variant="delete" onClick={() => onDeleteClicked(habit)}>
            Delete
          </Button>
        </div>
      </div>
    </article>
  );
}
