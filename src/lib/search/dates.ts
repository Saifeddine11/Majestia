import type { ISODate } from "@/lib/api/types";

/**
 * Calendar-date helpers. Dates are `YYYY-MM-DD` strings and all arithmetic is
 * done in UTC, so a date never shifts with the visitor's time zone.
 */

const ISO_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DAY_MS = 86_400_000;

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

export function toISO(year: number, month: number, day: number): ISODate {
  const date = new Date(Date.UTC(year, month, day));
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

export function isISODate(value: unknown): value is ISODate {
  if (typeof value !== "string" || !ISO_PATTERN.test(value)) return false;
  const [year, month, day] = value.split("-").map(Number);
  return toISO(year, month - 1, day) === value;
}

function toUTC(iso: ISODate): Date {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export function parts(iso: ISODate): { year: number; month: number; day: number } {
  const [year, month, day] = iso.split("-").map(Number);
  return { year, month: month - 1, day };
}

/** Today in the visitor's own calendar. */
export function todayISO(): ISODate {
  const now = new Date();
  return toISO(now.getFullYear(), now.getMonth(), now.getDate());
}

export function addDays(iso: ISODate, days: number): ISODate {
  const { year, month, day } = parts(iso);
  return toISO(year, month, day + days);
}

/** Whole days from `from` to `to`; negative when `to` is earlier. */
export function diffDays(from: ISODate, to: ISODate): number {
  return Math.round((toUTC(to).getTime() - toUTC(from).getTime()) / DAY_MS);
}

export function addMonths(
  year: number,
  month: number,
  delta: number,
): { year: number; month: number } {
  const date = new Date(Date.UTC(year, month + delta, 1));
  return { year: date.getUTCFullYear(), month: date.getUTCMonth() };
}

/** 0 for Monday through 6 for Sunday. */
export function weekdayIndex(iso: ISODate): number {
  return (toUTC(iso).getUTCDay() + 6) % 7;
}

/** The same day number in another month, clamped to that month's length. */
export function shiftMonth(iso: ISODate, delta: number): ISODate {
  const { year, month, day } = parts(iso);
  const target = addMonths(year, month, delta);
  const lastDay = new Date(Date.UTC(target.year, target.month + 1, 0)).getUTCDate();
  return toISO(target.year, target.month, Math.min(day, lastDay));
}

/** Weeks of a month, Monday first. Cells outside the month are `null`. */
export function monthGrid(year: number, month: number): (ISODate | null)[][] {
  const first = new Date(Date.UTC(year, month, 1));
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const lead = (first.getUTCDay() + 6) % 7;
  const cells: (ISODate | null)[] = Array.from({ length: lead }, () => null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(toISO(year, month, day));
  while (cells.length % 7 !== 0) cells.push(null);
  const weeks: (ISODate | null)[][] = [];
  for (let index = 0; index < cells.length; index += 7) weeks.push(cells.slice(index, index + 7));
  return weeks;
}

export const WEEKDAYS_SHORT = ["lun.", "mar.", "mer.", "jeu.", "ven.", "sam.", "dim."] as const;
export const WEEKDAYS_LONG = [
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
  "dimanche",
] as const;

const LOCALE = "fr-FR";
const dayMonth = new Intl.DateTimeFormat(LOCALE, {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});
const dayMonthYear = new Intl.DateTimeFormat(LOCALE, {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});
const longDate = new Intl.DateTimeFormat(LOCALE, {
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
const monthYear = new Intl.DateTimeFormat(LOCALE, {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

/** "12 mars" */
export function formatDay(iso: ISODate): string {
  return dayMonth.format(toUTC(iso));
}

/** "12 mars 2027" */
export function formatDayYear(iso: ISODate): string {
  return dayMonthYear.format(toUTC(iso));
}

/** "vendredi 12 mars 2027" */
export function formatLong(iso: ISODate): string {
  return longDate.format(toUTC(iso));
}

/** "mars 2027" */
export function formatMonth(year: number, month: number): string {
  return monthYear.format(new Date(Date.UTC(year, month, 1)));
}

/** "12 – 19 mars 2027", or "28 févr. – 4 mars 2027" across months. */
export function formatRange(checkIn: ISODate, checkOut: ISODate): string {
  const from = parts(checkIn);
  const to = parts(checkOut);
  if (from.year === to.year && from.month === to.month) {
    return `${from.day} – ${formatDayYear(checkOut)}`;
  }
  if (from.year === to.year) return `${formatDay(checkIn)} – ${formatDayYear(checkOut)}`;
  return `${formatDayYear(checkIn)} – ${formatDayYear(checkOut)}`;
}
