import { priceLabels } from "@/content/labels";
import type { PriceInfo } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import { formatEuro } from "@/lib/format";

interface PriceLabelProps {
  price: PriceInfo;
  size?: "md" | "lg";
  /** Adds the sentence explaining that an estimate is not a quote. */
  showNote?: boolean;
  className?: string;
}

/**
 * Shows a price in one of four clearly different forms. None of them is a
 * final quote: only the proposal sent by the team is.
 */
export function PriceLabel({ price, size = "md", showNote = false, className }: PriceLabelProps) {
  const amountClass = cn(
    "font-medium tracking-[-0.01em] tabular-nums",
    size === "lg" ? "text-[1.75rem]" : "text-[1.25rem]",
  );
  const captionClass = "block text-[0.8125rem] leading-snug text-ink-muted";
  const wordClass = cn("font-medium", size === "lg" ? "text-[1.375rem]" : "text-[1.0625rem]");

  if (price.kind === "from_per_night") {
    return (
      <p className={className}>
        <span className={captionClass}>{priceLabels.fromPerNight}</span>
        <span className={amountClass}>{formatEuro(price.amount)}</span>{" "}
        <span className="text-[0.9375rem] text-ink-muted">{priceLabels.perNight}</span>
      </p>
    );
  }

  if (price.kind === "stay_estimate") {
    return (
      <div className={className}>
        <p>
          <span className={captionClass}>
            {priceLabels.stayEstimate} · {price.nights} nuit{price.nights > 1 ? "s" : ""}
          </span>
          <span className={amountClass}>{formatEuro(price.amount)}</span>
        </p>
        {showNote ? (
          <p className="mt-1.5 text-[0.8125rem] leading-snug text-ink-muted">
            {priceLabels.estimateNote}
          </p>
        ) : null}
      </div>
    );
  }

  return (
    <p className={cn(wordClass, className)}>
      {price.kind === "on_request" ? priceLabels.onRequest : priceLabels.customQuote}
    </p>
  );
}
