import type { RequestCatalogItem } from "@/components/request/RequestForm";
import type { Destination, Property } from "@/lib/api/types";

/** The few property fields the request pages need, ready to pass to the browser. */
export function toRequestCatalog(
  properties: Property[],
  destinations: Destination[],
): RequestCatalogItem[] {
  const names = new Map(destinations.map((destination) => [destination.slug, destination.name]));
  return properties.map((property) => ({
    slug: property.slug,
    name: property.name,
    type: property.type,
    destination: property.destination,
    destinationName: names.get(property.destination) ?? property.destination,
    photo: property.photos[0],
  }));
}
