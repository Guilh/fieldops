import { randomUUID } from "node:crypto";
import type { Appointment, Invoice } from "@fieldops/shared";

/** Creates the invoice for a completed visit. */
export function createInvoice(appointment: Appointment, rateCentsPerHour: number): Invoice {
  if (appointment.status !== "completed") {
    throw new Error(`Appointment ${appointment.id} is ${appointment.status}, not completed`);
  }
  const minutes = (Date.parse(appointment.endsAt) - Date.parse(appointment.startsAt)) / 60000;
  return {
    id: randomUUID(),
    appointmentId: appointment.id,
    amountCents: Math.round((rateCentsPerHour * minutes) / 60),
  };
}
