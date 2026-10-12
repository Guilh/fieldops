interface TimeRange {
  startsAt: string;
  endsAt: string;
}

/** True when the two ranges share any time. Touching ends do not overlap. */
export function overlaps(a: TimeRange, b: TimeRange): boolean {
  return Date.parse(a.startsAt) < Date.parse(b.endsAt) && Date.parse(b.startsAt) < Date.parse(a.endsAt);
}
