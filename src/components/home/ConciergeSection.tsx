import { Compass, KeyRound, MessageCircle, Plane, type LucideIcon } from "lucide-react";
import { PhotoImage } from "@/components/ui/PhotoImage";
import { home } from "@/content/home";
import type { Photo } from "@/lib/api/types";

const ICONS: LucideIcon[] = [Plane, KeyRound, Compass, MessageCircle];

/**
 * The concierge, on a deep slate band: photograph and glass note on one side,
 * services on the other. Anchor target of "La conciergerie" in the navigation.
 */
export function ConciergeSection({ photo }: { photo: Photo }) {
  const copy = home.concierge;
  return (
    <section
      id="conciergerie"
      className="on-dark mt-24 px-2 md:mt-36 md:px-3"
      aria-labelledby="concierge-title"
    >
      <div className="atmo-dusk rounded-[1.75rem] py-14 md:rounded-frame md:py-24">
        <div className="container-page grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:gap-20">
          <div className="relative" data-reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem] bg-slate-deep sm:aspect-[16/11] lg:aspect-[4/5]">
              <PhotoImage
                photo={photo}
                sizes="(min-width: 1024px) 70vw, (min-width: 640px) 94vw, 160vw"
                showLabel
              />
            </div>
            <p className="glass glass-light absolute right-3 -bottom-6 max-w-[17rem] rounded-[1.5rem] p-4 text-[0.9375rem] leading-snug sm:right-6 lg:-right-8">
              {copy.note}
            </p>
          </div>

          <div className="pt-4 lg:pt-0">
            <div data-reveal>
              <p className="eyebrow text-cream/90">{copy.eyebrow}</p>
              <h2 id="concierge-title" className="text-heading mt-4 max-w-[18ch]">
                {copy.title}
              </h2>
              <p className="text-lead mt-5 max-w-xl text-cream/90">{copy.body}</p>
            </div>
            <ul className="mt-10 grid gap-3 sm:grid-cols-2">
              {copy.services.map((service, index) => {
                const Icon = ICONS[index % ICONS.length];
                return (
                  <li
                    key={service.title}
                    className="rounded-[1.5rem] border border-cream/18 bg-cream/8 p-5"
                    data-reveal
                  >
                    <Icon className="size-5 text-champagne" aria-hidden />
                    <h3 className="mt-4 text-[1.0625rem] font-medium">{service.title}</h3>
                    <p className="mt-1.5 text-[0.9375rem] leading-snug text-cream/90">
                      {service.body}
                    </p>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
