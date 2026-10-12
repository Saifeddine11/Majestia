import type { DestinationOption } from "@/components/search/DestinationField";
import type { Destination, Property } from "@/lib/api/types";

/** Small derivations shared by the pages. They only restate the data. */

export function countByDestination(properties: Property[]): Record<string, number> {
  return properties.reduce<Record<string, number>>((counts, property) => {
    counts[property.destination] = (counts[property.destination] ?? 0) + 1;
    return counts;
  }, {});
}

export function destinationNames(destinations: Destination[]): Record<string, string> {
  return Object.fromEntries(
    destinations.map((destination) => [destination.slug, destination.name]),
  );
}

export function toDestinationOptions(destinations: Destination[]): DestinationOption[] {
  return destinations.map((destination) => ({
    slug: destination.slug,
    name: destination.name,
    country: destination.country,
    photo: destination.hero,
  }));
}
