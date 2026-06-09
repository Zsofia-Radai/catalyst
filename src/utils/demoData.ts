import type { HabitInputs } from "../features/habits/types/habit";
import {
  RECURRENCE_FREQUENCIES,
  type RecurrenceFrequency,
} from "../features/sessions/types/session";
import { buildSessionSeriesRows } from "../features/sessions/utils/sessionsUtils";
import { supabase } from "../lib/supabase";

type DemoHabit = HabitInputs & {
  key: string;
};

type DemoSession = {
  habitKey: string;
  dayOffset: number;
  startHour: number;
  startMinute: number;
  endHour: number;
  endMinute: number;
  notes: string;
  recurrenceFrequency?: RecurrenceFrequency;
  repeatUntilDayOffset?: number;
};

type DemoSessionRow = {
  habit_id: string;
  started_at: string;
  finished_at: string;
  notes: string | null;
  completed: boolean;
  frequency: RecurrenceFrequency;
  repeat_until: string | null;
  series_id: string | null;
};

export const demoHabits: DemoHabit[] = [
  {
    key: "gym",
    name: "Gym",
    category: "body",
    goal: "3x/week",
    color: "#3b82f6",
  },
  {
    key: "deep-work",
    name: "Deep work",
    category: "career",
    color: "#14b8a6",
  },
  {
    key: "reading",
    name: "Reading",
    category: "mind",
    goal: "15 pages/week",
    color: "#d946ef",
  },
  {
    key: "personal-project",
    name: "Personal project",
    category: "hobby",
    goal: "4h/week",
    color: "#f59e0b",
  },
];

export const demoSessions: DemoSession[] = [
  {
    habitKey: "gym",
    dayOffset: 0,
    startHour: 9,
    startMinute: 0,
    endHour: 10,
    endMinute: 15,
    notes: "Strength training",
  },
  {
    habitKey: "personal-project",
    dayOffset: 0,
    startHour: 18,
    startMinute: 0,
    endHour: 20,
    endMinute: 0,
    notes: "Working on React app",
  },
  {
    habitKey: "deep-work",
    dayOffset: 1,
    startHour: 11,
    startMinute: 0,
    endHour: 12,
    endMinute: 30,
    notes: "Focus block",
    recurrenceFrequency: RECURRENCE_FREQUENCIES.DAILY,
    repeatUntilDayOffset: 3,
  },
  {
    habitKey: "reading",
    dayOffset: 5,
    startHour: 8,
    startMinute: 0,
    endHour: 9,
    endMinute: 0,
    notes: "Morning reading",
    recurrenceFrequency: RECURRENCE_FREQUENCIES.DAILY,
    repeatUntilDayOffset: 6,
  },
  {
    habitKey: "gym",
    dayOffset: 4,
    startHour: 17,
    startMinute: 30,
    endHour: 18,
    endMinute: 30,
    notes: "Mobility and cardio",
  },
];

function getCurrentWeekDate(dayOffset: number) {
  const today = new Date();
  const monday = new Date(today);
  const day = today.getDay() || 7;

  monday.setDate(today.getDate() - day + 1 + dayOffset);
  monday.setHours(0, 0, 0, 0);

  return monday;
}

function copyTimeToWeekDate(dayOffset: number, hour: number, minute: number) {
  const date = getCurrentWeekDate(dayOffset);

  date.setHours(hour, minute, 0, 0);

  return date;
}

type SeedDemoDataOptions = {
  reset?: boolean;
};

export async function seedDemoData(options: SeedDemoDataOptions = {}) {
  const { data: existingHabits, error: habitsError } = await supabase
    .from("habits")
    .select("id")
    .limit(1);

  if (habitsError) throw habitsError;
  if (existingHabits.length > 0 && !options.reset) return;

  if (options.reset) {
    const { error: deleteSessionsError } = await supabase
      .from("sessions")
      .delete()
      .not("id", "is", null);

    if (deleteSessionsError) throw deleteSessionsError;

    const { error: deleteHabitsError } = await supabase
      .from("habits")
      .delete()
      .not("id", "is", null);

    if (deleteHabitsError) throw deleteHabitsError;
  }

  const habitsToInsert = demoHabits.map((habit) => ({
    name: habit.name,
    category: habit.category,
    goal: habit.goal ?? null,
    color: habit.color,
    archived: false,
  }));

  const { data: createdHabits, error: createHabitsError } = await supabase
    .from("habits")
    .insert(habitsToInsert)
    .select("id, name");

  if (createHabitsError) throw createHabitsError;

  const habitIdByKey = Object.fromEntries(
    demoHabits.map((habit, index) => [habit.key, createdHabits[index].id]),
  );

  const sessionsToInsert = demoSessions.flatMap((session): DemoSessionRow[] => {
    const startedAt = copyTimeToWeekDate(
      session.dayOffset,
      session.startHour,
      session.startMinute,
    );
    const finishedAt = copyTimeToWeekDate(
      session.dayOffset,
      session.endHour,
      session.endMinute,
    );

    if (session.recurrenceFrequency) {
      return buildSessionSeriesRows({
        habitId: habitIdByKey[session.habitKey],
        startedAt,
        finishedAt,
        notes: session.notes,
        recurrence: {
          frequency: session.recurrenceFrequency,
          repeatUntil: getCurrentWeekDate(session.repeatUntilDayOffset ?? 6),
        },
      });
    }

    return [
      {
        habit_id: habitIdByKey[session.habitKey],
        started_at: startedAt.toISOString(),
        finished_at: finishedAt.toISOString(),
        notes: session.notes,
        completed: finishedAt < new Date(),
        frequency: RECURRENCE_FREQUENCIES.NONE,
        repeat_until: null,
        series_id: null,
      },
    ];
  });

  const { error: createSessionsError } = await supabase
    .from("sessions")
    .insert(sessionsToInsert);

  if (createSessionsError) throw createSessionsError;
}
