import type { Appointment } from "@fieldops/shared";
import { describe, expect, it } from "vitest";
import { InMemoryStatusEventLog } from "../src/db/StatusEventLog.ts";
import { InvalidTransitionError } from "../src/errors.ts";
import { transition } from "../src/status/transitions.ts";
import { frozenClock } from "./helpers/frozenTime.ts";

const appointment: Appointment = {
  id: "appt-1",
  technicianId: "tech-1",
  customerId: "cust-1",
  startsAt: "2026-10-05T09:00:00.000Z",
  endsAt: "2026-10-05T10:00:00.000Z",
  status: "scheduled",
  customerTimeZone: "America/Chicago",
};

describe("transition", () => {
  it("applies an allowed change and records it", () => {
    const events = new InMemoryStatusEventLog();
    const clock = frozenClock("2026-10-05T09:01:00Z");
    const started = transition(appointment, "in_progress", { events, clock });
    expect(started.status).toBe("in_progress");
    expect(events.events).toEqual([
      { appointmentId: "appt-1", from: "scheduled", to: "in_progress", changedAt: "2026-10-05T09:01:00.000Z" },
    ]);
  });

  it("rejects a change that is not allowed", () => {
    const events = new InMemoryStatusEventLog();
    const clock = frozenClock("2026-10-05T09:01:00Z");
    expect(() => transition(appointment, "completed", { events, clock })).toThrow(InvalidTransitionError);
    expect(events.events).toHaveLength(0);
  });
});
