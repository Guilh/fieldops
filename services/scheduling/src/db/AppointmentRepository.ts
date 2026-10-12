import type { Appointment } from "@fieldops/shared";

// Storage for appointments. Production uses the Postgres implementation in
// the deploy repo; tests and local runs use the in-memory one below.
export interface AppointmentRepository {
  get(id: string): Appointment | undefined;
  insert(appointment: Appointment): void;
  update(appointment: Appointment): void;
  /** Every appointment for the technician, in any status. */
  listForTechnician(technicianId: string): Appointment[];
}

export class InMemoryAppointmentRepository implements AppointmentRepository {
  private readonly rows = new Map<string, Appointment>();

  get(id: string): Appointment | undefined {
    return this.rows.get(id);
  }

  insert(appointment: Appointment): void {
    this.rows.set(appointment.id, appointment);
  }

  update(appointment: Appointment): void {
    if (!this.rows.has(appointment.id)) {
      throw new Error(`No appointment ${appointment.id} to update`);
    }
    this.rows.set(appointment.id, appointment);
  }

  listForTechnician(technicianId: string): Appointment[] {
    return [...this.rows.values()]
      .filter((a) => a.technicianId === technicianId)
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  }
}
