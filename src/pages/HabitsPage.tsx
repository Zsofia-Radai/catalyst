import { useRef, useState } from "react";
import { EditHabitModal } from "../features/habits/components/EditHabitModal/EditHabitModal";
import { HabitCard } from "../features/habits/components/HabitCard/HabitCard";
import { NewHabitModal } from "../features/habits/components/NewHabitModal/NewHabitModal";
import { useHabits } from "../features/habits/context/HabitsContext";
import { type Habit } from "../features/habits/types/habit";
import { calculateHabitLoggedHours } from "../features/habits/utils/habitsUtils";
import { useSessions } from "../features/sessions/context/SessionsContext";
import { useClickOutside } from "../hooks/useClickOutside";
import layout from "../layout/AppLayout.module.css";
import { Button } from "../ui/Button/Button";
import { DeleteConfirmModal } from "../ui/DeleteConfirmModal/DeleteConfirmModal";
import styles from "./HabitsPage.module.css";
import { useToast } from "../context/ToastContext";
import { EmptyState } from "../ui/EmptyState/EmptyState";
import { Tabs } from "../ui/Tabs/Tabs";

export function HabitsPage() {
  const { habits, archiveHabit, restoreHabit, deleteHabit } = useHabits();
  const { sessions, deleteSession } = useSessions();
  const { showToast } = useToast();
  const habitsContainerRef = useRef<HTMLDivElement | null>(null);
  const [newHabitModalOpen, setNewHabitModalOpen] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);
  const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);
  const [menuOpenForHabit, setMenuOpenForHabit] = useState<string | null>(null);
  const [habitView, setHabitView] = useState<HabitViewType>("active");
  const habitsWithLoggedHours = habits.map((habit) => ({
    ...habit,
    loggedHours: calculateHabitLoggedHours(habit.id, sessions),
  }));

  const visibleHabits = habitsWithLoggedHours.filter((habit) =>
    habitView === "active" ? !habit.archived : habit.archived,
  );

  const emptyMessage = habitView
    ? "No active habits yet."
    : "No archived habits yet.";

  useClickOutside(habitsContainerRef, () => {
    setMenuOpenForHabit(null);
  });

  const createHabitClicked = () => {
    setNewHabitModalOpen(true);
  };

  const handleDeleteClicked = (habit: Habit) => {
    setMenuOpenForHabit(null);
    setHabitToDelete(habit);
  };

  const handleDeleteHabit = () => {
    if (!habitToDelete) return;
    deleteHabit(habitToDelete.id);
    sessions.map((session) => {
      if (session.habitId === habitToDelete.id) {
        deleteSession(session.id);
      }
    });
    showToast("Habit deleted!", "delete");
    setHabitToDelete(null);
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

  type HabitViewType = "active" | "archived";
  const HABIT_VIEW_TABS: { label: string; value: HabitViewType }[] = [
    {
      label: "Active",
      value: "active",
    },
    {
      label: "Archived",
      value: "archived",
    },
  ];

  return (
    <div className={layout.page}>
      <div className={styles.header}>
        <Tabs
          tabs={HABIT_VIEW_TABS}
          value={habitView}
          onChange={setHabitView}
        />
        <Button
          type="button"
          variant="secondary"
          className={styles.createButton}
          onClick={createHabitClicked}
        >
          Create habit
        </Button>
      </div>
      {visibleHabits.length === 0 && habitView === "active" && (
        <EmptyState
          title={emptyMessage}
          actionLabel="Create habit"
          action={createHabitClicked}
        />
      )}
      {visibleHabits.length === 0 && habitView === "archived" && (
        <EmptyState title={emptyMessage} />
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

      {habitToDelete && (
        <DeleteConfirmModal
          onCancel={onDeleteCancel}
          objectToDelete={habitToDelete.name}
          onDelete={handleDeleteHabit}
          title="Are you sure you want to delete this habit?"
          details="This action will permanently delete this habit and the associated sessions."
        ></DeleteConfirmModal>
      )}

      {habitToEdit && (
        <EditHabitModal
          closeModal={() => setHabitToEdit(null)}
          habit={habitToEdit}
        />
      )}

      {newHabitModalOpen && (
        <NewHabitModal closeModal={() => setNewHabitModalOpen(false)} />
      )}
    </div>
  );
}
