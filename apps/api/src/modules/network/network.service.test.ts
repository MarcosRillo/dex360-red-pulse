import { describe, expect, it } from "vitest";
import type { DealerRecord } from "./dealer.repository.js";
import { InMemoryDealerRepository } from "./dealer.repository.js";
import { NetworkService } from "./network.service.js";

const dealer = (id: string, current: DealerRecord["current"], previous: DealerRecord["previous"]): DealerRecord => ({
  id,
  name: `Dealer ${id}`,
  city: "Ciudad",
  region: "Región",
  current,
  previous,
});

const service = new NetworkService(
  new InMemoryDealerRepository([
    dealer("a", { leads: 300, firstResponseMinutes: 40, testDrives: 90, sales: 36 }, { leads: 250, firstResponseMinutes: 50, testDrives: 80, sales: 30 }),
    dealer("b", { leads: 100, firstResponseMinutes: 240, testDrives: 20, sales: 4 }, { leads: 150, firstResponseMinutes: 200, testDrives: 30, sales: 9 }),
  ]),
);

describe("NetworkService.getKpis", () => {
  it("aggregates the network and compares it with the previous period", async () => {
    const { kpis } = await service.getKpis();

    expect(kpis).toEqual([
      { id: "leads", label: "Leads", value: 400, unit: "count", trend: 0, status: "ok" },
      // (300*40 + 100*240) / 400 = 90 now; (250*50 + 150*200) / 400 = 106.25 → 106 before.
      { id: "firstResponse", label: "Primera respuesta", value: 90, unit: "minutes", trend: -15.1, status: "warning" },
      { id: "testDrives", label: "Test drives", value: 110, unit: "count", trend: 0, status: "ok" },
      // 40 / 400 = 10% now; 39 / 400 = 9.75% → 9.8% before. Trends use the reported (rounded) values.
      { id: "conversion", label: "Conversión", value: 10, unit: "percent", trend: 2, status: "ok" },
    ]);
  });
});

describe("NetworkService.getDealers", () => {
  it("ranks dealers by conversion and flags them by first-response time", async () => {
    const { dealers } = await service.getDealers();

    expect(dealers.map(({ rank, id, conversion, status }) => ({ rank, id, conversion, status }))).toEqual([
      { rank: 1, id: "a", conversion: 12, status: "ok" },
      { rank: 2, id: "b", conversion: 4, status: "critical" },
    ]);
  });
});
