import type { Habit } from "../features/habits/types/habit";
import type { Session } from "../features/sessions/types/session";

export const FULL_DAY_HOURS = Array.from({ length: 24 }, (_, index) => index);
export const DAY_HOURS = FULL_DAY_HOURS.filter((hour) => hour >= 8);
export const NIGHT_HOURS = FULL_DAY_HOURS.filter((hour) => hour < 8);
export const MODAL_HOURS = [...DAY_HOURS, ...NIGHT_HOURS];
export const MINUTES = Array.from([0, 15, 30, 45]);

export function formatSessionTime(date: string | Date) {
  return new Date(date).toLocaleTimeString("hu-HU", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const formatTime = (hour: number) => {
  return String(hour).padStart(2, "0") + ":00";
};

export const formatHour = (hour: number) => {
  return hour.toString().padStart(2, "0");
};

export const formatMinute = (minute: number) => {
  if (minute === 0) return "00";
  return minute;
};

export function formatCurrentDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export function getHabitData(habits: Habit[], habitId: string) {
  return habits.find((habit) => habit.id === habitId);
}

export function isSameDay(date1: Date, date2: Date) {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function getSessionForHour(sessions: Session[], hour: number) {
  return sessions.filter(
    (session) => new Date(session.startedAt).getHours() === hour,
  );
}
