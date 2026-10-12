import type { Metadata } from "next";
import { Suspense } from "react";
import { ResultsSkeleton } from "@/components/stays/ResultStates";
import { StaysBackdrop } from "@/components/stays/StaysBackdrop";
import { StaysExplorer } from "@/components/stays/StaysExplorer";
import { api } from "@/lib/api";
import { toDestinationOptions } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Séjours",
  description:
    "Riads, villas et maisons de caractère à demander à Marrakech, Tanger, Marbella et Phuket.",
};

function StaysFallback() {
  return (
    <div className="container-page pt-28 md:pt-36">
      <p className="eyebrow text-charcoal/80">Séjours</p>
      <h1 className="text-heading mt-3">Tous les séjours</h1>
      <p className="text-lead mt-3 text-ink-muted">Recherche en cours…</p>
      <div className="mt-24">
        <ResultsSkeleton />
      </div>
    </div>
  );
}

export default async function StaysPage() {
  const destinations = await api.listDestinations();
  return (
    <div className="scene">
      <StaysBackdrop />
      <Suspense fallback={<StaysFallback />}>
        <StaysExplorer destinations={toDestinationOptions(destinations)} />
      </Suspense>
    </div>
  );
}
