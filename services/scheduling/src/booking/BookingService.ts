import { randomUUID } from "node:crypto";
import { logger, type Appointment } from "@fieldops/shared";
import type { CalendarCache } from "../calendar/CalendarCache.ts";
import type { Clock } from "../clock.ts";
import type { SchedulingConfig } from "../config.ts";
import type { AppointmentRepository } from "../db/AppointmentRepository.ts";
import type { StatusEventLog } from "../db/StatusEventLog.ts";
import {
  AppointmentNotFoundError,
  BookingConflictError,
  InvalidBookingError,
  InvalidTransitionError,
} from "../errors.ts";
import { transition } from "../status/transitions.ts";
import { overlaps } from "./overlap.ts";

export interface BookingRequest {
  technicianId: string;
  customerId: string;
  /** UTC, ISO 8601. */
  startsAt: string;
  /** UTC, ISO 8601. */
  endsAt: string;
  customerTimeZone: string;
}

export interface BookingDeps {
  repo: AppointmentRepository;
  calendar: CalendarCache;
  events: StatusEventLog;
  clock: Clock;
  config: SchedulingConfig;
}

const DAY_MS = 24 * 60 * 60 * 1000;

// Every change to a booking goes through this class.
export class BookingService {
  constructor(private readonly deps: BookingDeps) {}

  book(request: BookingRequest): Appointment {
    this.checkTimes(request.startsAt, request.endsAt);

    const clash = this.deps.calendar
      .appointmentsFor(request.technicianId)
      .find((existing) => existing.status !== "cancelled" && overlaps(existing, request));
    if (clash) {
      throw new BookingConflictError(request.technicianId, request.startsAt, clash.id);
    }

    const appointment: Appointment = {
      id: randomUUID(),
      technicianId: request.technicianId,
      customerId: request.customerId,
      startsAt: request.startsAt,
      endsAt: request.endsAt,
      status: "scheduled",
      customerTimeZone: request.customerTimeZone,
    };
    this.deps.repo.insert(appointment);
    this.deps.calendar.invalidate(appointment.technicianId);
    logger.info("appointment booked", { appointmentId: appointment.id });
    return appointment;
  }

  // Moves a scheduled appointment to a new time with the same technician.
  reschedule(appointmentId: string, startsAt: string, endsAt: string): Appointment {
    const appointment = this.getOrThrow(appointmentId);
    if (appointment.status !== "scheduled") {
      throw new InvalidTransitionError(appointment.status, "scheduled");
    }
    this.checkTimes(startsAt, endsAt);

    const newStart = Date.parse(startsAt);
    const newEnd = Date.parse(endsAt);
    for (const other of this.deps.repo.listForTechnician(appointment.technicianId)) {
      if (other.id === appointment.id || other.status !== "scheduled") continue;
      if (newStart < Date.parse(other.endsAt) && Date.parse(other.startsAt) < newEnd) {
        throw new BookingConflictError(appointment.technicianId, startsAt, other.id);
      }
    }

    const moved: Appointment = { ...appointment, startsAt, endsAt };
    this.deps.repo.update(moved);
    this.deps.calendar.invalidate(moved.technicianId);
    logger.info("appointment rescheduled", { appointmentId: moved.id });
    return moved;
  }

  cancel(appointmentId: string): Appointment {
    const appointment = this.getOrThrow(appointmentId);
    const cancelled = transition(appointment, "cancelled", this.deps);
    this.deps.repo.update(cancelled);
    logger.info("appointment cancelled", { appointmentId: cancelled.id });
    return cancelled;
  }

  private getOrThrow(appointmentId: string): Appointment {
    const appointment = this.deps.repo.get(appointmentId);
    if (!appointment) throw new AppointmentNotFoundError(appointmentId);
    return appointment;
  }

  private checkTimes(startsAt: string, endsAt: string): void {
    const start = Date.parse(startsAt);
    const end = Date.parse(endsAt);
    if (Number.isNaN(start) || Number.isNaN(end)) {
      throw new InvalidBookingError("startsAt and endsAt must be ISO 8601 timestamps");
    }
    if (end <= start) {
      throw new InvalidBookingError("endsAt must be after startsAt");
    }
    const now = this.deps.clock.now().getTime();
    if (start < now) {
      throw new InvalidBookingError("cannot book a time in the past");
    }
    if (start > now + this.deps.config.maxBookingDaysAhead * DAY_MS) {
      throw new InvalidBookingError(
        `cannot book more than ${this.deps.config.maxBookingDaysAhead} days ahead`,
      );
    }
  }
}
