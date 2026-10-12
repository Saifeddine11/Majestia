"use client";

import Link from "next/link";
import { Check, Copy, Info, MessageCircle } from "lucide-react";
import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { channelLabels } from "@/content/labels";
import type { StayRequest } from "@/lib/api/types";
import { diffDays, formatRange } from "@/lib/search/dates";
import { describeGuests } from "@/lib/search/params";
import type { RequestCatalogItem } from "./RequestForm";
import { RequestStatus } from "./RequestStatus";

interface RequestReceiptProps {
  request: StayRequest;
  catalog: RequestCatalogItem[];
  destinationNames: Record<string, string>;
  /** Digits only. Empty when no WhatsApp number is configured. */
  whatsappNumber: string;
}

/**
 * Receipt of a submitted request.
 *
 * It confirms that the request was received, and nothing more: it is not a
 * booking, a quote or a payment. A demo request says plainly that it reached
 * no one, and offers no WhatsApp continuation, because WhatsApp must never be
 * the only place where a request exists.
 */
export function RequestReceipt({
  request,
  catalog,
  destinationNames,
  whatsappNumber,
}: RequestReceiptProps) {
  const [copied, setCopied] = useState(false);

  const properties = request.propertySlugs
    .map((slug) => catalog.find((item) => item.slug === slug))
    .filter((item): item is RequestCatalogItem => Boolean(item));
  const nights = diffDays(request.checkIn, request.checkOut);
  const channel = channelLabels[request.channel];
  const destination = request.destination ? (destinationNames[request.destination] ?? null) : null;
  const canContinueOnWhatsApp = whatsappNumber.length > 0 && !request.isDemo;
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Bonjour, je vous contacte au sujet de ma demande de séjour ${request.reference}.`,
  )}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(request.reference);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2400);
    } catch {
      // Clipboard access can be refused; the reference stays visible to copy by hand.
    }
  };

  return (
    <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-start lg:gap-8">
      <div className="surface-paper rounded-panel p-6 md:p-9">
        <span className="grid size-12 place-items-center rounded-full bg-slate-blue text-cream">
          <Check className="size-6" aria-hidden />
        </span>
        <h1 className="text-heading mt-6">Votre demande a bien été reçue.</h1>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <p className="rounded-[1.25rem] bg-blue-grey/55 px-5 py-3">
            <span className="block text-[0.8125rem] text-ink-muted">Référence de la demande</span>
            <span className="text-[1.375rem] font-medium tracking-[0.02em] tabular-nums">
              {request.reference}
            </span>
          </p>
          <button
            type="button"
            onClick={copy}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-charcoal/25 px-4 text-[0.9375rem] font-medium transition-colors hover:border-charcoal/45 hover:bg-charcoal/5"
          >
            {copied ? (
              <Check className="size-4" aria-hidden />
            ) : (
              <Copy className="size-4" aria-hidden />
            )}
            {copied ? "Référence copiée" : "Copier la référence"}
          </button>
          <span className="sr-only" role="status">
            {copied ? "Référence copiée" : ""}
          </span>
        </div>

        {request.isDemo ? (
          <p className="mt-6 flex items-start gap-3 rounded-[1.25rem] bg-sand/70 p-4 shadow-[inset_0_0_0_1.5px_rgba(31,41,46,0.3)]">
            <Info className="mt-0.5 size-5 shrink-0" aria-hidden />
            <span>
              <span className="font-medium">Démonstration.</span> Aucun service n&apos;est encore
              relié à ce site : cette demande est enregistrée dans ce navigateur uniquement et
              n&apos;a été transmise à personne.
            </span>
          </p>
        ) : null}

        <dl className="mt-8 divide-y divide-charcoal/10 border-y border-charcoal/10">
          <div className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr]">
            <dt className="text-ink-muted">{properties.length > 1 ? "Propriétés" : "Propriété"}</dt>
            <dd className="font-medium">
              {properties.length > 0 ? (
                <ul className="space-y-1">
                  {properties.map((item) => (
                    <li key={item.slug}>
                      <Link
                        href={`/properties/${item.slug}`}
                        className="underline-offset-4 hover:underline"
                      >
                        {item.name}
                      </Link>
                      <span className="font-normal text-ink-muted"> · {item.destinationName}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                "Sans propriété précise"
              )}
            </dd>
          </div>
          {destination && properties.length === 0 ? (
            <div className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr]">
              <dt className="text-ink-muted">Destination</dt>
              <dd className="font-medium">{destination}</dd>
            </div>
          ) : null}
          <div className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr]">
            <dt className="text-ink-muted">Dates</dt>
            <dd className="font-medium">
              {formatRange(request.checkIn, request.checkOut)}
              <span className="font-normal text-ink-muted">
                {" "}
                · {nights} nuit{nights > 1 ? "s" : ""}
              </span>
            </dd>
          </div>
          <div className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr]">
            <dt className="text-ink-muted">Voyageurs</dt>
            <dd className="font-medium">{describeGuests(request)}</dd>
          </div>
          <div className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr]">
            <dt className="text-ink-muted">Contact</dt>
            <dd className="font-medium [overflow-wrap:anywhere]">
              {request.name} · {channel.label} · {request.contact}
            </dd>
          </div>
          {request.message ? (
            <div className="grid gap-1 py-4 sm:grid-cols-[11rem_1fr]">
              <dt className="text-ink-muted">Message</dt>
              <dd className="whitespace-pre-line [overflow-wrap:anywhere]">{request.message}</dd>
            </div>
          ) : null}
        </dl>

        <h2 className="text-subheading mt-8">Prochaine étape</h2>
        <p className="text-lead mt-3 max-w-[58ch] text-ink-muted">
          Notre équipe vérifie la disponibilité et le tarif, puis revient vers vous {channel.via}.
          Conservez votre référence : elle permet de retrouver votre demande.
        </p>
        <p className="mt-3 max-w-[58ch] text-[0.9375rem] text-ink-muted">
          Cette demande n&apos;est pas une réservation et aucun paiement n&apos;a été effectué.
        </p>

        <div className="mt-7 flex flex-wrap gap-3">
          {canContinueOnWhatsApp ? (
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-13 items-center gap-2.5 rounded-full bg-slate-blue px-6 font-medium text-cream transition-colors hover:bg-slate-deep"
            >
              <MessageCircle className="size-5" aria-hidden />
              Poursuivre sur WhatsApp
              <span className="sr-only"> (nouvel onglet)</span>
            </a>
          ) : null}
          <ButtonLink href="/stays" variant="outline" size="lg">
            Voir d&apos;autres séjours
          </ButtonLink>
        </div>
      </div>

      <RequestStatus
        status={request.status}
        isDemo={request.isDemo}
        className="lg:sticky lg:top-28"
      />
    </div>
  );
}
