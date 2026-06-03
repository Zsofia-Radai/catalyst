import { describe, expect, it } from "vitest";
import { calculateHabitLoggedHours } from "./habitsUtils";
import { RECURRENCE_FREQUENCIES, type Session } from "../../sessions/types/session";

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

describe("calculateHabitLoggedHours", () => {
  it("sums completed sessions for the selected habit only", () => {
    const sessions = [
      createSession({ id: "one" }),
      createSession({
        id: "two",
        startedAt: new Date("2026-06-01T11:00:00.000Z"),
        finishedAt: new Date("2026-06-01T13:30:00.000Z"),
      }),
      createSession({ id: "other-habit", habitId: "habit-2" }),
      createSession({ id: "unfinished", completed: false }),
    ];

    expect(calculateHabitLoggedHours("habit-1", sessions)).toBe(3.5);
  });
});
