import { useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
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
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [popoverPosition, setPopoverPosition] = useState({
    top: 0,
    left: 0,
  });

  useLayoutEffect(() => {
    if (!isOpen || !buttonRef.current) return;

    const updatePosition = () => {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;

      setPopoverPosition({
        top: rect.bottom + 8,
        left: rect.left,
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [isOpen]);

  return (
    <div className={styles.datePickerWrapper}>
      <button
        ref={buttonRef}
        type="button"
        className={styles.datePickerButton}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        {value ? format(value, "yyyy. MM. dd.") : "Select date"}
        <Calendar size={18} />
      </button>

      {isOpen &&
        createPortal(
          <div className={styles.datePickerPopover} style={popoverPosition}>
            <DayPicker
              mode="single"
              selected={value}
              onSelect={(date) => {
                onChange(date);
                setIsOpen(false);
              }}
              disabled={{ before: new Date() }}
            />
          </div>,
          document.body,
        )}
    </div>
  );
}
