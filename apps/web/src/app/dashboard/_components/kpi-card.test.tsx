import type { Kpi } from "@red-pulse/contracts";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { KpiCard } from "./kpi-card";

const base: Kpi = { id: "leads", label: "Leads", value: 2705, unit: "count", trend: 3, status: "ok" };

describe("KpiCard", () => {
  it("renders the label, the formatted value and the trend", () => {
    render(<KpiCard kpi={base} />);

    expect(screen.getByText("Leads")).toBeInTheDocument();
    expect(screen.getByText("2.705")).toBeInTheDocument();
    expect(screen.getByText(/▲ 3,0 % vs\. período anterior/)).toBeInTheDocument();
  });

  it.each([
    ["ok", "En rango"],
    ["warning", "Atención"],
    ["critical", "Crítico"],
  ] as const)("shows the %s status as text, not only as color", (status, label) => {
    render(<KpiCard kpi={{ ...base, status }} />);

    expect(screen.getByText(label)).toBeInTheDocument();
    expect(screen.getByRole("article")).toHaveAttribute("data-status", status);
  });

  it("formats first response in hours and minutes", () => {
    render(
      <KpiCard
        kpi={{ id: "firstResponse", label: "Primera respuesta", value: 87, unit: "minutes", trend: 7.4, status: "warning" }}
      />,
    );

    expect(screen.getByText("1 h 27 min")).toBeInTheDocument();
  });

  it("marks a rising first-response time as unfavorable", () => {
    render(
      <KpiCard
        kpi={{ id: "firstResponse", label: "Primera respuesta", value: 87, unit: "minutes", trend: 7.4, status: "warning" }}
      />,
    );

    expect(screen.getByTestId("kpi-trend")).toHaveAttribute("data-tone", "bad");
    expect(screen.getByText("desfavorable")).toBeInTheDocument();
  });

  it("marks a falling first-response time as favorable", () => {
    render(
      <KpiCard
        kpi={{ id: "firstResponse", label: "Primera respuesta", value: 40, unit: "minutes", trend: -5, status: "ok" }}
      />,
    );

    expect(screen.getByTestId("kpi-trend")).toHaveAttribute("data-tone", "good");
    expect(screen.getByText("favorable")).toBeInTheDocument();
  });

  it("marks rising leads as favorable", () => {
    render(<KpiCard kpi={base} />);

    expect(screen.getByTestId("kpi-trend")).toHaveAttribute("data-tone", "good");
  });

  it("marks falling conversion as unfavorable", () => {
    render(<KpiCard kpi={{ id: "conversion", label: "Conversión", value: 10, unit: "percent", trend: -1, status: "ok" }} />);

    expect(screen.getByTestId("kpi-trend")).toHaveAttribute("data-tone", "bad");
    expect(screen.getByText(/▼ 1,0 %/)).toBeInTheDocument();
  });
});
