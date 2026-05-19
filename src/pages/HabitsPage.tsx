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
import {
  calculateHabitLoggedHours,
  createHabit,
} from "../features/habits/utils/habitsUtils";
import { useSessions } from "../features/sessions/context/SessionsContext";

export function HabitsPage() {
  const { habits, addHabit, archiveHabit, restoreHabit } = useHabits();
  const { sessions } = useSessions();
  const habitsContainerRef = useRef<HTMLDivElement | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);
  const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);
  const [menuOpenForHabit, setMenuOpenForHabit] = useState<string | null>(null);
  const [showActive, setShowActive] = useState<boolean>(true);
  const habitsWithLoggedHours = habits.map((habit) => ({
    ...habit,
    loggedHours: calculateHabitLoggedHours(habit.id, sessions),
  }));

  const visibleHabits = habitsWithLoggedHours.filter((habit) =>
    showActive ? !habit.archived : habit.archived,
  );
  const emptyMessage = showActive
    ? "No active habits yet."
    : "No archived habits yet.";

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

  const handleRestoreClicked = (habitId: string) => {
    restoreHabit(habitId);
    setMenuOpenForHabit(null);
  };

  const handleArchiveClicked = (habitId: string) => {
    archiveHabit(habitId);
    setMenuOpenForHabit(null);
  };

  const onDeleteCancel = () => {
    setHabitToDelete(null);
  };

  const handleMenuClicked = (habit: Habit) => {
    setMenuOpenForHabit((prev) => (prev === habit.id ? null : habit.id));
  };

  return (
    <div className={layout.page}>
      <div className={styles.header}>
        <div
          className={showActive ? styles.activeTab : styles.tab}
          onClick={() => setShowActive(true)}
        >
          Active
        </div>
        <div
          className={!showActive ? styles.activeTab : styles.tab}
          onClick={() => setShowActive(false)}
        >
          Archived
        </div>
      </div>
      {visibleHabits.length === 0 && (
        <div className={styles.emptyState}>{emptyMessage}</div>
      )}
      <div className={styles.habitsContainer} ref={habitsContainerRef}>
        {visibleHabits?.map((habit: Habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onMenuClicked={handleMenuClicked}
            onDeleteClicked={handleDeleteClicked}
            onEditClicked={handleEditClicked}
            onArchiveClicked={handleArchiveClicked}
            onRestoreClicked={handleRestoreClicked}
            isMenuOpen={menuOpenForHabit === habit.id}
          />
        ))}
      </div>
      {showActive && (
        <Button type="button" variant="create" onClick={createHabitClicked}>
          Create habit
        </Button>
      )}

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
