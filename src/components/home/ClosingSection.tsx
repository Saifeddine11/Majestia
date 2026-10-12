import { ButtonLink } from "@/components/ui/Button";
import { PhotoImage } from "@/components/ui/PhotoImage";
import { home } from "@/content/home";
import type { Photo } from "@/lib/api/types";

/** Closing invitation: a framed photograph with a warm glass card. */
export function ClosingSection({ photo }: { photo: Photo }) {
  const copy = home.closing;
  return (
    <section className="mt-24 px-2 md:mt-36 md:px-3" aria-labelledby="closing-title">
      <div className="relative isolate flex min-h-[30rem] items-end overflow-hidden rounded-[1.75rem] bg-slate-deep p-3 md:min-h-[36rem] md:rounded-frame md:p-8">
        <PhotoImage
          photo={photo}
          sizes="(min-width: 768px) 100vw, 150vw"
          className="-z-10 saturate-[0.84]"
        />
        <div className="glass glass-sheet w-full max-w-xl rounded-panel p-6 md:p-9" data-reveal>
          <h2 id="closing-title" className="text-heading">
            {copy.title}
          </h2>
          <p className="text-lead mt-4 text-ink-muted">{copy.body}</p>
          <ButtonLink href={copy.cta.href} size="lg" arrow className="mt-7">
            {copy.cta.label}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
