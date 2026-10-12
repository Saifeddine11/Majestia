import { Check } from "lucide-react";
import { requestStatusLabels } from "@/content/labels";
import type { RequestStatus as Status } from "@/lib/api/types";
import { cn } from "@/lib/cn";

const STEPS: Status[] = ["received", "in_review", "answered"];

interface RequestStatusProps {
  status: Status;
  isDemo: boolean;
  className?: string;
}

/**
 * Status of a request, exactly as reported by the data source.
 *
 * The interface never advances a status on its own. Steps that have not been
 * reported are shown as upcoming, without dates or delays: no response time
 * has been configured, so none is promised.
 */
export function RequestStatus({ status, isDemo, className }: RequestStatusProps) {
  const current = requestStatusLabels[status];
  const reached = STEPS.indexOf(status);
  const closed = status === "closed";

  return (
    <section
      aria-labelledby="request-status-title"
      className={cn("on-dark glass glass-dark rounded-panel p-6 md:p-7", className)}
    >
      <p id="request-status-title" className="eyebrow text-cream/90">
        Statut de la demande
      </p>
      <p className="text-subheading mt-3" role="status">
        {current.label}
      </p>
      <p className="mt-1.5 text-cream/90">{current.description}</p>

      {closed ? null : (
        <ol className="mt-6 space-y-3">
          {STEPS.map((step, index) => {
            const done = index < reached;
            const active = index === reached;
            return (
              <li
                key={step}
                className="flex items-center gap-3"
                aria-current={active ? "step" : undefined}
              >
                <span
                  aria-hidden
                  className={cn(
                    "grid size-7 shrink-0 place-items-center rounded-full text-[0.8125rem]",
                    done || active
                      ? "bg-cream text-charcoal"
                      : "border border-cream/45 text-cream/90",
                  )}
                >
                  {done ? <Check className="size-4" /> : index + 1}
                </span>
                <span className={cn(active ? "font-medium" : "text-cream/90")}>
                  {requestStatusLabels[step].label}
                  <span className="sr-only">
                    {done ? " (étape terminée)" : active ? " (étape en cours)" : " (étape à venir)"}
                  </span>
                </span>
              </li>
            );
          })}
        </ol>
      )}

      <p className="mt-6 border-t border-cream/20 pt-4 text-[0.875rem] leading-snug text-cream/90">
        {isDemo
          ? "Démonstration : ce statut n'évoluera pas, car aucune demande n'a été transmise."
          : "Le statut est mis à jour par notre équipe."}
      </p>
    </section>
  );
}
