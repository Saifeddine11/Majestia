"use client";

import { Plus } from "lucide-react";
import { useId, useState } from "react";
import { faq } from "@/content/faq";
import { home } from "@/content/home";
import { cn } from "@/lib/cn";

/**
 * Frequently asked questions as an accordion. Each question is a button that
 * states whether its answer is open; closed answers are removed from the tab
 * order and from assistive technology.
 */
export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const baseId = useId();

  return (
    <section className="container-page pt-24 md:pt-36" aria-labelledby="faq-title">
      <div className="grid gap-10 lg:grid-cols-[1fr_1.45fr] lg:gap-20">
        <header className="lg:sticky lg:top-28 lg:self-start" data-reveal>
          <p className="eyebrow text-charcoal/80">{home.faq.eyebrow}</p>
          <h2 id="faq-title" className="text-heading mt-4 max-w-[16ch]">
            {home.faq.title}
          </h2>
        </header>

        <ul className="flex flex-col gap-3">
          {faq.map((item, index) => {
            const open = openIndex === index;
            const buttonId = `${baseId}-question-${index}`;
            const panelId = `${baseId}-answer-${index}`;
            return (
              <li key={item.question} className="surface-tint rounded-[1.5rem]" data-reveal>
                <h3>
                  <button
                    type="button"
                    id={buttonId}
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpenIndex(open ? null : index)}
                    className="flex min-h-16 w-full items-center justify-between gap-4 rounded-[1.5rem] px-5 py-4 text-left text-[1.0625rem] font-medium md:px-7 md:text-[1.125rem]"
                  >
                    {item.question}
                    <span
                      aria-hidden
                      className={cn(
                        "grid size-9 shrink-0 place-items-center rounded-full transition-[background-color,color,rotate] duration-300 ease-soft",
                        open ? "rotate-45 bg-slate-blue text-cream" : "bg-charcoal/8",
                      )}
                    >
                      <Plus className="size-4" />
                    </span>
                  </button>
                </h3>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  inert={!open}
                  className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-soft",
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <div className="overflow-hidden">
                    <p className="max-w-[62ch] px-5 pb-6 text-ink-muted md:px-7">{item.answer}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
