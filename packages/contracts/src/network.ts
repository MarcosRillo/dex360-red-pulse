import { z } from "zod";

export const StatusSchema = z.enum(["ok", "warning", "critical"]);
export type Status = z.infer<typeof StatusSchema>;

export const KpiSchema = z.object({
  id: z.enum(["leads", "firstResponse", "testDrives", "conversion"]),
  label: z.string(),
  value: z.number(),
  unit: z.enum(["count", "minutes", "percent"]),
  /** Percent change against the previous period, one decimal. */
  trend: z.number(),
  status: StatusSchema,
});
export type Kpi = z.infer<typeof KpiSchema>;

export const KpisResponseSchema = z.object({
  period: z.string(),
  kpis: z.array(KpiSchema),
});
export type KpisResponse = z.infer<typeof KpisResponseSchema>;

export const DealerSchema = z.object({
  rank: z.number().int().positive(),
  id: z.string(),
  name: z.string(),
  city: z.string(),
  region: z.string(),
  leads: z.number().int().nonnegative(),
  firstResponseMinutes: z.number().int().nonnegative(),
  testDrives: z.number().int().nonnegative(),
  sales: z.number().int().nonnegative(),
  /** Lead-to-sale conversion in percent, one decimal. */
  conversion: z.number(),
  status: StatusSchema,
});
export type Dealer = z.infer<typeof DealerSchema>;

export const DealersResponseSchema = z.object({
  period: z.string(),
  dealers: z.array(DealerSchema),
});
export type DealersResponse = z.infer<typeof DealersResponseSchema>;
