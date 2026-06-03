import { useRef, useState } from "react";
import { useToast } from "../context/ToastContext";
import { EditHabitModal } from "../features/habits/components/EditHabitModal/EditHabitModal";
import { HabitCard } from "../features/habits/components/HabitCard/HabitCard";
import { NewHabitModal } from "../features/habits/components/NewHabitModal/NewHabitModal";
import { type Habit } from "../features/habits/types/habit";
import { useClickOutside } from "../hooks/useClickOutside";
import layout from "../layout/AppLayout.module.css";
import { Button } from "../ui/Button/Button";
import { DeleteConfirmModal } from "../ui/DeleteConfirmModal/DeleteConfirmModal";
import { EmptyState } from "../ui/EmptyState/EmptyState";
import { PageLoader } from "../ui/PageLoader/PageLoader";
import { Tabs } from "../ui/Tabs/Tabs";
import styles from "./HabitsPage.module.css";
import { getErrorMessage } from "../utils/errorUtils";
import { useHabits } from "../features/habits/hooks/useHabits";
import { useDeleteHabit } from "../features/habits/hooks/useDeleteHabit";
import { useArchiveHabit } from "../features/habits/hooks/useArchiveHabit";
import { useRestoreHabit } from "../features/habits/hooks/useRestoreHabit";

export function HabitsPage() {
  const {
    data: habits = [],
    isLoading: isHabitsLoading,
    error: habitsError,
  } = useHabits();
  const deleteHabit = useDeleteHabit();
  const archiveHabit = useArchiveHabit();
  const restoreHabit = useRestoreHabit();
  const { showToast } = useToast();
  const habitsContainerRef = useRef<HTMLDivElement | null>(null);
  const [newHabitModalOpen, setNewHabitModalOpen] = useState(false);
  const [habitToDelete, setHabitToDelete] = useState<Habit | null>(null);
  const [habitToEdit, setHabitToEdit] = useState<Habit | null>(null);
  const [menuOpenForHabit, setMenuOpenForHabit] = useState<string | null>(null);
  const [habitView, setHabitView] = useState<HabitViewType>("active");

  const visibleHabits = habits.filter((habit) =>
    habitView === "active" ? !habit.archived : habit.archived,
  );

  const emptyMessage =
    habitView === "active"
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

  const handleDeleteHabit = async () => {
    if (!habitToDelete) return;

    try {
      await deleteHabit.mutateAsync(habitToDelete.id);
      showToast("Habit deleted!", "delete");
      setHabitToDelete(null);
    } catch (err) {
      showToast(`Failed to delete habit. ${getErrorMessage(err)}`, "error");
    }
  };

  const handleEditClicked = (habit: Habit) => {
    setMenuOpenForHabit(null);
    setHabitToEdit(habit);
  };

  const handleRestoreClicked = async (habitId: string) => {
    try {
      await restoreHabit.mutateAsync(habitId);
      showToast("Habit restored!", "success");
    } catch (err) {
      showToast(`Failed to restore habit. ${getErrorMessage(err)}`, "error");
    }
    setMenuOpenForHabit(null);
  };

  const handleArchiveClicked = async (habitId: string) => {
    try {
      await archiveHabit.mutateAsync(habitId);
      setMenuOpenForHabit(null);
      showToast("Habit archived!", "success");
    } catch (err) {
      showToast(`Failed to archive habit. ${getErrorMessage(err)}`, "error");
    }
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

  if (isHabitsLoading) {
    return (
      <div className={layout.page}>
        <PageLoader />
      </div>
    );
  }

  if (habitsError) {
    return (
      <div className={layout.page}>
        <EmptyState title="Failed to load habits." />
      </div>
    );
  }

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
