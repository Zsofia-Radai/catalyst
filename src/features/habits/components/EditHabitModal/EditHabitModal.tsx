import { useHabits } from "../../context/HabitsContext";
import type { Habit, HabitInputs } from "../../types/habit";
import { HabitForm } from "../HabitForm/HabitForm";
import styles from "./EditHabitModal.module.css";
import { CircleX } from "lucide-react";

type EditHabitModalProps = {
  habit: Habit;
  closeModal: () => void;
};

export function EditHabitModal({ habit, closeModal }: EditHabitModalProps) {
  const { updateHabit } = useHabits();

  const handleUpdateHabit = (data: HabitInputs) => {
    if (!habit) return;

    const updatedHabit: Habit = {
      ...habit,
      ...data,
    };
    updateHabit(updatedHabit);
    closeModal();
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.title}>Edit habit: {habit.name}</div>
          <CircleX className={styles.closeIcon} onClick={closeModal} />
        </div>
        <HabitForm habit={habit} onHabitSubmitted={handleUpdateHabit} />
      </div>
    </div>
  );
}
