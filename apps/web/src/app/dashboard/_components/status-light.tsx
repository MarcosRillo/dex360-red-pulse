import type { Status } from "@red-pulse/contracts";

export const STATUS_LABEL: Record<Status, string> = {
  ok: "En rango",
  warning: "Atención",
  critical: "Crítico",
};

export const STATUS_TEXT_CLASS: Record<Status, string> = {
  ok: "text-ok",
  warning: "text-warning",
  critical: "text-critical",
};

export function StatusDot({ status }: { status: Status }) {
  return <span aria-hidden="true" className={`status-light size-2.5 shrink-0 rounded-full ${STATUS_TEXT_CLASS[status]}`} />;
}

/** A dashboard warning light plus its label, so the status never depends on color alone. */
export function StatusLight({ status, label = STATUS_LABEL[status] }: { status: Status; label?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 whitespace-nowrap ${STATUS_TEXT_CLASS[status]}`} data-status={status}>
      <StatusDot status={status} />
      <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
    </span>
  );
}
