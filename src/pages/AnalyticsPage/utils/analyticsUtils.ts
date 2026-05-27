import { isSameMonth, isSameWeek, isSameYear } from "date-fns";
import type { Habit } from "../../../features/habits/types/habit";
import { type Session } from "../../../features/sessions/types/session";
import { getSessionDurationHours } from "../../../features/sessions/utils/sessionsUtils";
import {
  ANALYTICS_RANGES,
  type AnalyticsRange,
} from "../types/analytics.types";

export function getCategoryHours(filteredSessions: Session[], habits: Habit[]) {
  return filteredSessions.reduce<Record<string, number>>((acc, session) => {
    const habit = habits.find((habit) => habit.id === session.habitId);

    if (!habit) return acc;

    const duration = getSessionDurationHours(session);

    if (!acc[habit.category]) {
      acc[habit.category] = 0;
    }

    acc[habit.category] += duration;

    return acc;
  }, {});
}

export function isSessionInRange(session: Session, range: AnalyticsRange) {
  const now = new Date();
  const sessionDate = new Date(session.startedAt);
  switch (range) {
    case ANALYTICS_RANGES.WEEK: {
      return isSameWeek(sessionDate, now, { weekStartsOn: 1 });
    }
    case ANALYTICS_RANGES.MONTH: {
      return isSameMonth(sessionDate, now);
    }
    case ANALYTICS_RANGES.YEAR: {
      return isSameYear(sessionDate, now);
    }
    case ANALYTICS_RANGES.ALL: {
      return true;
    }
  }
}

function getDateKey(date: Date) {
  return date.toISOString().split("T")[0];
}

function getDaysInRange(range: AnalyticsRange) {
  const today = new Date();
  const days: Date[] = [];

  const startDate = new Date(today);

  if (range === ANALYTICS_RANGES.WEEK) {
    startDate.setDate(today.getDate() - 6);
  }

  if (range === ANALYTICS_RANGES.MONTH) {
    startDate.setDate(today.getDate() - 29);
  }

  if (range === ANALYTICS_RANGES.YEAR) {
    startDate.setDate(today.getDate() - 364);
  }

  if (range === ANALYTICS_RANGES.ALL) {
    return [];
  }

  const currentDate = new Date(startDate);

  while (currentDate <= today) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return days;
}

type TrendPoint = {
  label: string;
  loggedHours: number;
};

function getMonthKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}`;
}

function getMonthLabel(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
  });
}

function getLoggedHoursByMonth(sessions: Session[]): TrendPoint[] {
  const today = new Date();

  const months = Array.from({ length: 12 }, (_, index) => {
    const date = new Date(
      today.getFullYear(),
      today.getMonth() - 11 + index,
      1,
    );

    return date;
  });

  const hoursByMonth = sessions.reduce<Record<string, number>>(
    (acc, session) => {
      const startedAt = new Date(session.startedAt);
      const monthKey = getMonthKey(startedAt);

      acc[monthKey] = (acc[monthKey] ?? 0) + getSessionDurationHours(session);

      return acc;
    },
    {},
  );

  return months.map((date) => {
    const monthKey = getMonthKey(date);

    return {
      label: getMonthLabel(date),
      loggedHours: hoursByMonth[monthKey] ?? 0,
    };
  });
}

function getMonthsBetween(startDate: Date, endDate: Date) {
  const months: Date[] = [];

  const currentMonth = new Date(
    startDate.getFullYear(),
    startDate.getMonth(),
    1,
  );

  const lastMonth = new Date(endDate.getFullYear(), endDate.getMonth(), 1);

  while (currentMonth <= lastMonth) {
    months.push(new Date(currentMonth));
    currentMonth.setMonth(currentMonth.getMonth() + 1);
  }

  return months;
}

function getLoggedHoursByAllMonths(sessions: Session[]): TrendPoint[] {
  if (sessions.length === 0) return [];

  const sortedSessions = [...sessions].sort(
    (a, b) => new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime(),
  );

  const firstSessionDate = new Date(sortedSessions[0].startedAt);
  const today = new Date();

  const months = getMonthsBetween(firstSessionDate, today);

  const hoursByMonth = sessions.reduce<Record<string, number>>(
    (acc, session) => {
      const startedAt = new Date(session.startedAt);
      const monthKey = getMonthKey(startedAt);

      acc[monthKey] = (acc[monthKey] ?? 0) + getSessionDurationHours(session);

      return acc;
    },
    {},
  );

  return months.map((date) => {
    const monthKey = getMonthKey(date);

    return {
      label: date.toLocaleDateString("en-US", {
        month: "short",
        year: "2-digit",
      }),
      loggedHours: hoursByMonth[monthKey] ?? 0,
    };
  });
}

function getLoggedHoursByDay(
  sessions: Session[],
  range: AnalyticsRange,
): TrendPoint[] {
  const hoursByDay = sessions.reduce<Record<string, number>>((acc, session) => {
    const startedAt = new Date(session.startedAt);
    const dateKey = getDateKey(startedAt);

    acc[dateKey] = (acc[dateKey] ?? 0) + getSessionDurationHours(session);

    return acc;
  }, {});

  return getDaysInRange(range).map((date) => {
    const dateKey = getDateKey(date);

    return {
      label: date.toLocaleDateString("en-US", {
        weekday: range === ANALYTICS_RANGES.WEEK ? "short" : undefined,
        month: range !== ANALYTICS_RANGES.WEEK ? "short" : undefined,
        day: "numeric",
      }),
      loggedHours: hoursByDay[dateKey] ?? 0,
    };
  });
}

export function getLoggedHoursTrend(
  sessions: Session[],
  range: AnalyticsRange,
): TrendPoint[] {
  if (range === ANALYTICS_RANGES.YEAR) {
    return getLoggedHoursByMonth(sessions);
  }

  if (range === ANALYTICS_RANGES.ALL) {
    return getLoggedHoursByAllMonths(sessions);
  }

  return getLoggedHoursByDay(sessions, range);
}
