import type { Clock } from "../../src/clock.ts";

// The frozen-time helper. Every test that depends on the clock uses this,
// never the system clock.
export interface FrozenClock extends Clock {
  advanceMinutes(minutes: number): void;
}

export function frozenClock(utcIso: string): FrozenClock {
  let current = Date.parse(utcIso);
  return {
    now: () => new Date(current),
    advanceMinutes: (minutes) => {
      current += minutes * 60 * 1000;
    },
  };
}
