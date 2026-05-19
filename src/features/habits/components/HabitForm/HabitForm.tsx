import { useForm, type SubmitHandler } from "react-hook-form";
import { Button } from "../../../../ui/Button/Button";
import {
  HABIT_CATEGORIES,
  type Habit,
  type HabitInputs,
} from "../../types/habit";
import styles from "./HabitForm.module.css";

type HabitFormProps = {
  onHabitSubmitted: (data: HabitInputs) => void;
  habit?: Habit;
};

export function HabitForm({ onHabitSubmitted, habit }: HabitFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HabitInputs>({
    defaultValues: {
      name: habit?.name,
      category: habit?.category,
      goal: habit?.goal,
    },
  });

  const onSubmit: SubmitHandler<HabitInputs> = (data) => {
    onHabitSubmitted(data);
    reset();
  };

  return (
    <>
      <form
        id="habit-form"
        className={styles.habitForm}
        onSubmit={handleSubmit(onSubmit)}
        noValidate
      >
        <label htmlFor="habit-name">Habit name</label>
        <div>
          <input
            className={styles.habitNameInput}
            id="habit-name"
            placeholder="Habit name"
            {...register("name", { required: true })}
          />
          {errors.name?.type === "required" && (
            <span className={styles.errorMessage} role="alert">
              Habit name is required
            </span>
          )}
        </div>

        <label htmlFor="habit-category">Category</label>
        <select id="habit-category" {...register("category")}>
          {HABIT_CATEGORIES.map((habit, index) => (
            <option key={index} value={HABIT_CATEGORIES[index]}>
              {habit}
            </option>
          ))}
        </select>

        <label htmlFor="habit-goal">Goal</label>
        <textarea
          placeholder="goal"
          id="habit-goal"
          {...register("goal")}
        ></textarea>
      </form>
      <Button
        form="habit-form"
        type="submit"
        variant="save"
        className={styles.submitButton}
      >
        Save habit
      </Button>
    </>
  );
}
