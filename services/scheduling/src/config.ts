// Scheduling settings. Each value comes from an environment variable, with a
// default for local runs and tests.

export interface SchedulingConfig {
  /** How long a technician's calendar stays cached, in seconds. */
  calendarCacheSeconds: number;
  /** How far ahead a customer can book, in days. */
  maxBookingDaysAhead: number;
}

function intFromEnv(env: NodeJS.ProcessEnv, name: string, fallback: number): number {
  const raw = env[name];
  if (raw === undefined || raw === "") return fallback;
  const value = Number.parseInt(raw, 10);
  if (Number.isNaN(value) || value < 0) {
    throw new Error(`${name} must be a whole number of 0 or more, got "${raw}"`);
  }
  return value;
}

export function loadConfig(env: NodeJS.ProcessEnv = process.env): SchedulingConfig {
  return {
    calendarCacheSeconds: intFromEnv(env, "CALENDAR_CACHE_SECONDS", 300),
    maxBookingDaysAhead: intFromEnv(env, "MAX_BOOKING_DAYS_AHEAD", 60),
  };
}
