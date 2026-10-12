/** The technician already has an appointment that clashes with the requested time. */
export class BookingConflictError extends Error {
  constructor(
    readonly technicianId: string,
    readonly startsAt: string,
    readonly clashingAppointmentId: string,
  ) {
    super(`Technician ${technicianId} is not free at ${startsAt}`);
    this.name = "BookingConflictError";
  }
}

/** The request is not a valid booking, for example it ends before it starts. */
export class InvalidBookingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InvalidBookingError";
  }
}

export class AppointmentNotFoundError extends Error {
  constructor(readonly appointmentId: string) {
    super(`Appointment ${appointmentId} not found`);
    this.name = "AppointmentNotFoundError";
  }
}

export class InvalidTransitionError extends Error {
  constructor(
    readonly from: string,
    readonly to: string,
  ) {
    super(`Cannot change status from ${from} to ${to}`);
    this.name = "InvalidTransitionError";
  }
}
