import { ButtonLink } from "@/components/ui/Button";

/** Shared body of the "page not found" screens. */
export function NotFoundMessage() {
  return (
    <div className="container-page flex min-h-[70svh] flex-col items-start justify-center pt-28 pb-10">
      <p className="eyebrow text-charcoal/80">Page introuvable</p>
      <h1 className="text-heading mt-4 max-w-[18ch]">Cette adresse ne mène nulle part.</h1>
      <p className="text-lead mt-4 max-w-xl text-ink-muted">
        La page demandée n&apos;existe pas ou n&apos;existe plus. Reprenez depuis l&apos;accueil ou
        parcourez les séjours.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <ButtonLink href="/" size="lg" arrow>
          Retour à l&apos;accueil
        </ButtonLink>
        <ButtonLink href="/stays" size="lg" variant="outline">
          Voir les séjours
        </ButtonLink>
      </div>
    </div>
  );
}
