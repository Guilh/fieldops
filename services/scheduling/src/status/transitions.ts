import type { Appointment, AppointmentStatus } from "@fieldops/shared";
import type { Clock } from "../clock.ts";
import type { StatusEventLog } from "../db/StatusEventLog.ts";
import { InvalidTransitionError } from "../errors.ts";

export const ALLOWED_TRANSITIONS: Record<AppointmentStatus, readonly AppointmentStatus[]> = {
  scheduled: ["in_progress", "cancelled"],
  in_progress: ["completed", "cancelled"],
  // FO-398: after offline sync, the technician app can send "completed" again
  // for a visit. Allowed so the repeated message does not raise an error.
  completed: ["completed"],
  cancelled: [],
};

/** Returns the appointment with its new status and records the change. */
export function transition(
  appointment: Appointment,
  to: AppointmentStatus,
  deps: { events: StatusEventLog; clock: Clock },
): Appointment {
  const from = appointment.status;
  if (!ALLOWED_TRANSITIONS[from].includes(to)) {
    throw new InvalidTransitionError(from, to);
  }
  deps.events.record({
    appointmentId: appointment.id,
    from,
    to,
    changedAt: deps.clock.now().toISOString(),
  });
  return { ...appointment, status: to };
}
