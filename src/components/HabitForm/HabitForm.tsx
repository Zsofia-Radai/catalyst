import { useForm, type SubmitHandler } from "react-hook-form";
import {
  HABIT_CATEGORIES,
  type Habit,
  type HabitCategory,
} from "../../types/habit";
import { Button } from "../../ui/Button/Button";
import styles from "./HabitForm.module.css";

type HabitFormProps = {
  onHabitCreated: (habit: Habit) => void;
};

type Inputs = {
  name: string;
  category: HabitCategory;
  goal: string;
};

function createHabit(data: Inputs): Habit {
  return {
    id: crypto.randomUUID(),
    name: data.name,
    category: data.category,
    createdAt: Date.now(),
    goal: data.goal,
  };
}

export function HabitForm({ onHabitCreated }: HabitFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>();

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    const habit = createHabit(data);
    reset();
    onHabitCreated(habit);
  };

  return (
    <form
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

      <Button type="submit" variant="create" className={styles.submitButton}>
        Save habit
      </Button>
    </form>
  );
}
