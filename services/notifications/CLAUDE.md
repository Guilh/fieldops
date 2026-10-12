# notifications worker

Sends SMS and email reminders to customers.

- Key every send by its notification ID, and check the sent log before
  sending. A message must never reach a customer twice.
- Customer-facing wording lives in `templates/`. Never write message text
  in code.
