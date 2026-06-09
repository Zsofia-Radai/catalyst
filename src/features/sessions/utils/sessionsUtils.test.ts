import { describe, expect, it } from "vitest";
import {
  buildSessionDates,
  buildSessionSeriesRows,
  convertSessionInputToSession,
  convertSessionToSessionInput,
  copyTimeToDate,
  getSessionDurationHours,
  getSeriesRebuildDates,
  isEndAfterStart,
  isNightSession,
  mapSessionFromDb,
} from "./sessionsUtils";
import {
  RECURRENCE_FREQUENCIES,
  type Session,
  type SessionInputs,
} from "../types/session";

const baseRecurrence = { frequency: RECURRENCE_FREQUENCIES.NONE };

function createSession(overrides: Partial<Session> = {}): Session {
  return {
    id: "session-1",
    habitId: "habit-1",
    startedAt: new Date(2026, 5, 1, 9, 15),
    finishedAt: new Date(2026, 5, 1, 11, 45),
    notes: "Practice",
    completed: false,
    recurrence: baseRecurrence,
    ...overrides,
  };
}

function createSessionInput(overrides: Partial<SessionInputs> = {}) {
  return {
    habitId: "habit-2",
    startHour: 10,
    startMinute: 30,
    endHour: 12,
    endMinute: 0,
    notes: "Updated",
    recurrence: baseRecurrence,
    ...overrides,
  };
}

describe("sessionsUtils", () => {
  it("calculates session duration in hours", () => {
    expect(getSessionDurationHours(createSession())).toBe(2.5);
  });

  it("maps database rows into app sessions", () => {
    const session = mapSessionFromDb({
      id: "session-1",
      habit_id: "habit-1",
      started_at: "2026-06-01T09:00:00.000Z",
      finished_at: "2026-06-01T10:00:00.000Z",
      notes: null,
      completed: true,
      frequency: RECURRENCE_FREQUENCIES.WEEKLY,
      repeat_until: "2026-07-01T00:00:00.000Z",
      series_id: null,
    });

    expect(session).toEqual({
      id: "session-1",
      habitId: "habit-1",
      startedAt: new Date("2026-06-01T09:00:00.000Z"),
      finishedAt: new Date("2026-06-01T10:00:00.000Z"),
      notes: "",
      completed: true,
      recurrence: {
        frequency: RECURRENCE_FREQUENCIES.WEEKLY,
        repeatUntil: new Date("2026-07-01T00:00:00.000Z"),
      },
      seriesId: undefined,
    });
  });

  it("converts sessions to form input values", () => {
    expect(convertSessionToSessionInput(createSession())).toEqual({
      habitId: "habit-1",
      startHour: 9,
      startMinute: 15,
      endHour: 11,
      endMinute: 45,
      notes: "Practice",
      recurrence: baseRecurrence,
    });
  });

  it("builds start and finish dates from form input and a day", () => {
    const { startedAt, finishedAt } = buildSessionDates(
      createSessionInput({ startHour: 8, startMinute: 15, endHour: 9 }),
      new Date("2026-06-03T00:00:00.000Z"),
    );

    expect(startedAt.getHours()).toBe(8);
    expect(startedAt.getMinutes()).toBe(15);
    expect(finishedAt.getHours()).toBe(9);
    expect(finishedAt.getMinutes()).toBe(0);
  });

  it("converts input into an updated session", () => {
    const session = convertSessionInputToSession(
      createSessionInput(),
      new Date("2026-06-03T00:00:00.000Z"),
      createSession({ id: "existing" }),
    );

    expect(session.id).toBe("existing");
    expect(session.habitId).toBe("habit-2");
    expect(session.notes).toBe("Updated");
    expect(session.startedAt.getHours()).toBe(10);
    expect(session.finishedAt.getHours()).toBe(12);
  });

  it("allows midnight as a valid end time", () => {
    expect(isEndAfterStart(createSessionInput({ endHour: 0 }))).toBe(true);
    expect(isEndAfterStart(createSessionInput({ startHour: 12, endHour: 11 })))
      .toBe(false);
  });

  it("copies only the time from one date to another", () => {
    const result = copyTimeToDate(
      new Date(2026, 5, 3),
      new Date(2026, 0, 1, 14, 25, 30, 123),
    );

    expect(result.getFullYear()).toBe(2026);
    expect(result.getMonth()).toBe(5);
    expect(result.getDate()).toBe(3);
    expect(result.getHours()).toBe(14);
    expect(result.getMinutes()).toBe(25);
  });

  it("identifies sessions that start or end before 8 AM", () => {
    expect(
      isNightSession(
        createSession({
          startedAt: new Date(2026, 5, 1, 5),
          finishedAt: new Date(2026, 5, 1, 7),
        }),
      ),
    ).toBe(true);
    expect(isNightSession(createSession())).toBe(false);
  });

  it("builds recurring session rows through the repeat-until date", () => {
    const rows = buildSessionSeriesRows({
      habitId: "habit-1",
      startedAt: new Date("2026-06-01T09:00:00.000Z"),
      finishedAt: new Date("2026-06-01T10:00:00.000Z"),
      notes: undefined,
      recurrence: {
        frequency: RECURRENCE_FREQUENCIES.DAILY,
        repeatUntil: new Date("2026-06-03T00:00:00.000Z"),
      },
      seriesId: "series-1",
    });

    expect(rows).toHaveLength(3);
    expect(rows.map((row) => row.started_at)).toEqual([
      "2026-06-01T09:00:00.000Z",
      "2026-06-02T09:00:00.000Z",
      "2026-06-03T09:00:00.000Z",
    ]);
    expect(rows[0]).toMatchObject({
      habit_id: "habit-1",
      notes: null,
      frequency: RECURRENCE_FREQUENCIES.DAILY,
      series_id: "series-1",
    });
  });

  it("rebuilds recurring series from the first original occurrence", () => {
    const updatedSession = createSession({
      startedAt: new Date("2026-06-03T11:30:00.000Z"),
      finishedAt: new Date("2026-06-03T12:45:00.000Z"),
    });

    const { startedAt, finishedAt } = getSeriesRebuildDates(updatedSession, [
      {
        started_at: "2026-06-03T09:00:00.000Z",
        finished_at: "2026-06-03T10:00:00.000Z",
      },
      {
        started_at: "2026-06-01T09:00:00.000Z",
        finished_at: "2026-06-01T10:00:00.000Z",
      },
    ]);

    expect(startedAt.toISOString()).toBe("2026-06-01T11:30:00.000Z");
    expect(finishedAt.toISOString()).toBe("2026-06-01T12:45:00.000Z");
  });
});
