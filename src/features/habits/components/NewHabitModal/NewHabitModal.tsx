import { useToast } from "../../../../context/ToastContext";
import { Modal } from "../../../../ui/Modal/Modal";
import { useHabits } from "../../context/HabitsContext";
import type { HabitInputs } from "../../types/habit";
import { createHabit } from "../../utils/habitsUtils";
import { HabitForm } from "../HabitForm/HabitForm";

type NewHabitModalProps = {
  closeModal: () => void;
};

export function NewHabitModal({ closeModal }: NewHabitModalProps) {
  const { addHabit } = useHabits();
  const { showToast } = useToast();

  const handleHabitCreated = (data: HabitInputs) => {
    const habit = createHabit(data);
    addHabit(habit);
    showToast("Habit created!", "save");
    closeModal();
  };

  return (
    <Modal title="Create new habit" onClose={closeModal}>
      <HabitForm onHabitSubmitted={handleHabitCreated} />
    </Modal>
  );
}
