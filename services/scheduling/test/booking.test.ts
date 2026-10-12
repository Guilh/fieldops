import { describe, expect, it } from "vitest";
import { BookingConflictError, InvalidBookingError } from "../src/errors.ts";
import { setup, visit } from "./helpers/setup.ts";

describe("BookingService.book", () => {
  it("books a free slot as scheduled", () => {
    const { service, repo } = setup();
    const appointment = service.book(visit("tech-1", "09:00", "10:00"));
    expect(appointment.status).toBe("scheduled");
    expect(repo.get(appointment.id)).toEqual(appointment);
  });

  it("rejects a booking that overlaps the technician's appointment", () => {
    const { service } = setup();
    service.book(visit("tech-1", "09:00", "10:00"));
    expect(() => service.book(visit("tech-1", "09:30", "10:30"))).toThrow(BookingConflictError);
  });

  it("allows the same time for a different technician", () => {
    const { service } = setup();
    service.book(visit("tech-1", "09:00", "10:00"));
    expect(service.book(visit("tech-2", "09:00", "10:00")).technicianId).toBe("tech-2");
  });

  it("ignores cancelled appointments", () => {
    const { service } = setup();
    const first = service.book(visit("tech-1", "09:00", "10:00"));
    service.cancel(first.id);
    expect(service.book(visit("tech-1", "09:00", "10:00")).status).toBe("scheduled");
  });

  it("rejects a booking that ends before it starts", () => {
    const { service } = setup();
    expect(() => service.book(visit("tech-1", "10:00", "09:00"))).toThrow(InvalidBookingError);
  });

  it("rejects a booking in the past", () => {
    const { service } = setup();
    const request = { ...visit("tech-1", "09:00", "10:00"), startsAt: "2026-09-30T09:00:00.000Z" };
    expect(() => service.book(request)).toThrow(InvalidBookingError);
  });

  it("rejects a booking beyond the booking window", () => {
    const { service } = setup({ MAX_BOOKING_DAYS_AHEAD: "2" });
    expect(() => service.book(visit("tech-1", "09:00", "10:00"))).toThrow(InvalidBookingError);
  });
});
