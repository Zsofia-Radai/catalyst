import { useForm, useWatch, type SubmitHandler } from "react-hook-form";
import { HABIT_CATEGORY_META, type Habit } from "../../../habits/types/habit";
import { Button } from "../../../../ui/Button/Button";
import {
  formatHour,
  formatMinute,
  MINUTES,
  MODAL_HOURS,
} from "../../../../utils/dashboardUtils";
import styles from "./SessionForm.module.css";
import type { SessionInputs } from "../../types/session";

type SessionFormProps = {
  onSubmitForm: (data: SessionInputs) => void;
  habits: Habit[];
  startTime?: number;
  editedSession?: SessionInputs;
};

export function SessionForm({
  onSubmitForm,
  startTime,
  editedSession,
  habits,
}: SessionFormProps) {
  const getDefaultValues = () => {
    if (editedSession) {
      return {
        startHour: editedSession.startHour,
        startMinute: editedSession.startMinute,
        endHour: editedSession.endHour,
        endMinute: editedSession.endMinute,
        habitId: editedSession.habitId,
        notes: editedSession.notes,
      };
    }
    return {
      startHour: startTime ?? 0,
      startMinute: 0,
      endHour: (startTime ?? 0) + 1,
      endMinute: 0,
      habitId: "",
      notes: "",
    };
  };

  function isEndAfterStart(data: SessionInputs) {
    const startTotalMinutes = data.startHour * 60 + data.startMinute;
    const endTotalMinutes = data.endHour * 60 + data.endMinute;
    return endTotalMinutes > startTotalMinutes;
  }

  const {
    register,
    setValue,
    handleSubmit,
    control,
    reset,
    setError,
    formState: { errors },
  } = useForm<SessionInputs>({ defaultValues: getDefaultValues() });

  const selectedHabitId = useWatch({ control, name: "habitId" });
  const startHour = useWatch({ control, name: "startHour" });

  const onSubmit: SubmitHandler<SessionInputs> = (data) => {
    if (!isEndAfterStart(data)) {
      setError("endHour", {
        type: "manual",
        message: "End time must be after start time.",
      });
      return;
    }
    reset();
    onSubmitForm(data);
  };

  return (
    <form
      className={styles.sessionForm}
      id="session-form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
    >
      <div>Activity</div>
      <div className={styles.habits}>
        {habits?.map((habit) => {
          const meta = HABIT_CATEGORY_META[habit.category];
          const Icon = meta.icon;
          return (
            <Button
              key={habit.id}
              type="button"
              className={`${styles.habitChip} ${
                selectedHabitId === habit.id ? styles.selected : ""
              }`}
              style={{ "--card-color": meta.color } as React.CSSProperties}
              onClick={() => setValue("habitId", habit.id)}
              {...register("habitId", { required: true })}
            >
              <Icon size={20} />
              <div>{habit.name}</div>
            </Button>
          );
        })}
        {errors.habitId && (
          <span className={styles.errorMessage} role="alert">
            Habit is required
          </span>
        )}
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
          <select
            {...register("endHour")}
            className={errors.endHour ? styles.error : ""}
          >
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
        {errors.endHour && (
          <div
            className={`${styles.errorMessage} ${styles.hourError}`}
            role="alert"
          >
            {errors.endHour.message}
          </div>
        )}
      </div>
      <div className={styles.notes}>
        <label htmlFor="notes">Notes</label>
        <textarea {...register("notes")} name="notes" id="notes"></textarea>
      </div>
    </form>
  );
}
