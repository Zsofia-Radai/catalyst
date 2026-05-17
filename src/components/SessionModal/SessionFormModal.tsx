import { CircleX } from "lucide-react";
import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { HABIT_CATEGORY_META, type Habit } from "../../types/habit";
import { Button } from "../../ui/Button/Button";
import {
  formatHour,
  formatMinute,
  MINUTES,
  MODAL_HOURS,
} from "../../utils/dashboardUtils";
import styles from "./SessionModal.module.css";

type SessionFormModalProps = {
  onCancel: () => void;
  onSubmitForm: (data: Inputs) => void;
  startTime: number;
  habits: Habit[];
};

type Inputs = {
  habitId: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  notes: string;
};

export function SessionFormModal({
  onCancel,
  onSubmitForm,
  startTime,
  habits,
}: SessionFormModalProps) {
  const { register, setValue, handleSubmit, control, reset } = useForm<Inputs>({
    defaultValues: {
      startHour: startTime,
      startMinute: 0,
      endHour: startTime + 1,
      endMinute: 0,
      habitId: "",
      notes: "",
    },
  });

  const selectedHabitId = useWatch({ control, name: "habitId" });
  const startHour = useWatch({ control, name: "startHour" });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    reset();
    onSubmitForm(data);
  };

  return (
    <div className={styles.backdrop} onClick={onCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Add session</h2>
          <CircleX className={styles.deleteIcon} onClick={onCancel} />
        </div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div>Activity</div>
          <div className={styles.habits}>
            {habits?.map((habit) => {
              const meta = HABIT_CATEGORY_META[habit.category];
              const Icon = meta.icon;
              return (
                <Button
                  key={habit.id}
                  type="button"
                  variant=""
                  className={`${styles.habitChip} ${
                    selectedHabitId === habit.id ? styles.selected : ""
                  }`}
                  style={{ "--card-color": meta.color } as React.CSSProperties}
                  onClick={() => setValue("habitId", habit.id)}
                >
                  <Icon size={20} />
                  <div>{habit.name}</div>
                </Button>
              );
            })}
          </div>
          <div className={styles.timeContainer}>
            <span>Start</span>
            <span>End</span>
            <div className={styles.time}>
              <select {...register("startHour")}>
                {MODAL_HOURS.map((hour) => (
                  <option key={hour} value={hour}>
                    {formatHour(hour)}
                  </option>
                ))}
              </select>
              <div>:</div>
              <select {...register("startMinute")}>
                {MINUTES.map((minute) => (
                  <option key={minute} value={minute}>
                    {formatMinute(minute)}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.time}>
              <select {...register("endHour")}>
                {MODAL_HOURS.map((hour) => (
                  <option key={hour} value={hour} disabled={hour < startHour}>
                    {formatHour(hour)}
                  </option>
                ))}
              </select>
              <div>:</div>
              <select {...register("endMinute")}>
                {MINUTES.map((minute) => (
                  <option key={minute} value={minute}>
                    {formatMinute(minute)}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div></div>
          <label htmlFor="notes">Notes</label>
          <textarea {...register("notes")} name="notes" id="notes"></textarea>
          <Button type="submit" variant="create">
            Save session
          </Button>
        </form>
      </div>
    </div>
  );
}
