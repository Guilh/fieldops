import { logger, type Appointment } from "@fieldops/shared";
import { render } from "./templates.ts";

export interface SentLog {
  has(notificationId: string): boolean;
  add(notificationId: string, channel: string, sentAt: string): void;
}

export interface Transport {
  sendSms(customerId: string, text: string): void;
}

/** Sends the 24-hour reminder for an appointment once, and only once. */
export function sendReminder(
  appointment: Appointment,
  startsAtLocal: string,
  deps: { sentLog: SentLog; transport: Transport; now: () => Date },
): boolean {
  const notificationId = `${appointment.id}:reminder-24h`;
  if (deps.sentLog.has(notificationId)) {
    logger.info("reminder already sent", { notificationId });
    return false;
  }
  const text = render("reminder-24h", { startsAtLocal });
  deps.transport.sendSms(appointment.customerId, text);
  deps.sentLog.add(notificationId, "sms", deps.now().toISOString());
  return true;
}
