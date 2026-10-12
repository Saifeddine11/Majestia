/**
 * DEMO DATA — availability.
 *
 * Invented calendars that let the interface show its three availability
 * states. They are not connected to Airbnb, to any calendar, or to anything
 * real. Real availability must come from the Majestia backend.
 *
 * Blocked periods are day offsets from the first day of next month, so the
 * demo keeps working whatever the current date is. Each pair is
 * `[first blocked night, first free day]`.
 */
export type DemoCalendar =
  | { mode: "calendar"; blocked: readonly (readonly [number, number])[] }
  /** No calendar at all: every question about dates answers "unknown". */
  | { mode: "unknown" };

export const demoCalendars: Record<string, DemoCalendar> = {
  "riad-serail": {
    mode: "calendar",
    blocked: [
      [3, 10],
      [24, 29],
    ],
  },
  "riad-cannelle": { mode: "calendar", blocked: [[12, 19]] },
  "dar-emeraude": { mode: "unknown" },
  "maison-du-detroit": {
    mode: "calendar",
    blocked: [
      [0, 6],
      [34, 41],
    ],
  },
  "dar-kasbah": { mode: "unknown" },
  "villa-los-naranjos": { mode: "calendar", blocked: [[8, 22]] },
  "casa-de-la-plaza": {
    mode: "calendar",
    blocked: [
      [15, 18],
      [40, 47],
    ],
  },
  "villa-laguna": {
    mode: "calendar",
    blocked: [
      [5, 12],
      [50, 64],
    ],
  },
  "villa-horizon": { mode: "calendar", blocked: [[20, 27]] },
};
