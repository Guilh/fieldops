# billing service

Creates invoices for completed visits. Owned by the billing team.

- Amounts are integer cents. Never use floating-point numbers for money.
- Invoice only appointments whose status is `completed`.
