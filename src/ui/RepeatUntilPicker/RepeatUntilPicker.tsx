import { useState } from "react";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import "react-day-picker/style.css";
import styles from "./RepeatUntilPicker.module.css";
import { Calendar } from "lucide-react";

type RepeatUntilPickerProps = {
  value?: Date;
  onChange: (date?: Date) => void;
};

export function RepeatUntilPicker({ value, onChange }: RepeatUntilPickerProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.datePickerWrapper}>
      <button
        type="button"
        className={styles.datePickerButton}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {value ? format(value, "yyyy. MM. dd.") : "Select date"}
        <Calendar size={18} />
      </button>

      {isOpen && (
        <div className={styles.datePickerPopover}>
          <DayPicker
            mode="single"
            selected={value}
            onSelect={(date) => {
              onChange(date);
              setIsOpen(false);
            }}
            disabled={{ before: new Date() }}
          />
        </div>
      )}
    </div>
  );
}
