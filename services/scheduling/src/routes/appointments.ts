import type { Appointment } from "@fieldops/shared";
import type { BookingRequest, BookingService } from "../booking/BookingService.ts";
import { formatForCustomer } from "../format/time.ts";

// HTTP handlers. They validate the shape of the request and call
// BookingService. They never write to storage themselves.

export interface AppointmentResponse extends Appointment {
  startsAtLocal: string;
}

function toResponse(appointment: Appointment): AppointmentResponse {
  return {
    ...appointment,
    startsAtLocal: formatForCustomer(appointment.startsAt, appointment.customerTimeZone),
  };
}

export function createAppointmentRoutes(bookings: BookingService) {
  return {
    "POST /appointments": (body: BookingRequest) => toResponse(bookings.book(body)),
    "POST /appointments/:id/reschedule": (id: string, body: { startsAt: string; endsAt: string }) =>
      toResponse(bookings.reschedule(id, body.startsAt, body.endsAt)),
    "POST /appointments/:id/cancel": (id: string) => toResponse(bookings.cancel(id)),
  };
}
