import type { Metadata } from "next";
import { Suspense } from "react";
import { RequestForm } from "@/components/request/RequestForm";
import { api } from "@/lib/api";
import { toDestinationOptions } from "@/lib/catalog";
import { toRequestCatalog } from "@/lib/request-catalog";

export const metadata: Metadata = {
  title: "Votre demande de séjour",
  description: "Envoyez une demande de séjour complète à la conciergerie Majestia.",
};

export default async function RequestPage() {
  const [properties, destinations] = await Promise.all([
    api.listProperties(),
    api.listDestinations(),
  ]);

  return (
    <div className="container-page pt-28 md:pt-36">
      <header className="max-w-3xl">
        <p className="eyebrow text-charcoal/80">Demande</p>
        <h1 className="text-heading mt-3">Votre demande de séjour</h1>
        <p className="text-lead mt-4 text-ink-muted">
          Quelques informations suffisent. Notre équipe vérifie ensuite la disponibilité et le
          tarif, puis revient vers vous.
        </p>
      </header>
      <Suspense fallback={<div className="skeleton mt-10 h-[40rem] rounded-panel" aria-hidden />}>
        <RequestForm
          catalog={toRequestCatalog(properties, destinations)}
          destinations={toDestinationOptions(destinations)}
        />
      </Suspense>
    </div>
  );
}
