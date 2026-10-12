import { availabilityLabels } from "@/content/labels";
import type { AvailabilityStatus } from "@/lib/api/types";
import { cn } from "@/lib/cn";

interface AvailabilityLabelProps {
  status: AvailabilityStatus;
  /** Adds the explanatory sentence under the label. */
  showHint?: boolean;
  className?: string;
}

const chip: Record<AvailabilityStatus, string> = {
  open_to_request: "bg-mist/95 text-charcoal",
  unavailable: "bg-charcoal/80 text-cream",
  unknown: "bg-paper/95 text-charcoal",
};

const dot: Record<AvailabilityStatus, string> = {
  open_to_request: "bg-slate-blue",
  unavailable: "bg-sand",
  unknown: "border border-slate-blue bg-transparent",
};

/**
 * Availability as stated by the data source. The wording never promises that
 * dates are guaranteed: the team confirms every request.
 */
export function AvailabilityLabel({ status, showHint = false, className }: AvailabilityLabelProps) {
  const { label, hint } = availabilityLabels[status];
  return (
    <div className={className}>
      <span
        className={cn(
          "inline-flex min-h-7 items-center gap-2 rounded-full px-3 py-1 text-[0.8125rem] leading-none font-medium",
          chip[status],
        )}
      >
        <span aria-hidden className={cn("size-2 shrink-0 rounded-full", dot[status])} />
        {label}
      </span>
      {showHint ? <p className="mt-2 text-[0.875rem] leading-snug text-ink-muted">{hint}</p> : null}
    </div>
  );
}
