import { useState } from "react";
import layout from "../layout/AppLayout.module.css";
import { Button } from "../ui/Button/Button";
import { HabitForm } from "../components/HabitForm/HabitForm";
import styles from "./HabitsPage.module.css";
import { HABIT_CATEGORY_META, type Habit } from "../types/habit";
import { CircleX } from "lucide-react";

export function HabitsPage() {
  const [storedHabits, setSToredHabits] = useState(
    JSON.parse(localStorage.getItem("habits") || "[]"),
  );
  const [isFormOpen, setIsFormOpen] = useState(false);

  const addHabit = () => {
    setIsFormOpen(!isFormOpen);
  };

  const handleHabitCreated = (habit: Habit) => {
    console.log(habit);
    setIsFormOpen(false);
    localStorage.setItem("habits", JSON.stringify([...storedHabits, habit]));
  };

  const deleteHabit = (id: string) => {
    const updatedHabits = storedHabits.filter(
      (habit: Habit) => habit.id !== id,
    );
    localStorage.setItem("habits", JSON.stringify(updatedHabits));
    setSToredHabits(updatedHabits);
  };

  return (
    <div className={layout.page}>
      {!storedHabits && <div>No habits yet.</div>}
      <div className={styles.habitsContainer}>
        {storedHabits?.map((habit: Habit) => {
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
      <Button type="button" variant="create" onClick={addHabit}>
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
