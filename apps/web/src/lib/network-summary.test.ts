import type { Dealer, Kpi } from "@red-pulse/contracts";
import { describe, expect, it } from "vitest";
import { summarizeNetwork } from "./network-summary";

const kpi = (id: Kpi["id"], status: Kpi["status"]): Kpi => ({
  id,
  label: { leads: "Leads", firstResponse: "Primera respuesta", testDrives: "Test drives", conversion: "Conversión" }[id],
  value: 1,
  unit: "count",
  trend: 0,
  status,
});

const dealer = (id: string, status: Dealer["status"]): Dealer => ({
  rank: 1,
  id,
  name: id,
  city: "CABA",
  region: "AMBA",
  leads: 1,
  firstResponseMinutes: 1,
  testDrives: 1,
  sales: 1,
  conversion: 1,
  status,
});

const allOk = [kpi("leads", "ok"), kpi("firstResponse", "ok"), kpi("testDrives", "ok"), kpi("conversion", "ok")];

describe("summarizeNetwork", () => {
  it("reports critical dealers and the KPIs that are not in range", () => {
    const summary = summarizeNetwork(
      [kpi("leads", "ok"), kpi("firstResponse", "warning"), kpi("testDrives", "ok"), kpi("conversion", "ok")],
      [dealer("a", "critical"), dealer("b", "critical"), dealer("c", "ok")],
    );

    expect(summary.text).toBe("2 concesionarios en estado crítico · primera respuesta en atención");
    expect(summary.status).toBe("critical");
  });

  it("uses the singular for one critical dealer", () => {
    const summary = summarizeNetwork(allOk, [dealer("a", "critical"), dealer("b", "ok")]);

    expect(summary.text).toBe("1 concesionario en estado crítico");
  });

  it("flags a critical KPI as critical", () => {
    const summary = summarizeNetwork([kpi("conversion", "critical"), ...allOk.slice(0, 3)], [dealer("a", "ok")]);

    expect(summary.text).toBe("conversión en estado crítico");
    expect(summary.status).toBe("critical");
  });

  it("mentions dealers in warning when nothing is critical", () => {
    const summary = summarizeNetwork(allOk, [dealer("a", "warning"), dealer("b", "warning"), dealer("c", "ok")]);

    expect(summary.text).toBe("2 concesionarios en atención");
    expect(summary.status).toBe("warning");
  });

  it("says everything is in range when every status is ok", () => {
    const summary = summarizeNetwork(allOk, [dealer("a", "ok")]);

    expect(summary.text).toBe("Toda la red opera en rango");
    expect(summary.status).toBe("ok");
  });
});
