import { CircleX } from "lucide-react";
import { useState } from "react";
import { HabitForm } from "../components/HabitForm/HabitForm";
import { useHabits } from "../context/HabitsContext";
import layout from "../layout/AppLayout.module.css";
import { HABIT_CATEGORY_META, type Habit } from "../types/habit";
import { Button } from "../ui/Button/Button";
import styles from "./HabitsPage.module.css";

export function HabitsPage() {
  const { habits, addHabit, deleteHabit } = useHabits();

  const [isFormOpen, setIsFormOpen] = useState(false);

  const createHabitClicked = () => {
    setIsFormOpen(!isFormOpen);
  };

  const handleHabitCreated = (habit: Habit) => {
    setIsFormOpen(false);
    addHabit(habit);
  };

  return (
    <div className={layout.page}>
      {!habits && <div>No habits yet.</div>}
      <div className={styles.habitsContainer}>
        {habits?.map((habit: Habit) => {
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
              <CircleX
                className={styles.deleteIcon}
                onClick={() => deleteHabit(habit.id)}
              />
            </article>
          );
        })}
      </div>
      <Button type="button" variant="create" onClick={createHabitClicked}>
        Create habit
      </Button>

      <div
        className={`${styles.habitForm} ${
          isFormOpen ? styles.habitFormOpen : ""
        }`}
      >
        <HabitForm onHabitCreated={handleHabitCreated} />
      </div>
    </div>
  );
}
