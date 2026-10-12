import { BookingService, type BookingRequest } from "../../src/booking/BookingService.ts";
import { CalendarCache } from "../../src/calendar/CalendarCache.ts";
import { loadConfig } from "../../src/config.ts";
import { InMemoryAppointmentRepository } from "../../src/db/AppointmentRepository.ts";
import { InMemoryStatusEventLog } from "../../src/db/StatusEventLog.ts";
import { frozenClock } from "./frozenTime.ts";

/** A BookingService on in-memory storage, with the clock frozen at 08:00 UTC on 1 October 2026. */
export function setup(env: NodeJS.ProcessEnv = {}) {
  const clock = frozenClock("2026-10-01T08:00:00Z");
  const config = loadConfig(env);
  const repo = new InMemoryAppointmentRepository();
  const events = new InMemoryStatusEventLog();
  const calendar = new CalendarCache(repo, clock, config.calendarCacheSeconds);
  const service = new BookingService({ repo, calendar, events, clock, config });
  return { service, repo, events, clock, config };
}

/** A booking request for 5 October 2026. Times are UTC hours and minutes, such as "09:00". */
export function visit(technicianId: string, from: string, to: string): BookingRequest {
  return {
    technicianId,
    customerId: "cust-1",
    startsAt: `2026-10-05T${from}:00.000Z`,
    endsAt: `2026-10-05T${to}:00.000Z`,
    customerTimeZone: "America/Chicago",
  };
}
