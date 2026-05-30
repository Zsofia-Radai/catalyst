import { useToast } from "../../../../context/ToastContext";
import { Modal } from "../../../../ui/Modal/Modal";
import { useHabits } from "../../context/HabitsContext";
import type { HabitInputs } from "../../types/habit";
import { HabitForm } from "../HabitForm/HabitForm";

type NewHabitModalProps = {
  closeModal: () => void;
};

export function NewHabitModal({ closeModal }: NewHabitModalProps) {
  const { createHabit } = useHabits();
  const { showToast } = useToast();

  const handleHabitCreated = (habitInputs: HabitInputs) => {
    createHabit(habitInputs);
    showToast("Habit created!", "save");
    closeModal();
  };

  return (
    <Modal title="Create new habit" onClose={closeModal}>
      <HabitForm onHabitSubmitted={handleHabitCreated} />
    </Modal>
  );
}
