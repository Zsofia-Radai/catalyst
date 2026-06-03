import { afterEach, describe, expect, it, vi } from "vitest";
import { type Habit } from "../../../features/habits/types/habit";
import {
  RECURRENCE_FREQUENCIES,
  type Session,
} from "../../../features/sessions/types/session";
import { ANALYTICS_RANGES } from "../types/analytics.types";
import {
  getCategoryHours,
  getLoggedHoursTrend,
  isSessionInRange,
} from "./analyticsUtils";

const habits: Habit[] = [
  {
    id: "habit-1",
    name: "Read",
    category: "mind",
    color: "#68AEED",
    createdAt: 1,
    archived: false,
  },
  {
    id: "habit-2",
    name: "Run",
    category: "body",
    color: "#90EDD9",
    createdAt: 2,
    archived: false,
  },
];

function createSession(overrides: Partial<Session>): Session {
  return {
    id: "session",
    habitId: "habit-1",
    startedAt: new Date("2026-06-01T09:00:00.000Z"),
    finishedAt: new Date("2026-06-01T10:00:00.000Z"),
    notes: "",
    completed: true,
    recurrence: { frequency: RECURRENCE_FREQUENCIES.NONE },
    ...overrides,
  };
}

describe("analyticsUtils", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("groups logged hours by habit category", () => {
    const sessions = [
      createSession({ id: "mind-one" }),
      createSession({
        id: "mind-two",
        startedAt: new Date("2026-06-01T11:00:00.000Z"),
        finishedAt: new Date("2026-06-01T12:30:00.000Z"),
      }),
      createSession({
        id: "body-one",
        habitId: "habit-2",
        startedAt: new Date("2026-06-01T15:00:00.000Z"),
        finishedAt: new Date("2026-06-01T15:45:00.000Z"),
      }),
      createSession({ id: "missing-habit", habitId: "unknown" }),
    ];

    expect(getCategoryHours(sessions, habits)).toEqual({
      mind: 2.5,
      body: 0.75,
    });
  });

  it("checks whether sessions are in the selected range", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-03T12:00:00.000Z"));

    expect(
      isSessionInRange(
        createSession({ startedAt: new Date("2026-06-02T09:00:00.000Z") }),
        ANALYTICS_RANGES.WEEK,
      ),
    ).toBe(true);
    expect(
      isSessionInRange(
        createSession({ startedAt: new Date("2026-05-31T09:00:00.000Z") }),
        ANALYTICS_RANGES.WEEK,
      ),
    ).toBe(false);
    expect(
      isSessionInRange(
        createSession({ startedAt: new Date("2025-06-02T09:00:00.000Z") }),
        ANALYTICS_RANGES.YEAR,
      ),
    ).toBe(false);
    expect(isSessionInRange(createSession({}), ANALYTICS_RANGES.ALL)).toBe(
      true,
    );
  });

  it("returns a weekly logged-hours trend with empty days filled in", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-03T12:00:00.000Z"));

    const trend = getLoggedHoursTrend(
      [
        createSession({
          startedAt: new Date("2026-06-01T09:00:00.000Z"),
          finishedAt: new Date("2026-06-01T10:00:00.000Z"),
        }),
        createSession({
          startedAt: new Date("2026-06-03T09:00:00.000Z"),
          finishedAt: new Date("2026-06-03T11:00:00.000Z"),
        }),
      ],
      ANALYTICS_RANGES.WEEK,
    );

    expect(trend).toHaveLength(7);
    expect(trend.map((point) => point.loggedHours)).toEqual([
      1, 0, 2, 0, 0, 0, 0,
    ]);
  });
});
