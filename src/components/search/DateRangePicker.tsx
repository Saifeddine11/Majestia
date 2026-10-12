"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { ISODate } from "@/lib/api/types";
import { cn } from "@/lib/cn";
import {
  addDays,
  addMonths,
  diffDays,
  formatDay,
  formatLong,
  formatMonth,
  formatRange,
  monthGrid,
  parts,
  shiftMonth,
  toISO,
  todayISO,
  weekdayIndex,
  WEEKDAYS_LONG,
  WEEKDAYS_SHORT,
} from "@/lib/search/dates";
import { MAX_NIGHTS } from "@/lib/search/params";

export interface DateRangeValue {
  checkIn: ISODate | null;
  checkOut: ISODate | null;
}

interface DateRangePickerProps {
  value: DateRangeValue;
  /** Which date the visitor came to choose. */
  initialFocus?: "start" | "end";
  months?: 1 | 2;
  onChange: (value: DateRangeValue) => void;
  /** Called once both dates are chosen. */
  onComplete?: () => void;
}

const navClass =
  "absolute top-0 z-10 grid size-11 place-items-center rounded-full text-charcoal transition-colors " +
  "hover:bg-white/70 disabled:text-charcoal/25 disabled:hover:bg-transparent";

const ARROWS: Record<string, number> = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 };

/**
 * Arrival and departure calendar.
 *
 * Keyboard: arrows move by day and week, Home and End go to the ends of the
 * week, Page Up and Page Down change month, Enter or Space chooses a date.
 * Past dates cannot be chosen. The backend remains the authority on which
 * dates are actually possible.
 */
