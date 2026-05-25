export const RECURRENCE_FREQUENCIES = {
  NONE: "none",
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
  YEARLY: "yearly",
} as const;

export type RecurrenceFrequency =
  (typeof RECURRENCE_FREQUENCIES)[keyof typeof RECURRENCE_FREQUENCIES];

export type Session = {
  id: string;
  habitId: string;
  startedAt: Date;
  finishedAt: Date;
  notes: string;
  completed: boolean;
  recurrence: {
    frequency: RecurrenceFrequency;
    repeatUntil?: Date;
  };
  seriesId?: string;
};

export type SessionInputs = {
  habitId: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  notes: string;
  recurrence: {
    frequency: RecurrenceFrequency;
    repeatUntil?: Date;
  };
  seriesId?: string;
};
