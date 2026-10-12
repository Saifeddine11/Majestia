import { Info } from "lucide-react";
import { home } from "@/content/home";

/** The four steps from search to request, as a numbered row. */
export function ProcessSection() {
  const copy = home.process;
  return (
    <section className="container-page pt-24 md:pt-36" aria-labelledby="process-title">
      <header className="max-w-3xl" data-reveal>
        <p className="eyebrow text-charcoal/80">{copy.eyebrow}</p>
        <h2 id="process-title" className="text-heading mt-4">
          {copy.title}
        </h2>
      </header>

      <ol className="mt-10 grid gap-4 sm:grid-cols-2 md:mt-14 md:gap-5 xl:grid-cols-4">
        {copy.steps.map((step, index) => (
          <li
            key={step.title}
            className="surface-tint relative rounded-[1.75rem] p-6 md:p-7"
            data-reveal
          >
            <span
              aria-hidden
              className="block text-[3.5rem] leading-none font-medium tracking-[-0.04em] text-slate-blue"
            >
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3 className="mt-8 text-[1.25rem] leading-tight font-medium tracking-[-0.01em]">
              <span className="sr-only">Étape {index + 1} : </span>
              {step.title}
            </h3>
            <p className="mt-2 text-ink-muted">{step.body}</p>
          </li>
        ))}
      </ol>

      <p
        className="mt-6 inline-flex items-start gap-3 rounded-[1.5rem] bg-blue-grey/55 px-5 py-4 text-[0.9375rem] md:items-center md:rounded-full"
        data-reveal
      >
        <Info className="mt-0.5 size-5 shrink-0 text-slate-deep md:mt-0" aria-hidden />
        {copy.note}
      </p>
    </section>
  );
}
