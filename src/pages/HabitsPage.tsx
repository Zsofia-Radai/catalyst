import { useRef, useState } from "react";
import { EditHabitModal } from "../features/habits/components/EditHabitModal/EditHabitModal";
import { HabitCard } from "../features/habits/components/HabitCard/HabitCard";
import { HabitForm } from "../features/habits/components/HabitForm/HabitForm";
import { useHabits } from "../features/habits/context/HabitsContext";
import { type Habit, type HabitInputs } from "../features/habits/types/habit";
import { useClickOutside } from "../hooks/useClickOutside";
import layout from "../layout/AppLayout.module.css";
import { Button } from "../ui/Button/Button";
import { DeleteConfirmModal } from "../ui/DeleteConfirmModal/DeleteConfirmModal";
import styles from "./HabitsPage.module.css";
import { createHabit } from "../features/habits/utils/habitsUtils";

export function HabitsPage() {
  const { habits, addHabit } = useHabits();
  const habitsContainerRef = useRef<HTMLDivElement | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);
  const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);
  const [menuOpenForHabit, setMenuOpenForHabit] = useState<string | null>(null);

  useClickOutside(habitsContainerRef, () => {
    setMenuOpenForHabit(null);
  });

  const createHabitClicked = () => {
    setIsFormOpen(!isFormOpen);
  };

  const handleHabitCreated = (data: HabitInputs) => {
    const habit = createHabit(data);
    setIsFormOpen(false);
    addHabit(habit);
  };

  const handleDeleteClicked = (habit: Habit) => {
    setMenuOpenForHabit(null);
    setHabitToDelete(habit);
  };

  const handleEditClicked = (habit: Habit) => {
    setMenuOpenForHabit(null);
    setHabitToEdit(habit);
  };

  const onDeleteCancel = () => {
    setHabitToDelete(null);
  };

  const handleMenuClicked = (habit: Habit) => {
    setMenuOpenForHabit((prev) => (prev === habit.id ? null : habit.id));
  };

  return (
    <div className={layout.page}>
      {!habits && <div>No habits yet.</div>}
      <div className={styles.habitsContainer} ref={habitsContainerRef}>
        {habits?.map((habit: Habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onMenuClicked={handleMenuClicked}
            onDeleteClicked={handleDeleteClicked}
            onEditClicked={handleEditClicked}
            menuOpenForHabit={menuOpenForHabit}
          />
        ))}
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

      {habitToEdit && (
        <EditHabitModal
          closeModal={() => setHabitToEdit(null)}
          habit={habitToEdit}
        />
      )}

      <div
        className={`${styles.habitForm} ${
          isFormOpen ? styles.habitFormOpen : ""
        }`}
      >
        <HabitForm onHabitSubmitted={handleHabitCreated} />
      </div>
    </div>
  );
}
