import { Suspense, type ReactNode } from "react";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { PublicHeader } from "@/components/layout/PublicHeader";
import { ShortlistSummary } from "@/components/stays/ShortlistSummary";
import { MotionProvider } from "@/components/ui/MotionProvider";
import { ScrollReveals } from "@/components/ui/ScrollReveals";
import { api } from "@/lib/api";

/**
 * Layout of the public website only. It lives in its own route group so that
 * any other area of the product can sit beside it without sharing this shell.
 */
export default async function PublicLayout({ children }: { children: ReactNode }) {
  const properties = await api.listProperties();
  const catalog = properties.map((property) => ({
    slug: property.slug,
    name: property.name,
    photo: property.photos[0],
  }));

  return (
    <MotionProvider>
      <a
        href="#contenu"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-full focus:bg-charcoal focus:px-5 focus:py-3 focus:text-cream"
      >
        Aller au contenu
      </a>
      <PublicHeader isDemo={api.isDemo} />
      <main id="contenu" tabIndex={-1} className="outline-none">
        {children}
      </main>
      <PublicFooter />
      <Suspense fallback={null}>
        <ShortlistSummary catalog={catalog} />
      </Suspense>
      <ScrollReveals />
    </MotionProvider>
  );
}