export function DateRangePicker({
  value,
  initialFocus = "start",
  months = 1,
  onChange,
  onComplete,
}: DateRangePickerProps) {
  const { checkIn, checkOut } = value;
  const [today] = useState(todayISO);
  const [selecting, setSelecting] = useState<"start" | "end">(
    initialFocus === "end" && checkIn ? "end" : "start",
  );
  const [view, setView] = useState(() => {
    const anchor = parts(checkIn && checkIn >= today ? checkIn : today);
    return { year: anchor.year, month: anchor.month };
  });
  const [focused, setFocused] = useState<ISODate>(() => {
    const preferred = selecting === "end" ? (checkOut ?? checkIn) : checkIn;
    return preferred && preferred >= today ? preferred : today;
  });
  const [hovered, setHovered] = useState<ISODate | null>(null);
  const [note, setNote] = useState<string | null>(null);

  const grid = useRef<HTMLDivElement>(null);
  const focusPending = useRef(false);

  useEffect(() => {
    if (!focusPending.current) return;
    focusPending.current = false;
    grid.current?.querySelector<HTMLElement>(`[data-day="${focused}"]`)?.focus();
  }, [focused, view]);

  const visible = Array.from({ length: months }, (_, index) =>
    addMonths(view.year, view.month, index),
  );
  const firstVisible = toISO(view.year, view.month, 1);
  const afterVisible = addMonths(view.year, view.month, months);
  const lastVisible = addDays(toISO(afterVisible.year, afterVisible.month, 1), -1);
  const currentMonth = parts(today);
  const atEarliest = view.year === currentMonth.year && view.month === currentMonth.month;

  const previewEnd =
    selecting === "end" && checkIn && !checkOut && hovered && hovered > checkIn ? hovered : null;
  const rangeEnd = checkOut ?? previewEnd;

  const focusDay = (day: ISODate) => {
    const next = day < today ? today : day;
    if (next < firstVisible) {
      const target = parts(next);
      setView({ year: target.year, month: target.month });
    } else if (next > lastVisible) {
      const target = parts(next);
      setView(addMonths(target.year, target.month, -(months - 1)));
    }
    focusPending.current = true;
    setFocused(next);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    let next: ISODate | null = null;
    if (event.key in ARROWS) next = addDays(focused, ARROWS[event.key]);
    else if (event.key === "Home") next = addDays(focused, -weekdayIndex(focused));
    else if (event.key === "End") next = addDays(focused, 6 - weekdayIndex(focused));
    else if (event.key === "PageUp") next = shiftMonth(focused, -1);
    else if (event.key === "PageDown") next = shiftMonth(focused, 1);
    if (!next) return;
    event.preventDefault();
    focusDay(next);
  };

  const choose = (day: ISODate) => {
    if (day < today) return;
    setNote(null);
    if (selecting === "start" || !checkIn || day <= checkIn) {
      onChange({ checkIn: day, checkOut: null });
      setSelecting("end");
      return;
    }
    if (diffDays(checkIn, day) > MAX_NIGHTS) {
      setNote(`Un séjour ne peut pas dépasser ${MAX_NIGHTS} nuits.`);
      return;
    }
    onChange({ checkIn, checkOut: day });
    onComplete?.();
  };

  const shiftView = (delta: number) => {
    const next = addMonths(view.year, view.month, delta);
    setView(next);
    const firstOfView = toISO(next.year, next.month, 1);
    setFocused(firstOfView < today ? today : firstOfView);
  };

  let summary: string;
  if (checkIn && checkOut) {
    const nights = diffDays(checkIn, checkOut);
    summary = `${formatRange(checkIn, checkOut)} · ${nights} nuit${nights > 1 ? "s" : ""}`;
  } else if (checkIn) {
    summary = `Arrivée le ${formatDay(checkIn)}. Choisissez la date de départ.`;
  } else {
    summary = "Choisissez la date d'arrivée.";
  }

  return (
    <div>
      <div className="relative">
        <button
          type="button"
          className={cn(navClass, "left-0")}
          onClick={() => shiftView(-1)}
          disabled={atEarliest}
          aria-label="Mois précédent"
        >
          <ChevronLeft className="size-5" aria-hidden />
        </button>
        <button
          type="button"
          className={cn(navClass, "right-0")}
          onClick={() => shiftView(1)}
          aria-label="Mois suivant"
        >
          <ChevronRight className="size-5" aria-hidden />
        </button>

        <div
          ref={grid}
          onKeyDown={onKeyDown}
          onMouseLeave={() => setHovered(null)}
          className={cn("grid gap-x-7 gap-y-5", months === 2 && "grid-cols-2")}
        >
          {visible.map(({ year, month }) => (
            <div key={`${year}-${month}`} role="grid" aria-label={formatMonth(year, month)}>
              <div
                aria-hidden
                className="flex h-11 items-center justify-center text-[0.9375rem] font-medium first-letter:uppercase"
              >
                {formatMonth(year, month)}
              </div>
              <div role="row" className="mt-1 grid grid-cols-7 md:grid-cols-[repeat(7,2.75rem)]">
                {WEEKDAYS_SHORT.map((weekday, index) => (
                  <span
                    key={weekday}
                    role="columnheader"
                    aria-label={WEEKDAYS_LONG[index]}
                    className="grid h-8 place-items-center text-[0.8125rem] text-ink-muted"
                  >
                    {weekday}
                  </span>
                ))}
              </div>
              {monthGrid(year, month).map((week, weekIndex) => (
                <div
                  key={weekIndex}
                  role="row"
                  className="grid grid-cols-7 md:grid-cols-[repeat(7,2.75rem)]"
                >
                  {week.map((day, dayIndex) => {
                    if (!day) return <span key={dayIndex} role="gridcell" aria-hidden />;
                    const disabled = day < today;
                    const isStart = day === checkIn;
                    const isEnd = day === checkOut;
                    const isPreviewEnd = day === previewEnd;
                    const hasRange = Boolean(checkIn && rangeEnd && rangeEnd > checkIn);
                    const inRange = hasRange && day > checkIn! && day < rangeEnd!;
                    return (
                      <div
                        key={day}
                        role="gridcell"
                        aria-selected={isStart || isEnd}
                        className={cn(
                          "py-0.5",
                          inRange && "bg-blue-grey/55",
                          hasRange && isStart && "rounded-l-full bg-blue-grey/55",
                          hasRange && day === rangeEnd && "rounded-r-full bg-blue-grey/55",
                        )}
                      >
                        <button
                          type="button"
                          data-day={day}
                          data-autofocus={day === focused ? "" : undefined}
                          disabled={disabled}
                          tabIndex={day === focused ? 0 : -1}
                          aria-pressed={isStart || isEnd}
                          aria-label={`${formatLong(day)}${isStart ? ", date d'arrivée" : ""}${isEnd ? ", date de départ" : ""}`}
                          onClick={() => choose(day)}
                          onMouseEnter={() => setHovered(day)}
                          onFocus={() => setHovered(day)}
                          className={cn(
                            "grid aspect-square w-full place-items-center rounded-full text-[0.9375rem] tabular-nums transition-colors md:size-11",
                            disabled && "text-charcoal/30",
                            !disabled && !isStart && !isEnd && "hover:bg-white/85",
                            (isStart || isEnd) &&
                              "bg-slate-blue font-medium text-cream hover:bg-slate-deep",
                            isPreviewEnd && "bg-slate-blue/30",
                            day === today &&
                              !isStart &&
                              !isEnd &&
                              "shadow-[inset_0_0_0_1.5px_rgba(96,118,128,0.65)]",
                          )}
                        >
                          {parts(day).day}
                        </button>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex min-h-11 flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-charcoal/10 pt-3">
        <p role="status" className="text-[0.9375rem] text-ink-muted">
          {note ?? summary}
        </p>
        {checkIn ? (
          <button
            type="button"
            onClick={() => {
              onChange({ checkIn: null, checkOut: null });
              setSelecting("start");
              setNote(null);
            }}
            className="min-h-11 rounded-full px-3 text-[0.9375rem] font-medium text-charcoal/85 underline-offset-4 hover:underline"
          >
            Effacer les dates
          </button>
        ) : null}
      </div>
    </div>
  );
}
