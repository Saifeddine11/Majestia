import { CalendarSearch, CircleAlert, Info, RefreshCw, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";

const gridClass = "grid gap-4 sm:grid-cols-2 md:gap-5 xl:grid-cols-3";

/** Loading: card-shaped placeholders that hold the layout in place. */
export function ResultsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <ul className={gridClass} aria-hidden>
      {Array.from({ length: count }, (_, index) => (
        <li key={index} className="glass glass-card rounded-[1.75rem] p-2">
          <div className="skeleton aspect-[4/3] rounded-[1.375rem]" />
          <div className="px-3 pt-4 pb-3">
            <div className="skeleton h-3.5 w-28 rounded-full" />
            <div className="skeleton mt-3 h-6 w-44 rounded-full" />
            <div className="skeleton mt-4 h-4 w-52 rounded-full" />
            <div className="mt-7 flex items-end justify-between">
              <div className="skeleton h-9 w-28 rounded-full" />
              <div className="skeleton h-11 w-24 rounded-full" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

function StatePanel({
  icon: Icon,
  title,
  children,
  actions,
  role,
}: {
  icon: LucideIcon;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  role?: "alert" | "status";
}) {
  return (
    <div
      role={role}
      className="glass glass-card mx-auto flex max-w-2xl flex-col items-start rounded-panel p-7 md:p-10"
    >
      <span className="grid size-12 place-items-center rounded-full bg-slate-blue text-cream">
        <Icon className="size-5" aria-hidden />
      </span>
      <h2 className="text-subheading mt-6">{title}</h2>
      <div className="text-lead mt-3 text-ink-muted">{children}</div>
      {actions ? <div className="mt-7 flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}

/** Empty: the search worked and matched nothing. */
export function EmptyState({
  hasFilters,
  onClearFilters,
  onClearAll,
}: {
  hasFilters: boolean;
  onClearFilters: () => void;
  onClearAll: () => void;
}) {
  return (
    <StatePanel
      icon={CalendarSearch}
      title="Aucun séjour ne correspond à votre recherche."
      role="status"
      actions={
        <>
          {hasFilters ? <Button onClick={onClearFilters}>Retirer les filtres</Button> : null}
          <Button variant={hasFilters ? "outline" : "primary"} onClick={onClearAll}>
            Voir tous les séjours
          </Button>
        </>
      }
    >
      <p>Essayez une autre destination, un nombre de voyageurs différent ou moins de filtres.</p>
    </StatePanel>
  );
}

/** Error: the search itself failed. Nothing is shown as if it were a result. */
export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <StatePanel
      icon={CircleAlert}
      title="Les séjours n'ont pas pu être chargés."
      role="alert"
      actions={
        <Button onClick={onRetry}>
          <RefreshCw className="size-4" aria-hidden />
          Réessayer
        </Button>
      }
    >
      <p>Un problème est survenu pendant la recherche. Vérifiez votre connexion, puis réessayez.</p>
    </StatePanel>
  );
}

/** A quiet informational line above the results. */
export function InfoNote({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p
      className={cn(
        "glass glass-pill flex items-start gap-3 rounded-[1.25rem] px-4 py-3 text-[0.9375rem]",
        className,
      )}
    >
      <Info className="mt-0.5 size-5 shrink-0 text-slate-deep" aria-hidden />
      <span>{children}</span>
    </p>
  );
}
