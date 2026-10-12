"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarDays, CircleAlert, MapPin, Plus, Users, X } from "lucide-react";
import { useId, useMemo, useRef, useState, type FormEvent, type ReactNode } from "react";
import { DateRangePicker } from "@/components/search/DateRangePicker";
import { DestinationField, type DestinationOption } from "@/components/search/DestinationField";
import { FieldButton } from "@/components/search/FieldButton";
import { GuestSelector } from "@/components/search/GuestSelector";
import { Button } from "@/components/ui/Button";
import { ResponsivePanel } from "@/components/ui/ResponsivePanel";
import { channelLabels, propertyTypeLabels } from "@/content/labels";
import { site } from "@/content/site";
import { api } from "@/lib/api";
import type { ContactChannel, Photo, PropertyType } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { diffDays, formatDay, formatRange } from "@/lib/search/dates";
import { describeGuests, parseSearch, type SearchState } from "@/lib/search/params";
import { useShortlist } from "@/lib/shortlist/store";

export interface RequestCatalogItem {
  slug: string;
  name: string;
  type: PropertyType;
  destination: string;
  destinationName: string;
  photo: Photo;
}

interface RequestFormProps {
  catalog: RequestCatalogItem[];
  destinations: DestinationOption[];
}

type FieldKey = "selection" | "dates" | "name" | "contact";
type Errors = Partial<Record<FieldKey, string>>;
type PanelId = "destination" | "dates" | "guests";

