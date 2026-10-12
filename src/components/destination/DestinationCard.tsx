import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PhotoImage } from "@/components/ui/PhotoImage";
import type { Destination } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { plural } from "@/lib/format";

interface DestinationCardProps {
  destination: Destination;
  /** Number of properties in the data for this destination. */
  count: number;
  sizes: string;
  className?: string;
}

/** A destination as a photograph with a glass country tag and a text footer. */
export function DestinationCard({ destination, count, sizes, className }: DestinationCardProps) {
  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className={cn(
        "group on-dark relative isolate block overflow-hidden rounded-[1.75rem] bg-slate-deep",
        className,
      )}
    >
      <PhotoImage
        photo={destination.hero}
        sizes={sizes}
        className="saturate-[0.84] transition-transform duration-[900ms] ease-soft motion-safe:group-hover:scale-[1.04]"
      />
      <span aria-hidden className="veil-card absolute inset-0" />
      <span className="glass glass-dark absolute top-4 left-4 rounded-full px-3.5 py-1.5 text-[0.8125rem] font-medium">
        {destination.country}
      </span>
      <span className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4 text-cream">
        <span className="min-w-0">
          <span className="text-subheading block">{destination.name}</span>
          <span className="mt-1 block text-[0.9375rem] leading-snug text-cream/90">
            {destination.tagline}
          </span>
          <span className="mt-2 block text-[0.875rem] text-cream/90">
            {plural(count, "séjour")}
          </span>
        </span>
        <span
          aria-hidden
          className="grid size-11 shrink-0 place-items-center rounded-full bg-cream text-charcoal transition-transform duration-300 ease-soft group-hover:translate-x-1"
        >
          <ArrowRight className="size-5" />
        </span>
      </span>
    </Link>
  );
}
