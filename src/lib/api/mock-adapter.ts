/**
 * DEMO ADAPTER — implements `MajestiaApi` from local fixtures.
 *
 * Nothing here talks to a server. Availability and prices are invented,
 * and a submitted request is stored in the visitor's own browser only: it
 * reaches no one at Majestia. `isDemo` is true so the interface says so.
 *
 * Demo-only switch, for testing states on the results and request pages:
 *   ?demo=error   the call fails
 *   ?demo=empty   the search returns nothing
 *   ?demo=slow    the search takes four seconds
 */
import { demoCalendars } from "@/data/mock/availability";
import { demoDestinations } from "@/data/mock/destinations";
import { demoProperties } from "@/data/mock/properties";
import { addDays, diffDays, parts, toISO, todayISO } from "@/lib/search/dates";
import type {
  AvailabilityInfo,
  DateRange,
  ISODate,
  MajestiaApi,
  PriceInfo,
  Property,
  RequestInput,
  SearchResult,
  StayRequest,
} from "./types";

const DEMO_LATENCY_MS = 450;
const DEMO_SLOW_MS = 4000;
const STORAGE_KEY = "majestia.demo.requests.v1";
const ALTERNATIVE_WINDOW_DAYS = 45;

type DemoFlag = "error" | "empty" | "slow" | null;

function demoFlag(): DemoFlag {
  if (typeof window === "undefined") return null;
  const value = new URLSearchParams(window.location.search).get("demo");
  return value === "error" || value === "empty" || value === "slow" ? value : null;
}

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function overlaps(a: DateRange, b: DateRange): boolean {
  return a.checkIn < b.checkOut && b.checkIn < a.checkOut;
}

/** Blocked periods of a demo calendar, or `null` when the property has none. */
function blockedRanges(slug: string, today: ISODate): DateRange[] | null {
  const calendar = demoCalendars[slug];
  if (!calendar || calendar.mode === "unknown") return null;
  const { year, month } = parts(today);
  const anchor = toISO(year, month + 1, 1);
  return calendar.blocked.map(([from, to]) => ({
    checkIn: addDays(anchor, from),
    checkOut: addDays(anchor, to),
  }));
}

function isFree(range: DateRange, blocked: DateRange[]): boolean {
  return !blocked.some((period) => overlaps(range, period));
}

/** The nearest free stay of the same length before and after the requested one. */
function nearbyAlternatives(range: DateRange, blocked: DateRange[], today: ISODate): DateRange[] {
  const length = diffDays(range.checkIn, range.checkOut);
  const found: DateRange[] = [];
  for (const direction of [-1, 1] as const) {
    for (let shift = 1; shift <= ALTERNATIVE_WINDOW_DAYS; shift += 1) {
      const checkIn = addDays(range.checkIn, direction * shift);
      if (checkIn < today) break;
      const candidate = { checkIn, checkOut: addDays(checkIn, length) };
      if (isFree(candidate, blocked)) {
        found.push(candidate);
        break;
      }
    }
  }
  return found;
}

function availabilityFor(slug: string, range: DateRange | null): AvailabilityInfo {
  if (!range) return { status: "unknown", alternatives: [] };
  const today = todayISO();
  const blocked = blockedRanges(slug, today);
  if (!blocked) return { status: "unknown", alternatives: [] };
  if (isFree(range, blocked)) return { status: "open_to_request", alternatives: [] };
  return { status: "unavailable", alternatives: nearbyAlternatives(range, blocked, today) };
}

function priceFor(property: Property, range: DateRange | null): PriceInfo {
  if (property.price.kind === "from_per_night" && range) {
    const nights = diffDays(range.checkIn, range.checkOut);
    return {
      kind: "stay_estimate",
      amount: property.price.amount * nights,
      currency: "EUR",
      nights,
    };
  }
  return property.price;
}

/* ------------------------------------------------------------------
   Demo requests: kept in this browser only.
   ------------------------------------------------------------------ */
const memoryRequests = new Map<string, StayRequest>();

function readStoredRequests(): Record<string, StayRequest> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === "object" ? (parsed as Record<string, StayRequest>) : {};
  } catch {
    return {};
  }
}

function storeRequest(request: StayRequest): void {
  memoryRequests.set(request.reference, request);
  try {
    const all = readStoredRequests();
    all[request.reference] = request;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // Storage can be unavailable (private browsing). The in-memory copy still
    // serves the receipt for the rest of this visit.
  }
}

/** A reference that cannot be mistaken for a real one. */
function demoReference(): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
  const bytes = new Uint8Array(6);
  window.crypto.getRandomValues(bytes);
  return `MAJ-DEMO-${Array.from(bytes, (byte) => alphabet[byte % alphabet.length]).join("")}`;
}

export const mockApi: MajestiaApi = {
  isDemo: true,

  async listDestinations() {
    return demoDestinations;
  },

  async getDestination(slug) {
    return demoDestinations.find((destination) => destination.slug === slug) ?? null;
  },

  async listProperties() {
    return demoProperties;
  },

  async getProperty(slug) {
    return demoProperties.find((property) => property.slug === slug) ?? null;
  },

  async search(query) {
    const flag = demoFlag();
    await wait(flag === "slow" ? DEMO_SLOW_MS : DEMO_LATENCY_MS);
    if (flag === "error") throw new Error("Demo adapter: simulated search failure");
    if (flag === "empty") return [];

    const range: DateRange | null =
      query.checkIn && query.checkOut ? { checkIn: query.checkIn, checkOut: query.checkOut } : null;

    const results: SearchResult[] = demoProperties
      .filter((property) => !query.destination || property.destination === query.destination)
      .filter((property) => property.capacity >= query.guests)
      .filter((property) => property.bedrooms >= query.bedrooms)
      .filter((property) => query.types.length === 0 || query.types.includes(property.type))
      .filter((property) =>
        query.amenities.every((amenity) => property.amenities.includes(amenity)),
      )
      .map((property) => ({
        property,
        price: priceFor(property, range),
        availability: availabilityFor(property.slug, range),
      }));

    // Stays that cannot be requested for these dates go last.
    return results.sort(
      (a, b) =>
        Number(a.availability.status === "unavailable") -
        Number(b.availability.status === "unavailable"),
    );
  },

  async getAvailability(slug, range) {
    await wait(DEMO_LATENCY_MS);
    return availabilityFor(slug, range);
  },

  async getPriceSummary(slug, range) {
    const property = demoProperties.find((item) => item.slug === slug);
    if (!property) return { kind: "on_request" };
    return priceFor(property, range);
  },

  async createRequest(input: RequestInput) {
    if (typeof window === "undefined") {
      throw new Error("Demo adapter: requests can only be created in the browser");
    }
    await wait(DEMO_LATENCY_MS * 2);
    if (demoFlag() === "error") throw new Error("Demo adapter: simulated request failure");

    const request: StayRequest = {
      ...input,
      reference: demoReference(),
      status: "received",
      createdAt: new Date().toISOString(),
      isDemo: true,
    };
    storeRequest(request);
    return request;
  },

  async getRequest(reference) {
    await wait(DEMO_LATENCY_MS);
    return memoryRequests.get(reference) ?? readStoredRequests()[reference] ?? null;
  },
};
