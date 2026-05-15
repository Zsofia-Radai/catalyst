import type { Habit } from "../types/habit";

export const HOURS = Array.from({ length: 16 }, (_, index) => index + 8);
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
