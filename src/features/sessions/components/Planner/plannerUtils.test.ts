import { describe, expect, it } from "vitest";
import { RECURRENCE_FREQUENCIES, type Session } from "../../types/session";
import { type Habit } from "../../../habits/types/habit";
import { getSessionStyle } from "./plannerUtils";

const habit: Habit = {
  id: "habit-1",
  name: "Practice",
  category: "hobby",
  goal: "Ship small things",
  color: "#3b82f6",
  createdAt: 1,
  archived: false,
};

function createSession(overrides: Partial<Session> = {}): Session {
  return {
    id: "session-1",
    habitId: "habit-1",
    startedAt: new Date("2026-06-01T09:30:00.000Z"),
    finishedAt: new Date("2026-06-01T11:00:00.000Z"),
    notes: "",
    completed: false,
    recurrence: { frequency: RECURRENCE_FREQUENCIES.NONE },
    ...overrides,
  };
}

describe("getSessionStyle", () => {
  it("positions sessions by start minutes and duration", () => {
    expect(getSessionStyle(createSession(), habit, 120)).toEqual({
      top: "60px",
      height: "180px",
      "--card-color": "#3b82f6",
    });
  });

  it("handles sessions that finish after midnight", () => {
    const style = getSessionStyle(
      createSession({
        startedAt: new Date("2026-06-01T23:30:00.000Z"),
        finishedAt: new Date("2026-06-01T01:00:00.000Z"),
      }),
      habit,
      60,
    );

    expect(style.height).toBe("90px");
  });
});
