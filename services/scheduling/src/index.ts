import { BookingService } from "./booking/BookingService.ts";
import { CalendarCache } from "./calendar/CalendarCache.ts";
import { systemClock, type Clock } from "./clock.ts";
import { loadConfig, type SchedulingConfig } from "./config.ts";
import type { AppointmentRepository } from "./db/AppointmentRepository.ts";
import type { StatusEventLog } from "./db/StatusEventLog.ts";
import { createAppointmentRoutes } from "./routes/appointments.ts";

export function createSchedulingService(options: {
  repo: AppointmentRepository;
  events: StatusEventLog;
  clock?: Clock;
  config?: SchedulingConfig;
}) {
  const clock = options.clock ?? systemClock;
  const config = options.config ?? loadConfig();
  const calendar = new CalendarCache(options.repo, clock, config.calendarCacheSeconds);
  const bookings = new BookingService({ ...options, calendar, clock, config });
  return { bookings, routes: createAppointmentRoutes(bookings) };
}
