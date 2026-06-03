import { useToast } from "../../../../context/ToastContext";
import { Modal } from "../../../../ui/Modal/Modal";
import { getErrorMessage } from "../../../../utils/errorUtils";
import { useCreateHabit } from "../../hooks/useCreateHabit";
import type { HabitInputs } from "../../types/habit";
import { HabitForm } from "../HabitForm/HabitForm";

type NewHabitModalProps = {
  closeModal: () => void;
};

export function NewHabitModal({ closeModal }: NewHabitModalProps) {
  const createHabit = useCreateHabit();
  const { showToast } = useToast();

  const handleHabitCreated = async (habitInputs: HabitInputs) => {
    try {
      await createHabit.mutateAsync(habitInputs);
      showToast("Habit created!", "success");
      closeModal();
    } catch (err) {
      showToast(`Failed to create habit. ${getErrorMessage(err)}`, "error");
    }
  };

  return (
    <Modal title="Create new habit" onClose={closeModal}>
      <HabitForm onHabitSubmitted={handleHabitCreated} />
    </Modal>
  );
}
