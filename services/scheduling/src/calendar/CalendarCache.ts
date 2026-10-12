import type { Appointment } from "@fieldops/shared";
import type { Clock } from "../clock.ts";
import type { AppointmentRepository } from "../db/AppointmentRepository.ts";

// Caches each technician's appointments, because the booking page asks for the
// same calendar many times while a dispatcher picks a slot. Call invalidate()
// after any change to a technician's appointments.
export class CalendarCache {
  private readonly entries = new Map<string, { loadedAt: number; appointments: Appointment[] }>();

  constructor(
    private readonly repo: AppointmentRepository,
    private readonly clock: Clock,
    private readonly ttlSeconds: number,
  ) {}

  appointmentsFor(technicianId: string): Appointment[] {
    const now = this.clock.now().getTime();
    const entry = this.entries.get(technicianId);
    if (entry && now - entry.loadedAt < this.ttlSeconds * 1000) {
      return entry.appointments;
    }
    const appointments = this.repo.listForTechnician(technicianId);
    this.entries.set(technicianId, { loadedAt: now, appointments });
    return appointments;
  }

  invalidate(technicianId: string): void {
    this.entries.delete(technicianId);
  }
}
