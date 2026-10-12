import type { Appointment } from "@fieldops/shared";
import { describe, expect, it } from "vitest";
import { createInvoice } from "../src/createInvoice.ts";

const visit: Appointment = {
  id: "appt-1",
  technicianId: "tech-1",
  customerId: "cust-1",
  startsAt: "2026-10-05T09:00:00.000Z",
  endsAt: "2026-10-05T10:30:00.000Z",
  status: "completed",
  customerTimeZone: "America/Chicago",
};

describe("createInvoice", () => {
  it("charges the hourly rate for the visit length, in cents", () => {
    expect(createInvoice(visit, 9_000).amountCents).toBe(13_500);
  });

  it("refuses a visit that is not completed", () => {
    expect(() => createInvoice({ ...visit, status: "scheduled" }, 9_000)).toThrow();
  });
});
