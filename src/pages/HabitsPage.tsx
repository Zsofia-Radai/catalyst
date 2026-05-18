import { Ellipsis } from "lucide-react";
import { useRef, useState } from "react";
import { HabitForm } from "../components/HabitForm/HabitForm";
import { useHabits } from "../context/HabitsContext";
import { useClickOutside } from "../hooks/useClickOutside";
import layout from "../layout/AppLayout.module.css";
import { HABIT_CATEGORY_META, type Habit } from "../types/habit";
import { Button } from "../ui/Button/Button";
import styles from "./HabitsPage.module.css";
import { DeleteConfirmModal } from "../ui/DeleteConfirmModal/DeleteConfirmModal";

export function HabitsPage() {
  const { habits, addHabit } = useHabits();
  const habitsContainerRef = useRef<HTMLDivElement | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);
  const [isMenuOpenForHabit, setIsmenuOpenForHabit] = useState<string | null>(
    null,
  );

  useClickOutside(habitsContainerRef, () => {
    setIsmenuOpenForHabit(null);
  });

  const createHabitClicked = () => {
    setIsFormOpen(!isFormOpen);
  };

  const handleHabitCreated = (habit: Habit) => {
    setIsFormOpen(false);
    addHabit(habit);
  };

  const handleDeleteClicked = (habit: Habit) => {
    setIsmenuOpenForHabit(null);
    setHabitToDelete(habit);
  };

  const onDeleteCancel = () => {
    setHabitToDelete(null);
  };

  return (
    <div className={layout.page}>
      {!habits && <div>No habits yet.</div>}
      <div className={styles.habitsContainer} ref={habitsContainerRef}>
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
              <div className={styles.menuWrapper}>
                <Ellipsis
                  className={styles.menuIcon}
                  onClick={() =>
                    setIsmenuOpenForHabit((prev) =>
                      prev === habit.id ? null : habit.id,
                    )
                  }
                />

                <div
                  className={`${styles.dropdown} ${
                    isMenuOpenForHabit === habit.id ? styles.dropdownOpen : ""
                  }`}
                >
                  <Button>Edit</Button>
                  <Button
                    variant="delete"
                    onClick={() => handleDeleteClicked(habit)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
      <Button type="button" variant="create" onClick={createHabitClicked}>
        Create habit
      </Button>

      {habitToDelete && (
        <DeleteConfirmModal
          onCancel={onDeleteCancel}
          habit={habitToDelete}
        ></DeleteConfirmModal>
      )}

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
