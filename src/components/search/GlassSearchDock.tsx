"use client";

import { CalendarDays, MapPin, Search, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useEffect,
  useRef,
  useState,
  type FocusEvent,
  type FormEvent,
  type RefObject,
} from "react";
import { Button } from "@/components/ui/Button";
import { ResponsivePanel } from "@/components/ui/ResponsivePanel";
import { useMediaQuery } from "@/lib/a11y/hooks";
import { cn } from "@/lib/cn";
import { media } from "@/lib/design/tokens";
import { formatDay } from "@/lib/search/dates";
import { buildHref, DEFAULT_SEARCH, describeGuests, type SearchState } from "@/lib/search/params";
import { DateRangePicker } from "./DateRangePicker";
import { DestinationField, type DestinationOption } from "./DestinationField";
import { FieldButton } from "./FieldButton";
import { GuestSelector } from "./GuestSelector";

type PanelId = "destination" | "dates" | "guests";

const PANEL_WIDTH = { destination: 352, guests: 336, datesOne: 372, datesTwo: 700 } as const;

interface GlassSearchDockProps {
  destinations: DestinationOption[];
  initial?: SearchState;
  /** Desktop: pickers open above the dock (hero) or below it (page top). */
  placement?: "top" | "bottom";
  submitLabel?: string;
  /** Defaults to opening the results page with the chosen search. */
  onSubmit?: (state: SearchState) => void;
  /** Reports when a picker is open or focus is inside the dock. */
  onBusyChange?: (busy: boolean) => void;
  className?: string;
  /** Classes for the glass surface itself, such as its entrance animation. */
  surfaceClassName?: string;
  /** Glass token class of the pickers, so they can match the page they open on. */
  panelClassName?: string;
}

/**
 * The search dock: destination, arrival, departure, guests and one action.
 *
 * It keeps its own state and is never keyed to a hero scene, so a scene
 * change cannot reset its values, close its calendar or move focus.
 */
