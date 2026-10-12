import { describe, expect, it } from "vitest";
import { AppointmentNotFoundError, BookingConflictError, InvalidTransitionError } from "../src/errors.ts";
import { setup, visit } from "./helpers/setup.ts";

describe("BookingService.reschedule", () => {
  it("moves an appointment to a free slot", () => {
    const { service, repo } = setup();
    const appointment = service.book(visit("tech-1", "09:00", "10:00"));
    const moved = service.reschedule(appointment.id, "2026-10-05T13:00:00.000Z", "2026-10-05T14:00:00.000Z");
    expect(repo.get(appointment.id)?.startsAt).toBe(moved.startsAt);
  });

  it("rejects a new time that overlaps another appointment", () => {
    const { service } = setup();
    service.book(visit("tech-1", "09:00", "10:00"));
    const later = service.book(visit("tech-1", "13:00", "14:00"));
    expect(() =>
      service.reschedule(later.id, "2026-10-05T09:30:00.000Z", "2026-10-05T10:30:00.000Z"),
    ).toThrow(BookingConflictError);
  });

  it("rejects rescheduling a cancelled appointment", () => {
    const { service } = setup();
    const appointment = service.book(visit("tech-1", "09:00", "10:00"));
    service.cancel(appointment.id);
    expect(() =>
      service.reschedule(appointment.id, "2026-10-05T13:00:00.000Z", "2026-10-05T14:00:00.000Z"),
    ).toThrow(InvalidTransitionError);
  });

  it("rejects an unknown appointment", () => {
    const { service } = setup();
    expect(() =>
      service.reschedule("missing", "2026-10-05T13:00:00.000Z", "2026-10-05T14:00:00.000Z"),
    ).toThrow(AppointmentNotFoundError);
  });
});
