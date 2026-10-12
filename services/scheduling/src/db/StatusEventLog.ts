import type { AppointmentStatus } from "@fieldops/shared";

// One row per status change, written to visit_status_events.
export interface StatusEvent {
  appointmentId: string;
  from: AppointmentStatus;
  to: AppointmentStatus;
  changedAt: string;
}

export interface StatusEventLog {
  record(event: StatusEvent): void;
}

export class InMemoryStatusEventLog implements StatusEventLog {
  readonly events: StatusEvent[] = [];

  record(event: StatusEvent): void {
    this.events.push(event);
  }
}
