import type { Dealer, DealersResponse, Kpi, KpisResponse } from "@red-pulse/contracts";
import type { DealerRepository, PeriodStats } from "./dealer.repository.js";
import {
  conversionRate,
  percentChange,
  statusForConversion,
  statusForFirstResponse,
  statusForTrend,
  weightedFirstResponse,
} from "./network.metrics.js";

const PERIOD = "Últimos 30 días";

function totals(rows: PeriodStats[]) {
  const sum = (key: keyof PeriodStats) => rows.reduce((total, row) => total + row[key], 0);
  const leads = sum("leads");
  return {
    leads,
    firstResponse: weightedFirstResponse(rows),
    testDrives: sum("testDrives"),
    conversion: conversionRate(sum("sales"), leads),
  };
}

export class NetworkService {
  constructor(private readonly dealers: DealerRepository) {}

  async getKpis(): Promise<KpisResponse> {
    const records = await this.dealers.list();
    const now = totals(records.map((record) => record.current));
    const before = totals(records.map((record) => record.previous));

    const kpis: Kpi[] = [
      { id: "leads", label: "Leads", value: now.leads, unit: "count", trend: percentChange(now.leads, before.leads), status: statusForTrend(percentChange(now.leads, before.leads)) },
      { id: "firstResponse", label: "Primera respuesta", value: now.firstResponse, unit: "minutes", trend: percentChange(now.firstResponse, before.firstResponse), status: statusForFirstResponse(now.firstResponse) },
      { id: "testDrives", label: "Test drives", value: now.testDrives, unit: "count", trend: percentChange(now.testDrives, before.testDrives), status: statusForTrend(percentChange(now.testDrives, before.testDrives)) },
      { id: "conversion", label: "Conversión", value: now.conversion, unit: "percent", trend: percentChange(now.conversion, before.conversion), status: statusForConversion(now.conversion) },
    ];

    return { period: PERIOD, kpis };
  }

  async getDealers(): Promise<DealersResponse> {
    const records = await this.dealers.list();

    const dealers: Dealer[] = records
      .map(({ id, name, city, region, current }) => ({
        id,
        name,
        city,
        region,
        ...current,
        conversion: conversionRate(current.sales, current.leads),
        status: statusForFirstResponse(current.firstResponseMinutes),
      }))
      .sort((a, b) => b.conversion - a.conversion || b.leads - a.leads)
      .map((dealer, index) => ({ rank: index + 1, ...dealer }));

    return { period: PERIOD, dealers };
  }
}
