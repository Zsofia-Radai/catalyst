import { useHabits } from "../../features/habits/context/HabitsContext";
import type { Habit } from "../../features/habits/types/habit";
import { Button } from "../Button/Button";
import styles from "./DeleteConfirmModal.module.css";

type DeleteConfirmModalProps = {
  habit: Habit;
  onCancel: () => void;
};

export function DeleteConfirmModal({
  habit,
  onCancel,
}: DeleteConfirmModalProps) {
  const { deleteHabit } = useHabits();

  const handleDelete = () => {
    deleteHabit(habit.id);
    onCancel();
  };

  return (
    <div className={styles.backdrop}>
      <div className={styles.modal}>
        <div className={styles.message}>
          <h3>
            Are you sure you want to delete this habit?
            <div className={styles.habit}>{habit.name}</div>
          </h3>
          <div>
            It permanently deletes this habit and the associated sessions.
          </div>
        </div>
        <div className={styles.footer}>
          <Button onClick={() => onCancel()}>Cancel</Button>
          <Button variant="delete" onClick={() => handleDelete()}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
