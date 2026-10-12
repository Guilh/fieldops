import { describe, expect, it } from "vitest";
import { formatForCustomer } from "../src/format/time.ts";

describe("formatForCustomer", () => {
  it("shows a UTC time in the customer's time zone", () => {
    expect(formatForCustomer("2026-10-05T14:00:00.000Z", "America/Chicago")).toBe("Mon, Oct 5, 9:00 AM");
  });
});
