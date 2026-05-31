import { useToast } from "../../../../context/ToastContext";
import { Modal } from "../../../../ui/Modal/Modal";
import { useHabits } from "../../context/HabitsContext";
import type { Habit, HabitInputs } from "../../types/habit";
import { HabitForm } from "../HabitForm/HabitForm";

type EditHabitModalProps = {
  habit: Habit;
  closeModal: () => void;
};

export function EditHabitModal({ habit, closeModal }: EditHabitModalProps) {
  const { updateHabit } = useHabits();
  const { showToast } = useToast();

  const handleUpdateHabit = async (data: HabitInputs) => {
    if (!habit) return;

    try {
      const updatedHabit: Habit = {
        ...habit,
        ...data,
      };
      await updateHabit(updatedHabit);
      showToast("Habit updated!", "success");
      closeModal();
    } catch (err) {
      showToast(`Failed to save sessions. ${err}`, "error");
    }
  };

  return (
    <Modal title={`Edit habit: ${habit.name}`} onClose={closeModal}>
      <HabitForm habit={habit} onHabitSubmitted={handleUpdateHabit} />
    </Modal>
  );
}
