import Image from "next/image";
import { site } from "@/content/site";
import type { Photo } from "@/lib/api/types";
import { cn } from "@/lib/cn";

interface PhotoImageProps {
  photo: Photo;
  /** Required: tells the browser how wide the image is drawn. */
  sizes: string;
  /** Set on the one image that is the largest element above the fold. */
  eager?: boolean;
  className?: string;
  /** Shows the "Photo d'illustration" label when the photograph is a demo stand-in. */
  showLabel?: boolean;
  labelClassName?: string;
}

/**
 * A photograph that fills its parent. The parent reserves the space (a fixed
 * aspect ratio or height), so nothing shifts while the image loads.
 */
export function PhotoImage({
  photo,
  sizes,
  eager = false,
  className,
  showLabel = false,
  labelClassName,
}: PhotoImageProps) {
  return (
    <>
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        sizes={sizes}
        preload={eager}
        loading={eager ? "eager" : "lazy"}
        fetchPriority={eager ? "high" : "auto"}
        className={cn("object-cover", className)}
      />
      {showLabel && photo.isDemo ? <IllustrationLabel className={labelClassName} /> : null}
    </>
  );
}

export function IllustrationLabel({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "pointer-events-none absolute bottom-2.5 left-2.5 z-10 rounded-full bg-charcoal/55 px-2.5 py-1 text-[0.8125rem] leading-none text-cream",
        className,
      )}
    >
      {site.demo.photoLabel}
    </span>
  );
}
