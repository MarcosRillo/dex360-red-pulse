// Business thresholds in one place, so product can tune them without touching the math.
export const THRESHOLDS = {
  /** Minutes until a dealer first answers a lead. */
  firstResponse: { okUpTo: 60, warningUpTo: 180 },
  /** Lead-to-sale conversion, percent. */
  conversion: { okFrom: 10, warningFrom: 6 },
  /** Change against the previous period, percent. */
  trend: { okFrom: 0, warningFrom: -10 },
} as const;
