"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PropertyGrid } from "@/components/property/PropertyGrid";
import type { DestinationOption } from "@/components/search/DestinationField";
import { GlassSearchDock } from "@/components/search/GlassSearchDock";
import { amenityLabels, propertyTypeLabels } from "@/content/labels";
import { site } from "@/content/site";
import { api } from "@/lib/api";
import type { DateRange, SearchResult } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { formatRange } from "@/lib/search/dates";
import {
  buildHref,
  countActiveFilters,
  DEFAULT_FILTERS,
  DEFAULT_SEARCH,
  describeDates,
  describeGuests,
  parseFilters,
  parseSearch,
  toQuery,
  type SearchFilters,
  type SearchState,
} from "@/lib/search/params";
import { FilterSheet } from "./FilterSheet";
import { EmptyState, ErrorState, InfoNote, ResultsSkeleton } from "./ResultStates";

interface StaysExplorerProps {
  destinations: DestinationOption[];
}

type Outcome =
  { key: string; status: "success"; results: SearchResult[] } | { key: string; status: "error" };

const pillClass =
  "glass glass-pill inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-[0.9375rem] font-medium transition-colors hover:bg-white/55";

/**
 * Results page: search summary, editable search, filters, grid and every
 * result state. The URL is the source of truth, so a search can be shared,
 * reloaded and walked back through.
 */
