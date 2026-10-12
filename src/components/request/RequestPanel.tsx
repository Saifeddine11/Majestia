"use client";

import { useSearchParams } from "next/navigation";
import { CalendarDays, LoaderCircle, Users } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AvailabilityLabel } from "@/components/property/AvailabilityLabel";
import { PriceLabel } from "@/components/property/PriceLabel";
import { ShortlistButton } from "@/components/property/ShortlistButton";
import { DateRangePicker } from "@/components/search/DateRangePicker";
import { FieldButton } from "@/components/search/FieldButton";
import { GuestSelector } from "@/components/search/GuestSelector";
import { Button, ButtonLink } from "@/components/ui/Button";
import { ResponsivePanel } from "@/components/ui/ResponsivePanel";
import { priceLabels } from "@/content/labels";
import { api } from "@/lib/api";
import type { AvailabilityInfo, PriceInfo, Property } from "@/lib/api/types";
import { formatEuro } from "@/lib/format";
import { formatDay, formatRange } from "@/lib/search/dates";
import {
  buildHref,
  DEFAULT_FILTERS,
  describeGuests,
  parseSearch,
  totalGuests,
  type SearchState,
} from "@/lib/search/params";

interface Quote {
  key: string;
  availability: AvailabilityInfo;
  price: PriceInfo;
}

const UNKNOWN: AvailabilityInfo = { status: "unknown", alternatives: [] };

function shortPrice(price: PriceInfo): string {
  if (price.kind === "from_per_night") {
    return `${priceLabels.fromPerNight} ${formatEuro(price.amount)} ${priceLabels.perNight}`;
  }
  if (price.kind === "stay_estimate") return `Estimation ${formatEuro(price.amount)}`;
  return price.kind === "on_request" ? priceLabels.onRequest : priceLabels.customQuote;
}

/**
 * The request panel of a property: price label, dates, guests, availability
 * as reported by the data source, and the action that starts a request.
 *
 * It is a readable tinted surface, not glass. It never states that a stay is
 * booked or that dates are guaranteed.
 */
