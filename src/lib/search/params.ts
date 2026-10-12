import type { AmenityKey, DateRange, ISODate, PropertyType, SearchQuery } from "@/lib/api/types";
import { diffDays, formatRange, isISODate, todayISO } from "./dates";

/**
 * The single implementation of search state.
 * The hero dock, the results page, the property page and the request form all
 * read and write the same URL parameters through this module.
 */

export interface SearchState {
  destination: string | null;
  checkIn: ISODate | null;
  checkOut: ISODate | null;
  adults: number;
  children: number;
}

export interface SearchFilters {
  bedrooms: number;
  types: PropertyType[];
  amenities: AmenityKey[];
}

export const GUEST_LIMITS = {
  adults: { min: 1, max: 16 },
  children: { min: 0, max: 10 },
} as const;

export const MAX_NIGHTS = 90;

export const DEFAULT_SEARCH: SearchState = {
  destination: null,
  checkIn: null,
  checkOut: null,
  adults: 2,
  children: 0,
};

export const DEFAULT_FILTERS: SearchFilters = { bedrooms: 0, types: [], amenities: [] };

export const PROPERTY_TYPES: readonly PropertyType[] = ["riad", "villa", "maison"];

/** Amenities offered as filters. A subset of all amenity keys. */
export const FILTER_AMENITIES: readonly AmenityKey[] = [
  "pool",
  "sea_view",
  "terrace",
  "garden",
  "air_conditioning",
  "staff",
];

const PARAM = {
  destination: "destination",
  checkIn: "checkin",
  checkOut: "checkout",
  adults: "adults",
  children: "children",
  bedrooms: "bedrooms",
  type: "type",
  amenity: "amenity",
} as const;

const SLUG_PATTERN = /^[a-z0-9-]{1,48}$/;

type RecordSource = Record<string, string | string[] | undefined>;
export type ParamSource =
  { get(name: string): string | null; getAll(name: string): string[] } | RecordSource;

function isAccessor(
  source: ParamSource,
): source is { get(name: string): string | null; getAll(name: string): string[] } {
  return typeof (source as { get?: unknown }).get === "function";
}

function readAll(source: ParamSource, key: string): string[] {
  if (isAccessor(source)) return source.getAll(key);
  const value = source[key];
  if (value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

function readOne(source: ParamSource, key: string): string | null {
  return readAll(source, key)[0] ?? null;
}

function clampInt(raw: string | null, min: number, max: number, fallback: number): number {
  if (raw === null || !/^\d{1,3}$/.test(raw)) return fallback;
  return Math.min(max, Math.max(min, Number(raw)));
}

/** True when the range is in order, not in the past and not unreasonably long. */
export function isValidRange(
  checkIn: ISODate,
  checkOut: ISODate,
  today: ISODate = todayISO(),
): boolean {
  if (!isISODate(checkIn) || !isISODate(checkOut)) return false;
  if (checkIn < today) return false;
  const length = diffDays(checkIn, checkOut);
  return length >= 1 && length <= MAX_NIGHTS;
}

export function parseSearch(source: ParamSource, today: ISODate = todayISO()): SearchState {
  const destination = readOne(source, PARAM.destination);
  const checkIn = readOne(source, PARAM.checkIn);
  const checkOut = readOne(source, PARAM.checkOut);
  const validDates =
    checkIn !== null && checkOut !== null && isValidRange(checkIn, checkOut, today);

  return {
    destination: destination !== null && SLUG_PATTERN.test(destination) ? destination : null,
    checkIn: validDates ? checkIn : null,
    checkOut: validDates ? checkOut : null,
    adults: clampInt(
      readOne(source, PARAM.adults),
      GUEST_LIMITS.adults.min,
      GUEST_LIMITS.adults.max,
      DEFAULT_SEARCH.adults,
    ),
    children: clampInt(
      readOne(source, PARAM.children),
      GUEST_LIMITS.children.min,
      GUEST_LIMITS.children.max,
      DEFAULT_SEARCH.children,
    ),
  };
}

export function parseFilters(source: ParamSource): SearchFilters {
  const types = readAll(source, PARAM.type).filter((value): value is PropertyType =>
    (PROPERTY_TYPES as readonly string[]).includes(value),
  );
  const amenities = readAll(source, PARAM.amenity).filter((value): value is AmenityKey =>
    (FILTER_AMENITIES as readonly string[]).includes(value),
  );
  return {
    bedrooms: clampInt(readOne(source, PARAM.bedrooms), 0, 10, 0),
    types: Array.from(new Set(types)),
    amenities: Array.from(new Set(amenities)),
  };
}

export function toSearchParams(
  state: SearchState,
  filters: SearchFilters = DEFAULT_FILTERS,
  extra: Record<string, string | string[]> = {},
): URLSearchParams {
  const params = new URLSearchParams();
  if (state.destination) params.set(PARAM.destination, state.destination);
  if (state.checkIn && state.checkOut) {
    params.set(PARAM.checkIn, state.checkIn);
    params.set(PARAM.checkOut, state.checkOut);
  }
  if (state.adults !== DEFAULT_SEARCH.adults) params.set(PARAM.adults, String(state.adults));
  if (state.children !== DEFAULT_SEARCH.children)
    params.set(PARAM.children, String(state.children));
  if (filters.bedrooms > 0) params.set(PARAM.bedrooms, String(filters.bedrooms));
  filters.types.forEach((type) => params.append(PARAM.type, type));
  filters.amenities.forEach((amenity) => params.append(PARAM.amenity, amenity));
  Object.entries(extra).forEach(([key, value]) => {
    (Array.isArray(value) ? value : [value]).forEach((item) => params.append(key, item));
  });
  return params;
}

export function buildHref(
  pathname: string,
  state: SearchState,
  filters: SearchFilters = DEFAULT_FILTERS,
  extra: Record<string, string | string[]> = {},
): string {
  const query = toSearchParams(state, filters, extra).toString();
  return query ? `${pathname}?${query}` : pathname;
}

export function totalGuests(state: Pick<SearchState, "adults" | "children">): number {
  return state.adults + state.children;
}

export function rangeOf(state: Pick<SearchState, "checkIn" | "checkOut">): DateRange | null {
  return state.checkIn && state.checkOut
    ? { checkIn: state.checkIn, checkOut: state.checkOut }
    : null;
}

export function countActiveFilters(filters: SearchFilters): number {
  return (filters.bedrooms > 0 ? 1 : 0) + filters.types.length + filters.amenities.length;
}

export function toQuery(state: SearchState, filters: SearchFilters = DEFAULT_FILTERS): SearchQuery {
  return {
    destination: state.destination,
    checkIn: state.checkIn,
    checkOut: state.checkOut,
    guests: totalGuests(state),
    bedrooms: filters.bedrooms,
    types: filters.types,
    amenities: filters.amenities,
  };
}

/** "2 voyageurs", "1 voyageur", "4 voyageurs dont 2 enfants" */
export function describeGuests(state: Pick<SearchState, "adults" | "children">): string {
  const total = totalGuests(state);
  const base = `${total} voyageur${total > 1 ? "s" : ""}`;
  if (state.children === 0) return base;
  return `${base} dont ${state.children} enfant${state.children > 1 ? "s" : ""}`;
}

export function describeDates(state: Pick<SearchState, "checkIn" | "checkOut">): string | null {
  return state.checkIn && state.checkOut ? formatRange(state.checkIn, state.checkOut) : null;
}
