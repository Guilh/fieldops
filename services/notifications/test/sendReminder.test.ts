import type { Appointment } from "@fieldops/shared";
import { describe, expect, it } from "vitest";
import { sendReminder, type SentLog } from "../src/sendReminder.ts";

const appointment: Appointment = {
  id: "appt-1",
  technicianId: "tech-1",
  customerId: "cust-1",
  startsAt: "2026-10-05T14:00:00.000Z",
  endsAt: "2026-10-05T15:00:00.000Z",
  status: "scheduled",
  customerTimeZone: "America/Chicago",
};

function memoryLog(): SentLog & { ids: Set<string> } {
  const ids = new Set<string>();
  return { ids, has: (id) => ids.has(id), add: (id) => void ids.add(id) };
}

describe("sendReminder", () => {
  it("sends the reminder once per appointment", () => {
    const sent: string[] = [];
    const deps = {
      sentLog: memoryLog(),
      transport: { sendSms: (_: string, text: string) => void sent.push(text) },
      now: () => new Date("2026-10-04T14:00:00Z"),
    };
    expect(sendReminder(appointment, "Mon, Oct 5, 9:00 AM", deps)).toBe(true);
    expect(sendReminder(appointment, "Mon, Oct 5, 9:00 AM", deps)).toBe(false);
    expect(sent).toEqual([
      "Reminder: your fieldops technician visit is on Mon, Oct 5, 9:00 AM. Reply C to cancel.",
    ]);
  });
});
