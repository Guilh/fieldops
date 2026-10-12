# fieldops

Books technicians for customer visits, reminds customers, and invoices
completed visits.

| Folder                    | What it does                                            | Owned by           |
| :------------------------ | :------------------------------------------------------ | :----------------- |
| `services/scheduling/`    | Books appointments and manages technician calendars     | Scheduling team    |
| `services/notifications/` | Sends SMS and email reminders to customers              | Notifications team |
| `services/billing/`       | Creates invoices for completed visits                   | Billing team       |
| `packages/shared/`        | Holds the types and API clients that every service uses | All teams          |

## Setup

Node.js 22.5 or later, and pnpm (the version is pinned in `package.json`).

```bash
pnpm install
cd services/scheduling
pnpm typecheck
pnpm test
```
# fieldops