const CHANNELS: ContactChannel[] = ["whatsapp", "email", "phone"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^\+?[\d\s().-]+$/;

const FIELD_ANCHORS: Record<FieldKey, string> = {
  selection: "request-selection",
  dates: "request-dates",
  name: "request-name",
  contact: "request-contact",
};

const inputClass =
  "mt-2 block min-h-13 w-full rounded-field bg-white/60 px-4 text-base shadow-[inset_0_0_0_1px_rgba(31,41,46,0.18)] " +
  "transition-shadow placeholder:text-charcoal/50 hover:bg-white/80 " +
  "aria-invalid:shadow-[inset_0_0_0_1.5px_var(--color-charcoal)]";

function FieldError({ id, children }: { id: string; children: ReactNode }) {
  return (
    <p id={id} className="mt-2 flex items-start gap-2 text-[0.9375rem] font-medium">
      <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
      {children}
    </p>
  );
}

function Section({ step, title, children }: { step: number; title: string; children: ReactNode }) {
  return (
    <section className="surface-paper rounded-panel p-5 md:p-7">
      <h2 className="flex items-center gap-3 text-[1.25rem] font-medium tracking-[-0.01em]">
        <span
          aria-hidden
          className="grid size-8 place-items-center rounded-full bg-slate-blue text-[0.9375rem] text-cream"
        >
          {step}
        </span>
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

/**
 * The request form: selection, stay, contact. Short on purpose.
 *
 * Sending it creates a request through the data adapter and shows the
 * reference it returns. It does not book anything and takes no payment.
 */
export function RequestForm({ catalog, destinations }: RequestFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { slugs: shortlisted, remove: removeFromShortlist } = useShortlist();
  const formId = useId();

  const known = useMemo(() => new Set(catalog.map((item) => item.slug)), [catalog]);
  const fromUrl = useMemo(
    () => Array.from(new Set(searchParams.getAll("property").filter((slug) => known.has(slug)))),
    [searchParams, known],
  );

  /** `null` until the visitor edits the list; until then it follows the URL or the shortlist. */
  const [edited, setEdited] = useState<string[] | null>(null);
  const selected =
    edited ?? (fromUrl.length > 0 ? fromUrl : shortlisted.filter((slug) => known.has(slug)));
  const selectedItems = selected
    .map((slug) => catalog.find((item) => item.slug === slug))
    .filter((item): item is RequestCatalogItem => Boolean(item));
  const suggestions = shortlisted
    .filter((slug) => known.has(slug) && !selected.includes(slug))
    .map((slug) => catalog.find((item) => item.slug === slug))
    .filter((item): item is RequestCatalogItem => Boolean(item));

  const [stay, setStay] = useState<SearchState>(() => parseSearch(searchParams));
  const [name, setName] = useState("");
  const [channel, setChannel] = useState<ContactChannel>("whatsapp");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "failed">("idle");
  const [panel, setPanel] = useState<PanelId | null>(null);
  const [dateFocus, setDateFocus] = useState<"start" | "end">("start");

  const summary = useRef<HTMLDivElement>(null);
  const destinationTrigger = useRef<HTMLButtonElement>(null);
  const startTrigger = useRef<HTMLButtonElement>(null);
  const endTrigger = useRef<HTMLButtonElement>(null);
  const guestsTrigger = useRef<HTMLButtonElement>(null);

  const selectedDestinations = Array.from(new Set(selectedItems.map((item) => item.destination)));
  const destinationName =
    destinations.find((destination) => destination.slug === stay.destination)?.name ?? null;
  const nights = stay.checkIn && stay.checkOut ? diffDays(stay.checkIn, stay.checkOut) : null;
  const errorList = (Object.keys(errors) as FieldKey[]).filter((key) => errors[key]);
  const submitting = status === "submitting";

  const clearError = (key: FieldKey) =>
    setErrors((current) => (current[key] ? { ...current, [key]: undefined } : current));

  const close = () => setPanel(null);
  const openDates = (focus: "start" | "end") => {
    if (panel === "dates" && dateFocus === focus) {
      setPanel(null);
      return;
    }
    setDateFocus(focus);
    setPanel("dates");
  };

  const validate = (): Errors => {
    const next: Errors = {};
    if (selected.length === 0 && !stay.destination) {
      next.selection = "Choisissez au moins une propriété ou une destination.";
    }
    if (!stay.checkIn || !stay.checkOut) {
      next.dates = "Indiquez vos dates d'arrivée et de départ.";
    }
    if (name.trim().length < 2) next.name = "Indiquez votre nom.";
    const value = contact.trim();
    if (channel === "email") {
      if (!EMAIL_PATTERN.test(value)) {
        next.contact = "Indiquez une adresse e-mail valide, par exemple nom@exemple.com.";
      }
    } else if (!PHONE_PATTERN.test(value) || value.replace(/\D/g, "").length < 8) {
      next.contact = "Indiquez un numéro de téléphone valide, avec l'indicatif du pays.";
    }
    return next;
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    const next = validate();
    setErrors(next);
    if (Object.keys(next).length > 0 || !stay.checkIn || !stay.checkOut) {
      requestAnimationFrame(() => summary.current?.focus());
      return;
    }

    setStatus("submitting");
    try {
      const request = await api.createRequest({
        propertySlugs: selected,
        destination:
          selectedDestinations.length === 1 ? selectedDestinations[0] : (stay.destination ?? null),
        checkIn: stay.checkIn,
        checkOut: stay.checkOut,
        adults: stay.adults,
        children: stay.children,
        name: name.trim(),
        channel,
        contact: contact.trim(),
        message: message.trim(),
      });
      selected.forEach(removeFromShortlist);
      router.push(`/request/${encodeURIComponent(request.reference)}`);
    } catch {
      setStatus("failed");
    }
  };

  const confirm = (
    <Button size="lg" className="w-full" onClick={close}>
      Valider
    </Button>
  );

  return (
    <form
      noValidate
      onSubmit={submit}
      aria-labelledby={`${formId}-title`}
      className="mt-10 grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem] lg:items-start lg:gap-8"
    >
      <h2 id={`${formId}-title`} className="sr-only">
        Formulaire de demande
      </h2>

      <div className="flex min-w-0 flex-col gap-5">
        {errorList.length > 0 ? (
          <div
            ref={summary}
            tabIndex={-1}
            role="alert"
            className="rounded-panel bg-sand/70 p-5 shadow-[inset_0_0_0_1.5px_var(--color-charcoal)] outline-none"
          >
            <p className="flex items-center gap-2.5 font-medium">
              <CircleAlert className="size-5" aria-hidden />
              {errorList.length > 1
                ? `${errorList.length} informations sont à compléter.`
                : "Une information est à compléter."}
            </p>
            <ul className="mt-2 space-y-1 pl-8">
              {errorList.map((key) => (
                <li key={key}>
                  <a href={`#${FIELD_ANCHORS[key]}`} className="underline underline-offset-4">
                    {errors[key]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <Section step={1} title="Votre sélection">
          <div id={FIELD_ANCHORS.selection} className="scroll-mt-28">
            {selectedItems.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {selectedItems.map((item) => (
                  <li
                    key={item.slug}
                    className="flex items-center gap-3 rounded-[1.25rem] bg-white/55 p-2 pr-1"
                  >
                    <span className="relative size-16 shrink-0 overflow-hidden rounded-[0.875rem] bg-sand">
                      <Image
                        src={item.photo.src}
                        alt=""
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </span>
                    <Link
                      href={`/properties/${item.slug}`}
                      className="group/item flex min-h-11 min-w-0 flex-1 flex-col justify-center rounded-[0.75rem]"
                    >
                      <span className="block truncate font-medium underline-offset-4 group-hover/item:underline">
                        {item.name}
                      </span>
                      <span className="block truncate text-[0.875rem] text-ink-muted">
                        {propertyTypeLabels[item.type]} · {item.destinationName}
                      </span>
                    </Link>
                    <button
                      type="button"
                      onClick={() => setEdited(selected.filter((slug) => slug !== item.slug))}
                      aria-label={`Retirer ${item.name} de la demande`}
                      className="grid size-11 shrink-0 place-items-center rounded-full transition-colors hover:bg-charcoal/8"
                    >
                      <X className="size-5" aria-hidden />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-ink-muted">
                Aucune propriété sélectionnée. Vous pouvez indiquer une destination ci-dessous, ou{" "}
                <Link
                  href="/stays"
                  className="font-medium text-charcoal underline underline-offset-4"
                >
                  parcourir les séjours
                </Link>
                .
              </p>
            )}

            {suggestions.length > 0 ? (
              <div className="mt-4">
                <p className="text-[0.9375rem] text-ink-muted">Aussi dans votre sélection :</p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {suggestions.map((item) => (
                    <li key={item.slug}>
                      <button
                        type="button"
                        onClick={() => {
                          setEdited([...selected, item.slug]);
                          clearError("selection");
                        }}
                        className="inline-flex min-h-11 items-center gap-2 rounded-full border border-charcoal/22 px-4 text-[0.9375rem] font-medium transition-colors hover:border-charcoal/45 hover:bg-charcoal/5"
                      >
                        <Plus className="size-4" aria-hidden />
                        {item.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {errors.selection ? (
              <FieldError id={`${formId}-selection-error`}>{errors.selection}</FieldError>
            ) : null}
          </div>
        </Section>

        <Section step={2} title="Votre séjour">
          <div className="relative">
            <div className="grid grid-cols-2 gap-2">
              {selectedItems.length === 0 ? (
                <FieldButton
                  buttonRef={destinationTrigger}
                  icon={MapPin}
                  label="Destination"
                  value={destinationName}
                  placeholder="Choisir une destination"
                  active={panel === "destination"}
                  onClick={() =>
                    setPanel((value) => (value === "destination" ? null : "destination"))
                  }
                  tone="paper"
                  invalid={Boolean(errors.selection)}
                  describedBy={errors.selection ? `${formId}-selection-error` : undefined}
                  className="col-span-2"
                />
              ) : (
                <p className="col-span-2 flex min-h-13 items-center gap-3 rounded-field bg-white/35 px-4">
                  <MapPin className="size-[1.125rem] shrink-0 text-slate-deep" aria-hidden />
                  <span>
                    <span className="block text-[0.8125rem] leading-tight text-ink-muted">
                      Destination
                    </span>
                    <span className="block font-medium">
                      {Array.from(new Set(selectedItems.map((item) => item.destinationName))).join(
                        ", ",
                      )}
                    </span>
                  </span>
                </p>
              )}
              <div
                id={FIELD_ANCHORS.dates}
                className="col-span-2 grid scroll-mt-28 grid-cols-2 gap-2"
              >
                <FieldButton
                  buttonRef={startTrigger}
                  icon={CalendarDays}
                  label="Arrivée"
                  value={stay.checkIn ? formatDay(stay.checkIn) : null}
                  placeholder="Ajouter une date"
                  placeholderShort="Ajouter"
                  active={panel === "dates" && dateFocus === "start"}
                  onClick={() => openDates("start")}
                  tone="paper"
                  invalid={Boolean(errors.dates)}
                  describedBy={errors.dates ? `${formId}-dates-error` : undefined}
                />
                <FieldButton
                  buttonRef={endTrigger}
                  icon={CalendarDays}
                  label="Départ"
                  value={stay.checkOut ? formatDay(stay.checkOut) : null}
                  placeholder="Ajouter une date"
                  placeholderShort="Ajouter"
                  active={panel === "dates" && dateFocus === "end"}
                  onClick={() => openDates("end")}
                  tone="paper"
                  invalid={Boolean(errors.dates)}
                  describedBy={errors.dates ? `${formId}-dates-error` : undefined}
                />
              </div>
              <FieldButton
                buttonRef={guestsTrigger}
                icon={Users}
                label="Voyageurs"
                value={describeGuests(stay)}
                placeholder="Ajouter"
                active={panel === "guests"}
                onClick={() => setPanel((value) => (value === "guests" ? null : "guests"))}
                tone="paper"
                className="col-span-2"
              />
            </div>
            {errors.dates ? (
              <FieldError id={`${formId}-dates-error`}>{errors.dates}</FieldError>
            ) : null}

            <ResponsivePanel
              open={panel === "destination"}
              onClose={close}
              title="Destination"
              trigger={destinationTrigger}
              className="left-0"
              style={{ width: 352 }}
            >
              <DestinationField
                options={destinations}
                value={stay.destination}
                allowAll={false}
                onSelect={(slug) => {
                  setStay((value) => ({ ...value, destination: slug }));
                  clearError("selection");
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
              className="left-0"
              style={{ width: 372 }}
              footer={confirm}
            >
              <DateRangePicker
                key={dateFocus}
                value={{ checkIn: stay.checkIn, checkOut: stay.checkOut }}
                initialFocus={dateFocus}
                onChange={(range) => {
                  setStay((value) => ({ ...value, ...range }));
                  if (range.checkIn && range.checkOut) clearError("dates");
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
              className="left-0"
              style={{ width: 336 }}
              footer={confirm}
            >
              <GuestSelector
                value={{ adults: stay.adults, children: stay.children }}
                onChange={(next) => setStay((value) => ({ ...value, ...next }))}
              />
            </ResponsivePanel>
          </div>
        </Section>

        <Section step={3} title="Vos coordonnées">
          <div className="grid gap-5">
            <div>
              <label htmlFor={FIELD_ANCHORS.name} className="font-medium">
                Nom
              </label>
              <input
                id={FIELD_ANCHORS.name}
                name="name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) => {
                  setName(event.target.value);
                  clearError("name");
                }}
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={errors.name ? `${formId}-name-error` : undefined}
                className={cn(inputClass, "scroll-mt-28")}
              />
              {errors.name ? (
                <FieldError id={`${formId}-name-error`}>{errors.name}</FieldError>
              ) : null}
            </div>

            <fieldset>
              <legend className="font-medium">Canal de contact préféré</legend>
              <div className="mt-2 grid grid-cols-3 gap-1 rounded-full bg-charcoal/8 p-1">
                {CHANNELS.map((option) => (
                  <label
                    key={option}
                    className={cn(
                      "flex min-h-11 cursor-pointer items-center justify-center rounded-full px-2 text-center text-[0.9375rem] font-medium transition-colors",
                      "has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-charcoal",
                      channel === option
                        ? "bg-paper text-charcoal shadow-[0_2px_10px_rgba(31,41,46,0.14)]"
                        : "text-ink-muted hover:text-charcoal",
                    )}
                  >
                    <input
                      type="radio"
                      name="channel"
                      value={option}
                      checked={channel === option}
                      onChange={() => {
                        setChannel(option);
                        clearError("contact");
                      }}
                      className="sr-only"
                    />
                    {channelLabels[option].label}
                  </label>
                ))}
              </div>
            </fieldset>

            <div>
              <label htmlFor={FIELD_ANCHORS.contact} className="font-medium">
                {channelLabels[channel].field}
              </label>
              <input
                id={FIELD_ANCHORS.contact}
                name="contact"
                type={channel === "email" ? "email" : "tel"}
                inputMode={channel === "email" ? "email" : "tel"}
                autoComplete={channel === "email" ? "email" : "tel"}
                value={contact}
                onChange={(event) => {
                  setContact(event.target.value);
                  clearError("contact");
                }}
                aria-invalid={errors.contact ? true : undefined}
                aria-describedby={`${formId}-contact-hint${errors.contact ? ` ${formId}-contact-error` : ""}`}
                className={cn(inputClass, "scroll-mt-28")}
              />
              <p id={`${formId}-contact-hint`} className="mt-2 text-[0.875rem] text-ink-muted">
                {channel === "email"
                  ? "Nous vous répondrons à cette adresse."
                  : "Avec l'indicatif du pays, par exemple +33."}
              </p>
              {errors.contact ? (
                <FieldError id={`${formId}-contact-error`}>{errors.contact}</FieldError>
              ) : null}
            </div>

            <div>
              <label htmlFor={`${formId}-message`} className="font-medium">
                Message <span className="font-normal text-ink-muted">(facultatif)</span>
              </label>
              <textarea
                id={`${formId}-message`}
                name="message"
                rows={4}
                maxLength={1500}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                aria-describedby={`${formId}-message-hint`}
                className={cn(inputClass, "resize-y py-3")}
              />
              <p id={`${formId}-message-hint`} className="mt-2 text-[0.875rem] text-ink-muted">
                Occasion, heure d&apos;arrivée, services souhaités…
              </p>
            </div>
          </div>
        </Section>
      </div>

      <aside className="glass glass-warm rounded-panel p-5 md:p-6 lg:sticky lg:top-28">
        <h2 className="text-[1.25rem] font-medium tracking-[-0.01em]">Récapitulatif</h2>
        <dl className="mt-4 space-y-3 text-[0.9375rem]">
          <div className="flex justify-between gap-4 border-b border-charcoal/12 pb-3">
            <dt className="text-ink-muted">Sélection</dt>
            <dd className="text-right font-medium">
              {selectedItems.length > 0
                ? `${selectedItems.length} propriété${selectedItems.length > 1 ? "s" : ""}`
                : (destinationName ?? "À préciser")}
            </dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-charcoal/12 pb-3">
            <dt className="text-ink-muted">Dates</dt>
            <dd className="text-right font-medium">
              {stay.checkIn && stay.checkOut ? (
                <>
                  {formatRange(stay.checkIn, stay.checkOut)}
                  <span className="block font-normal text-ink-muted">
                    {nights} nuit{nights !== null && nights > 1 ? "s" : ""}
                  </span>
                </>
              ) : (
                "À préciser"
              )}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-ink-muted">Voyageurs</dt>
            <dd className="text-right font-medium">{describeGuests(stay)}</dd>
          </div>
        </dl>

        <Button type="submit" size="lg" arrow className="mt-6 w-full" disabled={submitting}>
          {submitting ? "Envoi en cours…" : "Envoyer ma demande"}
        </Button>
        {status === "failed" ? (
          <p role="alert" className="mt-3 flex items-start gap-2 text-[0.9375rem] font-medium">
            <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden />
            Votre demande n&apos;a pas pu être envoyée. Réessayez dans un instant.
          </p>
        ) : null}
        <p className="mt-4 text-[0.875rem] leading-snug text-ink-muted">
          Une demande n&apos;est pas une réservation. Aucun paiement n&apos;est demandé.
        </p>
        {api.isDemo ? (
          <p className="mt-3 border-t border-charcoal/12 pt-3 text-[0.875rem] leading-snug text-ink-muted">
            <span className="font-medium text-charcoal">{site.demo.title}.</span> Cette demande ne
            sera transmise à personne.
          </p>
        ) : null}
      </aside>
    </form>
  );
}
