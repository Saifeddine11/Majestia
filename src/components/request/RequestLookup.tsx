"use client";

import { SearchX } from "lucide-react";
import { useEffect, useState } from "react";
import { Button, ButtonLink } from "@/components/ui/Button";
import { api } from "@/lib/api";
import type { StayRequest } from "@/lib/api/types";
import type { RequestCatalogItem } from "./RequestForm";
import { RequestReceipt } from "./RequestReceipt";

interface RequestLookupProps {
  reference: string;
  catalog: RequestCatalogItem[];
  destinationNames: Record<string, string>;
  whatsappNumber: string;
}

type Lookup =
  | { key: string; status: "found"; request: StayRequest }
  | { key: string; status: "missing" }
  | { key: string; status: "error" };

/** Loads a request by its reference and shows its receipt, or says why it cannot. */
export function RequestLookup({
  reference,
  catalog,
  destinationNames,
  whatsappNumber,
}: RequestLookupProps) {
  const [lookup, setLookup] = useState<Lookup | null>(null);
  const [attempt, setAttempt] = useState(0);
  const key = `${reference}#${attempt}`;
  const loading = lookup?.key !== key;

  useEffect(() => {
    let cancelled = false;
    api.getRequest(reference).then(
      (request) => {
        if (cancelled) return;
        setLookup(request ? { key, status: "found", request } : { key, status: "missing" });
      },
      () => {
        if (!cancelled) setLookup({ key, status: "error" });
      },
    );
    return () => {
      cancelled = true;
    };
  }, [reference, key]);

  if (loading) {
    return (
      <div aria-busy="true">
        <p className="sr-only" role="status">
          Chargement de votre demande
        </p>
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_23rem] lg:gap-8" aria-hidden>
          <div className="skeleton h-[34rem] rounded-panel" />
          <div className="skeleton h-72 rounded-panel" />
        </div>
      </div>
    );
  }

  if (lookup?.status === "found") {
    return (
      <RequestReceipt
        request={lookup.request}
        catalog={catalog}
        destinationNames={destinationNames}
        whatsappNumber={whatsappNumber}
      />
    );
  }

  const failed = lookup?.status === "error";
  return (
    <div
      role={failed ? "alert" : "status"}
      className="glass glass-warm mx-auto flex max-w-2xl flex-col items-start rounded-panel p-7 md:p-10"
    >
      <span className="grid size-12 place-items-center rounded-full bg-slate-blue text-cream">
        <SearchX className="size-5" aria-hidden />
      </span>
      <h1 className="text-subheading mt-6">
        {failed
          ? "Votre demande n'a pas pu être chargée."
          : "Aucune demande ne correspond à cette référence."}
      </h1>
      <p className="text-lead mt-3 text-ink-muted">
        {failed
          ? "Un problème est survenu. Vérifiez votre connexion, puis réessayez."
          : api.isDemo
            ? "En démonstration, une demande n'est conservée que dans le navigateur qui l'a envoyée."
            : "Vérifiez la référence, ou envoyez une nouvelle demande."}
      </p>
      <p className="mt-4 rounded-full bg-blue-grey/55 px-4 py-2 font-medium tabular-nums [overflow-wrap:anywhere]">
        {reference}
      </p>
      <div className="mt-7 flex flex-wrap gap-3">
        {failed ? (
          <Button onClick={() => setAttempt((value) => value + 1)}>Réessayer</Button>
        ) : null}
        <ButtonLink href="/stays" variant={failed ? "outline" : "primary"}>
          Voir les séjours
        </ButtonLink>
      </div>
    </div>
  );
}