export function StaysExplorer({ destinations }: StaysExplorerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const paramsKey = searchParams.toString();

  const search = useMemo(() => parseSearch(searchParams), [searchParams]);
  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);
  const demoFlag = searchParams.get("demo");

  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [editing, setEditing] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const requestKey = `${paramsKey}#${attempt}`;
  const loading = outcome?.key !== requestKey;

  useEffect(() => {
    let cancelled = false;
    api.search(toQuery(search, filters)).then(
      (results) => {
        if (!cancelled) setOutcome({ key: requestKey, status: "success", results });
      },
      () => {
        if (!cancelled) setOutcome({ key: requestKey, status: "error" });
      },
    );
    return () => {
      cancelled = true;
    };
  }, [requestKey, search, filters]);

  const navigate = (nextSearch: SearchState, nextFilters: SearchFilters) => {
    // The demo switch stays in the URL so a forced state survives a new search.
    const extra: Record<string, string> = demoFlag ? { demo: demoFlag } : {};
    router.push(buildHref("/stays", nextSearch, nextFilters, extra), { scroll: false });
  };

  const pickDates = (range: DateRange) => navigate({ ...search, ...range }, filters);

  const destinationName =
    destinations.find((destination) => destination.slug === search.destination)?.name ?? null;
  const destinationNames = Object.fromEntries(
    destinations.map((destination) => [destination.slug, destination.name]),
  );
  const dates = describeDates(search);
  const guests = describeGuests(search);
  const filterCount = countActiveFilters(filters);
  const results = !loading && outcome?.status === "success" ? outcome.results : null;
  const failed = !loading && outcome?.status === "error";

  const hasDates = Boolean(search.checkIn && search.checkOut);
  const unknownCount =
    results?.filter((item) => item.availability.status === "unknown").length ?? 0;
  const allUnavailable =
    hasDates &&
    results !== null &&
    results.length > 0 &&
    results.every((item) => item.availability.status === "unavailable");
  const firstAlternative = allUnavailable
    ? results?.flatMap((item) => item.availability.alternatives)[0]
    : undefined;

  let countLine: string;
  if (loading) countLine = "Recherche en cours…";
  else if (failed) countLine = "Recherche interrompue";
  else {
    const total = results?.length ?? 0;
    countLine = total === 0 ? "Aucun séjour" : `${total} séjour${total > 1 ? "s" : ""}`;
  }
  const summaryParts = [
    destinationName ?? "Toutes les destinations",
    dates ?? "Dates à préciser",
    guests,
  ];

  return (
    <div className="container-page pt-28 md:pt-36">
      <header>
        <p className="eyebrow text-charcoal/80">Séjours</p>
        <h1 className="text-heading mt-3">
          {destinationName ? `Séjours à ${destinationName}` : "Tous les séjours"}
        </h1>
        <p className="text-lead mt-3 text-ink-muted" role="status">
          <span className="font-medium text-charcoal">{countLine}</span>
          {dates ? ` · ${dates}` : ""} · {guests}
        </p>
        {api.isDemo ? (
          <p className="mt-2 text-[0.875rem] text-ink-muted">
            {site.demo.title} : propriétés, tarifs et disponibilités fictifs.
          </p>
        ) : null}
      </header>

      <div className="relative z-30 mt-7">
        <button
          type="button"
          aria-expanded={editing}
          aria-controls="stays-search"
          onClick={() => setEditing((current) => !current)}
          className="glass glass-card flex min-h-14 w-full items-center justify-between gap-3 rounded-full py-2 pr-3 pl-5 text-left md:hidden"
        >
          <span className="min-w-0">
            <span className="block truncate font-medium">{summaryParts[0]}</span>
            <span className="block truncate text-[0.875rem] text-ink-muted">
              {summaryParts[1]} · {summaryParts[2]}
            </span>
          </span>
          <span className="inline-flex shrink-0 items-center gap-1 text-[0.9375rem] font-medium text-slate-deep">
            Modifier
            <ChevronDown
              className={cn("size-4 transition-[rotate] duration-200", editing && "rotate-180")}
              aria-hidden
            />
          </span>
        </button>
        <div
          id="stays-search"
          className={cn("mt-2 md:mt-0 md:block", editing ? "block" : "hidden")}
        >
          <GlassSearchDock
            key={paramsKey}
            destinations={destinations}
            initial={search}
            placement="bottom"
            panelClassName="glass-cool-sheet"
            submitLabel="Mettre à jour"
            onSubmit={(next) => {
              setEditing(false);
              navigate(next, filters);
            }}
          />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          aria-haspopup="dialog"
          className={cn(pillClass, filterCount > 0 && "border-slate-blue bg-slate-blue/12")}
        >
          <SlidersHorizontal className="size-4" aria-hidden />
          Filtres
          {filterCount > 0 ? (
            <span className="grid size-6 place-items-center rounded-full bg-slate-blue text-[0.8125rem] text-cream">
              {filterCount}
            </span>
          ) : null}
        </button>
        {filters.bedrooms > 0 ? (
          <FilterChip
            label={`${filters.bedrooms} chambres et plus`}
            onRemove={() => navigate(search, { ...filters, bedrooms: 0 })}
          />
        ) : null}
        {filters.types.map((type) => (
          <FilterChip
            key={type}
            label={propertyTypeLabels[type]}
            onRemove={() =>
              navigate(search, { ...filters, types: filters.types.filter((item) => item !== type) })
            }
          />
        ))}
        {filters.amenities.map((amenity) => (
          <FilterChip
            key={amenity}
            label={amenityLabels[amenity]}
            onRemove={() =>
              navigate(search, {
                ...filters,
                amenities: filters.amenities.filter((item) => item !== amenity),
              })
            }
          />
        ))}
      </div>

      <div className="mt-8" aria-busy={loading}>
        {loading ? (
          <>
            <p className="sr-only" role="status">
              Chargement des séjours
            </p>
            <ResultsSkeleton />
          </>
        ) : failed ? (
          <ErrorState onRetry={() => setAttempt((current) => current + 1)} />
        ) : results && results.length > 0 ? (
          <>
            {!hasDates ? (
              <InfoNote className="mb-5">
                Indiquez vos dates pour savoir quels séjours peuvent être demandés.
              </InfoNote>
            ) : allUnavailable ? (
              <InfoNote className="mb-5">
                Aucun de ces séjours n&apos;est ouvert à la demande pour ces dates.
                {firstAlternative ? (
                  <>
                    {" "}
                    <button
                      type="button"
                      onClick={() => pickDates(firstAlternative)}
                      className="font-medium underline underline-offset-4"
                    >
                      Essayer du {formatRange(firstAlternative.checkIn, firstAlternative.checkOut)}
                    </button>
                  </>
                ) : null}
              </InfoNote>
            ) : unknownCount > 0 ? (
              <InfoNote className="mb-5">
                {unknownCount > 1
                  ? `La disponibilité de ${unknownCount} séjours n'est pas connue pour ces dates.`
                  : "La disponibilité d'un séjour n'est pas connue pour ces dates."}{" "}
                Notre équipe la vérifie avec votre demande.
              </InfoNote>
            ) : null}
            <PropertyGrid
              key={requestKey}
              items={results}
              destinationNames={destinationNames}
              search={search}
              mode="enter"
              eagerCount={3}
              onPickDates={pickDates}
              tone="glass"
            />
          </>
        ) : (
          <EmptyState
            hasFilters={filterCount > 0}
            onClearFilters={() => navigate(search, DEFAULT_FILTERS)}
            onClearAll={() => navigate(DEFAULT_SEARCH, DEFAULT_FILTERS)}
          />
        )}
      </div>

      <FilterSheet
        open={filtersOpen}
        onClose={() => setFiltersOpen(false)}
        value={filters}
        onApply={(next) => navigate(search, next)}
      />
    </div>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <button
      type="button"
      onClick={onRemove}
      aria-label={`Retirer le filtre ${label}`}
      className="glass glass-pill inline-flex min-h-11 items-center gap-2 rounded-full bg-blue-grey/70 py-1 pr-2.5 pl-4 text-[0.9375rem] font-medium transition-colors hover:bg-blue-grey/90"
    >
      {label}
      <X className="size-4" aria-hidden />
    </button>
  );
}
