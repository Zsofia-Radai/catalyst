import type { Habit } from "../types/habit";
import type { Session } from "../types/session";

export const HOURS = Array.from({ length: 16 }, (_, index) => index + 8);
export const MINUTES = Array.from([0, 15, 30, 45]);
export const NIGHT_HOURS = Array.from({ length: 8 }, (_, index) => index);

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
