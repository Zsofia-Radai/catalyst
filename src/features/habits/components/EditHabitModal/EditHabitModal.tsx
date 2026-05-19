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
    <Modal title={`Edit habit: ${habit.name}`} onClose={closeModal}>
      <HabitForm habit={habit} onHabitSubmitted={handleUpdateHabit} />
    </Modal>
  );
}
