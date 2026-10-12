# scheduling service

Owns appointments, technician calendars and booking rules.

- Store every timestamp in UTC. Convert to the customer's time zone only
  in `src/format/time.ts`.
- Booking changes go through `BookingService`. Route handlers never write
  to the database directly.
- Change an appointment's status only with `transition()`. It enforces
  which status changes are allowed.
- Tests that depend on the clock use the frozen-time helper in
  `test/helpers`. Never read the system clock in a test.