export function GlassSearchDock({
  destinations,
  initial = DEFAULT_SEARCH,
  placement = "bottom",
  submitLabel = "Voir les séjours",
  onSubmit,
  onBusyChange,
  className,
  surfaceClassName,
  panelClassName,
}: GlassSearchDockProps) {
  const router = useRouter();
  const root = useRef<HTMLDivElement>(null);
  const destinationTrigger = useRef<HTMLButtonElement>(null);
  const startTrigger = useRef<HTMLButtonElement>(null);
  const endTrigger = useRef<HTMLButtonElement>(null);
  const guestsTrigger = useRef<HTMLButtonElement>(null);

  const [draft, setDraft] = useState<SearchState>(initial);
  const [panel, setPanel] = useState<PanelId | null>(null);
  const [dateFocus, setDateFocus] = useState<"start" | "end">("start");
  const [panelBox, setPanelBox] = useState({ left: 0, width: PANEL_WIDTH.destination as number });
  const [focusWithin, setFocusWithin] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const twoMonths = useMediaQuery(media.desktop);

  const busy = panel !== null || focusWithin;
  useEffect(() => {
    onBusyChange?.(busy);
  }, [busy, onBusyChange]);

  const open = (
    id: PanelId,
    trigger: RefObject<HTMLButtonElement | null>,
    focus: "start" | "end" = "start",
  ) => {
    if (panel === id && (id !== "dates" || focus === dateFocus)) {
      setPanel(null);
      return;
    }
    const host = root.current;
    const node = trigger.current;
    const width =
      id === "dates" ? (twoMonths ? PANEL_WIDTH.datesTwo : PANEL_WIDTH.datesOne) : PANEL_WIDTH[id];
    if (host && node) {
      const preferred = id === "dates" ? (host.clientWidth - width) / 2 : node.offsetLeft;
      const left = Math.max(0, Math.min(preferred, host.clientWidth - width));
      setPanelBox({ left, width: Math.min(width, host.clientWidth) });
    }
    setDateFocus(focus);
    setHint(null);
    setPanel(id);
  };

  const close = () => setPanel(null);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (draft.checkIn && !draft.checkOut) {
      setHint("Choisissez aussi une date de départ.");
      open("dates", endTrigger, "end");
      return;
    }
    setPanel(null);
    if (onSubmit) onSubmit(draft);
    else router.push(buildHref("/stays", draft));
  };

  const onBlur = (event: FocusEvent<HTMLDivElement>) => {
    const next = event.relatedTarget;
    if (next instanceof Node && event.currentTarget.contains(next)) return;
    setFocusWithin(false);
  };

  const destinationName =
    destinations.find((destination) => destination.slug === draft.destination)?.name ?? null;
  const panelStyle = { left: panelBox.left, width: panelBox.width };
  const confirm = (
    <Button variant="primary" size="lg" className="w-full" onClick={close}>
      Valider
    </Button>
  );

  return (
    <div
      ref={root}
      onFocus={() => setFocusWithin(true)}
      onBlur={onBlur}
      className={cn("on-light relative", className)}
    >
      {/*
        The pickers are siblings of the glass form, not children of it: an
        element with a backdrop filter stops its descendants from blurring
        what lies behind them.
      */}
      <form
        role="search"
        aria-label="Rechercher un séjour"
        onSubmit={submit}
        className={cn(
          "glass glass-light rounded-[1.5rem] p-1.5 md:rounded-[2rem] md:p-2",
          surfaceClassName,
        )}
      >
        <div className="grid grid-cols-2 gap-1.5 md:grid-cols-4 xl:grid-cols-[minmax(0,1.3fr)_repeat(3,minmax(0,1fr))_auto]">
          <FieldButton
            buttonRef={destinationTrigger}
            icon={MapPin}
            label="Destination"
            value={destinationName}
            placeholder="Toutes les destinations"
            active={panel === "destination"}
            onClick={() => open("destination", destinationTrigger)}
            className="col-span-2 xl:col-span-1"
          />
          <FieldButton
            buttonRef={startTrigger}
            icon={CalendarDays}
            label="Arrivée"
            value={draft.checkIn ? formatDay(draft.checkIn) : null}
            placeholder="Ajouter une date"
            placeholderShort="Ajouter"
            active={panel === "dates" && dateFocus === "start"}
            onClick={() => open("dates", startTrigger, "start")}
          />
          <FieldButton
            buttonRef={endTrigger}
            icon={CalendarDays}
            label="Départ"
            value={draft.checkOut ? formatDay(draft.checkOut) : null}
            placeholder="Ajouter une date"
            placeholderShort="Ajouter"
            active={panel === "dates" && dateFocus === "end"}
            onClick={() => open("dates", endTrigger, "end")}
          />
          <FieldButton
            buttonRef={guestsTrigger}
            icon={Users}
            label="Voyageurs"
            value={describeGuests(draft)}
            placeholder="Ajouter des voyageurs"
            active={panel === "guests"}
            onClick={() => open("guests", guestsTrigger)}
            className="md:col-span-2 xl:col-span-1"
          />
          <button
            type="submit"
            className="inline-flex min-h-13 items-center justify-center gap-2 rounded-field bg-slate-blue px-4 text-[0.9375rem] font-medium whitespace-nowrap text-cream shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] transition-colors duration-200 hover:bg-slate-deep md:col-span-2 md:min-h-16 md:text-base xl:col-span-1 xl:px-7"
          >
            <Search className="size-[1.125rem] shrink-0" aria-hidden />
            <span>{submitLabel}</span>
          </button>
        </div>
      </form>

      {hint ? (
        <p
          role="status"
          className="absolute inset-x-3 -top-12 mx-auto w-fit rounded-full bg-charcoal/80 px-4 py-2 text-[0.875rem] text-cream"
        >
          {hint}
        </p>
      ) : null}

      <ResponsivePanel
        open={panel === "destination"}
        onClose={close}
        title="Destination"
        trigger={destinationTrigger}
        placement={placement}
        style={panelStyle}
        surfaceClassName={panelClassName}
      >
        <DestinationField
          options={destinations}
          value={draft.destination}
          onSelect={(slug) => {
            setDraft((current) => ({ ...current, destination: slug }));
            close();
            destinationTrigger.current?.focus({ preventScroll: true });
          }}
        />
      </ResponsivePanel>

      <ResponsivePanel
        open={panel === "dates"}
        onClose={close}
        title="Dates du séjour"
        trigger={dateFocus === "start" ? startTrigger : endTrigger}
        placement={placement}
        style={panelStyle}
        footer={confirm}
        surfaceClassName={panelClassName}
      >
        <DateRangePicker
          key={dateFocus}
          value={{ checkIn: draft.checkIn, checkOut: draft.checkOut }}
          initialFocus={dateFocus}
          months={twoMonths ? 2 : 1}
          onChange={(range) => {
            setHint(null);
            setDraft((current) => ({ ...current, ...range }));
          }}
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
        placement={placement}
        style={panelStyle}
        footer={confirm}
        surfaceClassName={panelClassName}
      >
        <GuestSelector
          value={{ adults: draft.adults, children: draft.children }}
          onChange={(guests) => setDraft((current) => ({ ...current, ...guests }))}
        />
      </ResponsivePanel>
    </div>
  );
}
