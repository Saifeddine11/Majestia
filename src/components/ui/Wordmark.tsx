import { cn } from "@/lib/cn";

/**
 * Text wordmark. No Majestia logo file was supplied, so the name is set in
 * the interface typeface. Replace with the official logo when available.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("text-[1.375rem] leading-none font-medium tracking-[-0.02em]", className)}>
      Majestia
    </span>
  );
}
