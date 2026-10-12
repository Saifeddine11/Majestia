"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { useState, useSyncExternalStore } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Sheet } from "@/components/ui/Sheet";
import { Wordmark } from "@/components/ui/Wordmark";
import { site } from "@/content/site";
import { cn } from "@/lib/cn";

/** Routes whose first screen is a photograph: the header starts light over it. */
const PHOTO_ROUTES = [/^\/$/, /^\/destinations\/[^/]+$/];
/** Routes set on a cool photograph backdrop: the scrolled bar matches it instead of being warm. */
const COOL_ROUTES = [/^\/stays(\/|$)/];
const SCROLL_THRESHOLD = 24;

function subscribeToScroll(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

/** Re-renders only when the page crosses the threshold, not on every scroll frame. */
function useScrolledPast(threshold: number): boolean {
  return useSyncExternalStore(
    subscribeToScroll,
    () => window.scrollY > threshold,
    () => false,
  );
}

function isCurrent(href: string, pathname: string): boolean {
  if (href === "/stays") return pathname.startsWith("/stays") || pathname.startsWith("/properties");
  if (href === "/destinations") return pathname.startsWith("/destinations");
  return false;
}

export function PublicHeader({ isDemo }: { isDemo: boolean }) {
  const pathname = usePathname();
  const scrolled = useScrolledPast(SCROLL_THRESHOLD);
  const [menuOpen, setMenuOpen] = useState(false);

  const overPhoto = PHOTO_ROUTES.some((route) => route.test(pathname));
  const cool = COOL_ROUTES.some((route) => route.test(pathname));
  /** Light text while the header sits on a photograph; dark once it becomes a glass bar. */
  const light = overPhoto && !scrolled;

  return (
    <header className={cn("fixed inset-x-0 top-0 z-50", light ? "on-dark" : "on-light")}>
      <div className="px-2 pt-2 md:px-3 md:pt-3">
        <div
          className={cn(
            "relative flex h-14 items-center justify-between gap-3 rounded-full pr-1.5 pl-5 transition-colors duration-300 md:h-16 md:pr-2.5 md:pl-7",
            scrolled ? (cool ? "glass glass-bar-cool" : "glass glass-bar") : "border border-transparent",
            light ? "text-cream" : "text-charcoal",
          )}
        >
          <Link
            href="/"
            className="flex min-h-11 items-center gap-2.5 rounded-full"
            aria-label="Majestia, accueil"
          >
            <Wordmark />
            {isDemo ? (
              <span className="rounded-full border border-current/40 px-2 py-1 text-[0.8125rem] leading-none">
                {site.demo.badge}
              </span>
            ) : null}
          </Link>

          <nav
            aria-label="Navigation principale"
            className="absolute left-1/2 hidden -translate-x-1/2 lg:block"
          >
            <ul
              className={cn(
                "flex items-center gap-1 rounded-full p-1",
                !scrolled && (light ? "glass glass-dark" : "glass glass-light"),
              )}
            >
              {site.nav.map((item) => {
                const current = isCurrent(item.href, pathname);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      aria-current={current ? "page" : undefined}
                      className={cn(
                        "inline-flex min-h-11 items-center rounded-full px-4 text-[0.9375rem] font-medium whitespace-nowrap transition-colors duration-200",
                        current
                          ? light
                            ? "bg-cream text-charcoal"
                            : "bg-slate-blue text-cream"
                          : light
                            ? "hover:bg-cream/18"
                            : "hover:bg-charcoal/8",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden md:block">
              <ButtonLink href={site.cta.href} variant={light ? "light" : "primary"}>
                {site.cta.label}
              </ButtonLink>
            </div>
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Ouvrir le menu"
              aria-haspopup="dialog"
              aria-expanded={menuOpen}
              className={cn(
                "grid size-11 place-items-center rounded-full border transition-colors lg:hidden",
                light
                  ? "border-cream/45 bg-charcoal/20 hover:bg-charcoal/35"
                  : "border-charcoal/20 hover:bg-charcoal/8",
              )}
            >
              <Menu className="size-5" aria-hidden />
            </button>
          </div>
        </div>
      </div>

      <Sheet open={menuOpen} onClose={() => setMenuOpen(false)} title="Menu" side="right">
        <nav aria-label="Navigation principale">
          <ul className="flex flex-col">
            {site.nav.map((item) => {
              const current = isCurrent(item.href, pathname);
              return (
                <li key={item.href} className="border-b border-charcoal/10">
                  <Link
                    href={item.href}
                    aria-current={current ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                    className={cn(
                      "text-subheading flex min-h-16 items-center justify-between py-3",
                      current && "text-slate-blue",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <ButtonLink
          href={site.cta.href}
          size="lg"
          arrow
          className="mt-8 w-full"
          onClick={() => setMenuOpen(false)}
        >
          {site.cta.label}
        </ButtonLink>
        {isDemo ? (
          <p className="mt-8 text-[0.9375rem] text-ink-muted">
            <span className="font-medium text-charcoal">{site.demo.title}.</span> {site.demo.body}
          </p>
        ) : null}
      </Sheet>
    </header>
  );
}
