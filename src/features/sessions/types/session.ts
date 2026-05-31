export const RECURRENCE_FREQUENCIES = {
  NONE: "none",
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  YEARLY: "yearly",
} as const;

export type RecurrenceFrequency =
  (typeof RECURRENCE_FREQUENCIES)[keyof typeof RECURRENCE_FREQUENCIES];

export type Recurrence = {
  frequency: RecurrenceFrequency;
  repeatUntil?: Date;
};

export type Session = {
  id: string;
  habitId: string;
  startedAt: Date;
  finishedAt: Date;
  notes: string;
  completed: boolean;
  recurrence: Recurrence;
  seriesId?: string;
};

export type SessionInputs = {
  habitId: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  notes: string;
  recurrence: Recurrence;
  seriesId?: string;
};

export type SessionRow = {
  id: string;
  habit_id: string;
  started_at: string;
  finished_at: string;
  notes: string | null;
  completed: boolean;
  frequency: RecurrenceFrequency;
  repeat_until: string | null;
  series_id: string | null;
};
