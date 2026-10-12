import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { Wordmark } from "@/components/ui/Wordmark";
import { site } from "@/content/site";
import { api } from "@/lib/api";

const linkClass =
  "inline-flex min-h-11 items-center text-cream/90 underline-offset-4 transition-colors hover:text-cream hover:underline";

export async function PublicFooter() {
  const destinations = await api.listDestinations();
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark mt-24 px-2 pb-2 md:mt-36 md:px-3 md:pb-3">
      <div className="atmo-dusk rounded-[1.75rem] md:rounded-frame">
        <div className="container-page py-14 md:py-20">
          <div className="grid gap-12 lg:grid-cols-[1.1fr_2fr] lg:gap-20">
            <div>
              <Wordmark className="text-[2.5rem] md:text-[3.25rem]" />
              <p className="text-lead mt-5 max-w-xs text-cream/90">{site.footer.baseline}</p>
              <ButtonLink href={site.cta.href} variant="light" size="lg" arrow className="mt-8">
                {site.cta.label}
              </ButtonLink>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3">
              <nav aria-label={site.footer.explore}>
                <p className="eyebrow text-cream/90">{site.footer.explore}</p>
                <ul className="mt-3">
                  {site.nav.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className={linkClass}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <nav aria-label={site.footer.destinations}>
                <p className="eyebrow text-cream/90">{site.footer.destinations}</p>
                <ul className="mt-3">
                  {destinations.map((destination) => (
                    <li key={destination.slug}>
                      <Link href={`/destinations/${destination.slug}`} className={linkClass}>
                        {destination.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <nav aria-label={site.footer.information}>
                <p className="eyebrow text-cream/90">{site.footer.information}</p>
                <ul className="mt-3">
                  <li>
                    <Link href="/credits" className={linkClass}>
                      {site.footer.credits}
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>

          {api.isDemo ? (
            <div className="mt-14 rounded-panel border border-cream/20 bg-cream/8 p-5 md:p-6">
              <p className="eyebrow text-cream/90">{site.demo.title}</p>
              <p className="mt-2 max-w-3xl text-cream/90">{site.demo.body}</p>
            </div>
          ) : null}

          <p className="mt-10 border-t border-cream/20 pt-6 text-[0.875rem] text-cream/90">
            © {year} {site.footer.rights}
          </p>
        </div>
      </div>
    </footer>
  );
}
