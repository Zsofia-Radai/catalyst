import {
  ActivityIcon,
  CircleCheck,
  Clock4,
  MoveRight,
  Notebook,
  Repeat,
} from "lucide-react";
import {
  Controller,
  useForm,
  useWatch,
  type SubmitHandler,
} from "react-hook-form";
import { Button } from "../../../../ui/Button/Button";
import { RepeatUntilPicker } from "../../../../ui/RepeatUntilPicker/RepeatUntilPicker";
import {
  formatHour,
  formatMinute,
  MINUTES,
  MODAL_HOURS,
} from "../../../../utils/dashboardUtils";
import { HABIT_CATEGORY_META, type Habit } from "../../../habits/types/habit";
import {
  RECURRENCE_FREQUENCIES,
  type SessionInputs,
} from "../../types/session";
import { isEndAfterStart } from "../../utils/sessionsUtils";
import styles from "./SessionForm.module.css";

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
        recurrence: editedSession.recurrence,
      };
    }
    return {
      startHour: startTime ?? 0,
      startMinute: 0,
      endHour: startTime === 23 ? 0 : (startTime ?? 0) + 1,
      endMinute: 0,
      habitId: "",
      notes: "",
      recurrence: {
        frequency: RECURRENCE_FREQUENCIES.NONE,
        repeatUntil: undefined,
      },
    };
  };

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
  const frequency = useWatch({ control, name: "recurrence.frequency" });

  const onSubmit: SubmitHandler<SessionInputs> = (data) => {
    if (!isEndAfterStart(data)) {
      setError("endHour", {
        type: "manual",
        message:
          "End time must be later than start time. Sessions can't continue into the next day.",
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
      <div className={styles.habitsSection}>
        <div className={styles.sectionHeader}>
          <ActivityIcon size={18} />
          <div className={styles.sectionTitle}>Activity</div>
          <div className={styles.description}>Choose what to work on</div>
        </div>
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
                style={{ "--card-color": habit.color } as React.CSSProperties}
                onClick={() => setValue("habitId", habit.id)}
                {...register("habitId", { required: true })}
              >
                <Icon size={20} />
                <div>{habit.name}</div>
                {selectedHabitId === habit.id && (
                  <CircleCheck size={20} className={styles.checkmark} />
                )}
              </Button>
            );
          })}
        </div>
        {errors.habitId && (
          <div className={styles.errorMessage} role="alert">
            Habit is required
          </div>
        )}
      </div>

      <div className={styles.detailsContainer}>
        <div className={styles.timeSection}>
          <div className={styles.sectionHeader}>
            <Clock4 size={18} />
            <div className={styles.sectionTitle}>Time</div>
            <div className={styles.description}>
              Set your session start and end time
            </div>
          </div>
          <div className={styles.timeContainer}>
            <span className={styles.label}>Start time</span>
            <span></span>
            <span className={styles.label}>End time</span>
            <div className={styles.time}>
              <select
                {...register("startHour", { valueAsNumber: true })}
                className={errors.endHour ? styles.error : ""}
              >
                {MODAL_HOURS.map((hour) => (
                  <option key={hour} value={hour}>
                    {formatHour(hour)}
                  </option>
                ))}
              </select>
              <div>:</div>
              <select {...register("startMinute", { valueAsNumber: true })}>
                {MINUTES.map((minute) => (
                  <option key={minute} value={minute}>
                    {formatMinute(minute)}
                  </option>
                ))}
              </select>
            </div>
            <MoveRight size={16} />
            <div className={styles.time}>
              <select
                {...register("endHour", { valueAsNumber: true })}
                className={errors.endHour ? styles.error : ""}
              >
                {MODAL_HOURS.map((hour) => (
                  <option key={hour} value={hour}>
                    {formatHour(hour)}
                  </option>
                ))}
              </select>
              <div>:</div>
              <select {...register("endMinute", { valueAsNumber: true })}>
                {MINUTES.map((minute) => (
                  <option key={minute} value={minute}>
                    {formatMinute(minute)}
                  </option>
                ))}
              </select>
            </div>
            {errors.endHour && (
              <div className={styles.errorMessage} role="alert">
                {errors.endHour.message}
              </div>
            )}
          </div>
        </div>

        <div className={styles.repeatSection}>
          <div className={styles.sectionHeader}>
            <Repeat size={18} />
            <div>
              <div className={styles.sectionTitle}>Repeat</div>
              {frequency === RECURRENCE_FREQUENCIES.NONE && (
                <div className={styles.description}>
                  Make this a recurring session
                </div>
              )}
            </div>
            {frequency !== RECURRENCE_FREQUENCIES.NONE && (
              <div className={styles.recurringBadge}>
                <Repeat size={20} />
                <span>Recurring session</span>
              </div>
            )}
          </div>
          <div className={styles.repeatDetails}>
            <div className={styles.label}>Repeats</div>
            <select
              {...register("recurrence.frequency")}
              id="repeat-frequency"
              className={styles.frequencyDropdown}
            >
              {Object.entries(RECURRENCE_FREQUENCIES).map(([key, value]) => (
                <option key={key} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          {frequency !== RECURRENCE_FREQUENCIES.NONE && (
            <div className={styles.repeatDetails}>
              <div className={styles.label}>Repeat until</div>
              <Controller
                name="recurrence.repeatUntil"
                control={control}
                rules={{
                  required: "Repeat until is required",
                }}
                render={({ field }) => (
                  <RepeatUntilPicker
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
              />
            </div>
          )}
          {errors.recurrence?.repeatUntil && (
            <div className={styles.errorMessage} role="alert">
              {errors.recurrence.repeatUntil.message}
            </div>
          )}
        </div>

        <div className={styles.notesSection}>
          <div className={styles.sectionHeader}>
            <Notebook size={18} />
            <div className={styles.sectionTitle}>Notes</div>
          </div>
          <textarea {...register("notes")} name="notes" id="notes"></textarea>
        </div>
      </div>
    </form>
  );
}
