export type Session = {
  id: string;
  habitId: string;
  startedAt: Date;
  finishedAt: Date;
  notes: string;
};

export type SessionInputs = {
  habitId: string;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  notes: string;
};
