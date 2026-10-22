import type { Dealer, Status } from "@red-pulse/contracts";
import { formatCount, formatMinutes, formatPercent } from "@/lib/format";
import { StatusLight, STATUS_TEXT_CLASS } from "./status-light";

/** Tint and left border make slow responders stand out when scanning the list. */
const ROW_CLASS: Record<Status, string> = {
  ok: "",
  warning: "",
  critical: "bg-critical/5",
};

const ROW_EDGE_CLASS: Record<Status, string> = {
  ok: "border-l-transparent",
  warning: "border-l-warning",
  critical: "border-l-critical",
};

const HEAD = "px-4 py-3 text-xs font-medium uppercase tracking-widest text-muted";
const NUM = "px-4 py-3 text-right font-mono tabular-nums whitespace-nowrap";

export function DealerTable({ dealers }: { dealers: Dealer[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[820px] border-collapse text-sm">
        <caption className="sr-only">Ranking de concesionarios por conversión</caption>
        <thead>
          <tr className="border-b border-line">
            <th scope="col" className={`${HEAD} w-14 text-left`}>
              #
            </th>
            <th scope="col" className={`${HEAD} text-left`}>
              Concesionario
            </th>
            <th scope="col" className={`${HEAD} text-left`}>
              Región
            </th>
            <th scope="col" className={`${HEAD} text-right`}>
              Leads
            </th>
            <th scope="col" className={`${HEAD} text-right`}>
              1ª respuesta
            </th>
            <th scope="col" className={`${HEAD} text-right`}>
              Test drives
            </th>
            <th scope="col" className={`${HEAD} text-right`}>
              Conversión
            </th>
            <th scope="col" className={`${HEAD} text-left`}>
              Estado
            </th>
          </tr>
        </thead>
        <tbody>
          {dealers.map((dealer) => (
            <tr
              key={dealer.id}
              data-testid="dealer-row"
              data-status={dealer.status}
              className={`border-b border-line last:border-b-0 ${ROW_CLASS[dealer.status]}`}
            >
              <td
                className={`border-l-[3px] px-4 py-3 font-mono tabular-nums text-muted ${ROW_EDGE_CLASS[dealer.status]}`}
              >
                {dealer.rank}
              </td>
              <th scope="row" className="px-4 py-3 text-left font-normal">
                <span className="block font-semibold">{dealer.name}</span>
                <span className="block text-xs text-muted">{dealer.city}</span>
              </th>
              <td className="px-4 py-3 text-muted">{dealer.region}</td>
              <td className={NUM}>{formatCount(dealer.leads)}</td>
              <td className={`${NUM} ${dealer.status === "ok" ? "" : STATUS_TEXT_CLASS[dealer.status]}`}>
                {formatMinutes(dealer.firstResponseMinutes)}
              </td>
              <td className={NUM}>{formatCount(dealer.testDrives)}</td>
              <td className={NUM}>{formatPercent(dealer.conversion)}</td>
              <td className="px-4 py-3">
                <StatusLight status={dealer.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