export function RequestPanel({ property }: { property: Property }) {
  const searchParams = useSearchParams();
  const [draft, setDraft] = useState<SearchState>(() => ({
    ...parseSearch(searchParams),
    destination: null,
  }));
  const [panel, setPanel] = useState<"dates" | "guests" | null>(null);
  const [dateFocus, setDateFocus] = useState<"start" | "end">("start");
  const [quote, setQuote] = useState<Quote | null>(null);

  const startTrigger = useRef<HTMLButtonElement>(null);
  const endTrigger = useRef<HTMLButtonElement>(null);
  const guestsTrigger = useRef<HTMLButtonElement>(null);

  const { checkIn, checkOut } = draft;
  const hasDates = Boolean(checkIn && checkOut);
  const rangeKey = hasDates ? `${checkIn}_${checkOut}` : "none";
  const checking = hasDates && quote?.key !== rangeKey;
  const current = hasDates && quote?.key === rangeKey ? quote : null;

  useEffect(() => {
    if (!checkIn || !checkOut) return;
    let cancelled = false;
    const range = { checkIn, checkOut };
    const key = `${checkIn}_${checkOut}`;
    Promise.all([
      api.getAvailability(property.slug, range),
      api.getPriceSummary(property.slug, range),
    ]).then(
      ([availability, price]) => {
        if (!cancelled) setQuote({ key, availability, price });
      },
      () => {
        // If the check fails, say that availability is unknown rather than guess.
        if (!cancelled) setQuote({ key, availability: UNKNOWN, price: property.price });
      },
    );
    return () => {
      cancelled = true;
    };
  }, [checkIn, checkOut, property.slug, property.price]);

  const price = current?.price ?? property.price;
  const availability = current?.availability ?? UNKNOWN;
  const guests = totalGuests(draft);
  const overCapacity = guests > property.capacity;
  const requestHref = buildHref("/request", draft, DEFAULT_FILTERS, { property: property.slug });

  const openDates = (focus: "start" | "end") => {
    if (panel === "dates" && dateFocus === focus) {
      setPanel(null);
      return;
    }
    setDateFocus(focus);
    setPanel("dates");
  };
  const close = () => setPanel(null);
  const confirm = (
    <Button size="lg" className="w-full" onClick={close}>
      Valider
    </Button>
  );

  return (
    <>
      <div id="demande" className="surface-paper rounded-panel p-5 md:p-6">
        <h2 className="sr-only">Demander ce séjour</h2>
        <PriceLabel price={price} size="lg" showNote />

        <div className="relative mt-5">
          <div className="grid grid-cols-2 gap-2">
            <FieldButton
              buttonRef={startTrigger}
              icon={CalendarDays}
              label="Arrivée"
              value={checkIn ? formatDay(checkIn) : null}
              placeholder="Ajouter"
              active={panel === "dates" && dateFocus === "start"}
              onClick={() => openDates("start")}
              tone="paper"
            />
            <FieldButton
              buttonRef={endTrigger}
              icon={CalendarDays}
              label="Départ"
              value={checkOut ? formatDay(checkOut) : null}
              placeholder="Ajouter"
              active={panel === "dates" && dateFocus === "end"}
              onClick={() => openDates("end")}
              tone="paper"
            />
            <FieldButton
              buttonRef={guestsTrigger}
              icon={Users}
              label="Voyageurs"
              value={describeGuests(draft)}
              placeholder="Ajouter"
              active={panel === "guests"}
              onClick={() => setPanel((value) => (value === "guests" ? null : "guests"))}
              tone="paper"
              className="col-span-2"
            />
          </div>

          <ResponsivePanel
            open={panel === "dates"}
            onClose={close}
            title="Dates du séjour"
            trigger={dateFocus === "start" ? startTrigger : endTrigger}
            className="right-0"
            style={{ width: 372 }}
            footer={confirm}
          >
            <DateRangePicker
              key={dateFocus}
              value={{ checkIn, checkOut }}
              initialFocus={dateFocus}
              onChange={(range) => setDraft((value) => ({ ...value, ...range }))}
              onComplete={() => {
                close();
                endTrigger.current?.focus({ preventScroll: true });
              }}
            />
          </ResponsivePanel>
          <ResponsivePanel
            open={panel === "guests"}
            onClose={close}
            title="Voyageurs"
            trigger={guestsTrigger}
            className="right-0"
            style={{ width: 336 }}
            footer={confirm}
          >
            <GuestSelector
              value={{ adults: draft.adults, children: draft.children }}
              onChange={(next) => setDraft((value) => ({ ...value, ...next }))}
            />
          </ResponsivePanel>
        </div>

        {overCapacity ? (
          <p
            role="status"
            className="mt-3 rounded-[1rem] bg-sand/60 px-3.5 py-2.5 text-[0.9375rem]"
          >
            Cette propriété accueille jusqu&apos;à {property.capacity} voyageurs.
          </p>
        ) : null}

        <div className="mt-5 min-h-[4.25rem]" aria-live="polite">
          {!hasDates ? (
            <p className="text-[0.9375rem] text-ink-muted">
              Indiquez vos dates pour savoir si ce séjour peut être demandé.
            </p>
          ) : checking ? (
            <p className="inline-flex items-center gap-2.5 text-[0.9375rem] text-ink-muted">
              <LoaderCircle className="size-4 animate-spin" aria-hidden />
              Vérification pour ces dates…
            </p>
          ) : (
            <>
              <AvailabilityLabel status={availability.status} showHint />
              {availability.status === "unavailable" && availability.alternatives.length > 0 ? (
                <ul className="mt-3 flex flex-wrap gap-2">
                  {availability.alternatives.map((range) => (
                    <li key={range.checkIn}>
                      <button
                        type="button"
                        onClick={() => setDraft((value) => ({ ...value, ...range }))}
                        className="inline-flex min-h-11 items-center rounded-full border border-slate-blue/55 px-3.5 text-[0.875rem] font-medium transition-colors hover:bg-slate-blue hover:text-cream"
                      >
                        {formatRange(range.checkIn, range.checkOut)}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </>
          )}
        </div>

        <ButtonLink href={requestHref} size="lg" arrow className="mt-5 w-full">
          Demander ce séjour
        </ButtonLink>
        <ShortlistButton
          slug={property.slug}
          name={property.name}
          variant="full"
          className="mt-2.5"
        />

        <p className="mt-4 text-[0.875rem] leading-snug text-ink-muted">
          Une demande n&apos;est pas une réservation. Aucun paiement n&apos;est demandé à cette
          étape.
        </p>
      </div>

      {/* Phones: the single bottom action of the page. */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40 px-2.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden">
        <div className="on-light glass glass-warm pointer-events-auto flex items-center justify-between gap-3 rounded-full p-1.5 pl-5">
          <p className="min-w-0 truncate text-[0.9375rem] font-medium">{shortPrice(price)}</p>
          <ButtonLink href={requestHref} className="shrink-0">
            Demander
          </ButtonLink>
        </div>
      </div>
    </>
  );
}
