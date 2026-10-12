/**
 * Domain types and the data boundary of the public website.
 *
 * `MajestiaApi` is the only seam between the interface and the data source.
 * The backend stays authoritative for availability, price, date validation,
 * quote validity, request status, payment status and booking confirmation.
 * Nothing in the interface may state those as fact on its own.
 */

/** Calendar date, `YYYY-MM-DD`. */
export type ISODate = string;

export interface DateRange {
  checkIn: ISODate;
  checkOut: ISODate;
}

export interface PhotoCredit {
  title: string;
  author: string;
  license: string;
  licenseUrl: string;
  sourceUrl: string;
}

export interface Photo {
  src: string;
  width: number;
  height: number;
  alt: string;
  /** True when the photograph illustrates demo inventory rather than the real property. */
  isDemo: boolean;
  credit?: PhotoCredit;
  /** Focal point as CSS `object-position`, for tall and for wide crops. */
  focus?: { mobile: string; desktop: string };
}

export interface Destination {
  slug: string;
  name: string;
  country: string;
  tagline: string;
  intro: string[];
  highlights: string[];
  hero: Photo;
  secondary: Photo;
}

export type PropertyType = "riad" | "villa" | "maison";

export type AmenityKey =
  | "pool"
  | "wifi"
  | "air_conditioning"
  | "fireplace"
  | "terrace"
  | "garden"
  | "sea_view"
  | "parking"
  | "kitchen"
  | "hammam"
  | "staff"
  | "breakfast"
  | "beach_access";

/**
 * The four price presentations the interface distinguishes.
 * None of them is a final quote.
 */
export type PriceInfo =
  | { kind: "from_per_night"; amount: number; currency: "EUR" }
  | { kind: "stay_estimate"; amount: number; currency: "EUR"; nights: number }
  | { kind: "on_request" }
  | { kind: "custom_quote" };

/**
 * `open_to_request`: the dates can be requested; the team still confirms.
 * `unavailable`: the dates cannot be requested; alternatives may be offered.
 * `unknown`: no availability information for these dates or this property.
 */
export type AvailabilityStatus = "open_to_request" | "unavailable" | "unknown";

export interface AvailabilityInfo {
  status: AvailabilityStatus;
  alternatives: DateRange[];
}

export interface Property {
  slug: string;
  name: string;
  destination: string;
  type: PropertyType;
  summary: string;
  description: string[];
  capacity: number;
  bedrooms: number;
  bathrooms: number;
  amenities: AmenityKey[];
  rules: string[];
  checkInInfo: string;
  checkOutInfo: string;
  price: PriceInfo;
  photos: Photo[];
  featured: boolean;
}

export interface SearchQuery {
  destination: string | null;
  checkIn: ISODate | null;
  checkOut: ISODate | null;
  guests: number;
  bedrooms: number;
  types: PropertyType[];
  amenities: AmenityKey[];
}

export interface SearchResult {
  property: Property;
  price: PriceInfo;
  availability: AvailabilityInfo;
}

export type ContactChannel = "whatsapp" | "email" | "phone";

export interface RequestInput {
  propertySlugs: string[];
  destination: string | null;
  checkIn: ISODate;
  checkOut: ISODate;
  adults: number;
  children: number;
  name: string;
  channel: ContactChannel;
  /** E-mail address or phone number, matching `channel`. */
  contact: string;
  message: string;
}

/** Set by the backend only. The interface never advances a status itself. */
export type RequestStatus = "received" | "in_review" | "answered" | "closed";

export interface StayRequest extends RequestInput {
  reference: string;
  status: RequestStatus;
  createdAt: string;
  /** True when the request was created by the demo adapter and reached no one. */
  isDemo: boolean;
}

export interface MajestiaApi {
  /** True when the adapter serves demonstration data. The interface says so. */
  readonly isDemo: boolean;

  listDestinations(): Promise<Destination[]>;
  getDestination(slug: string): Promise<Destination | null>;
  listProperties(): Promise<Property[]>;
  getProperty(slug: string): Promise<Property | null>;

  search(query: SearchQuery): Promise<SearchResult[]>;
  getAvailability(slug: string, range: DateRange | null): Promise<AvailabilityInfo>;
  getPriceSummary(slug: string, range: DateRange | null): Promise<PriceInfo>;

  createRequest(input: RequestInput): Promise<StayRequest>;
  getRequest(reference: string): Promise<StayRequest | null>;
}
