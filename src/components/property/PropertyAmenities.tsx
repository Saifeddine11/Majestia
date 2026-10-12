import {
  Car,
  ChefHat,
  ConciergeBell,
  Flame,
  Mountain,
  Snowflake,
  Sparkles,
  Sun,
  Trees,
  Utensils,
  Waves,
  Wifi,
  type LucideIcon,
} from "lucide-react";
import { amenityLabels } from "@/content/labels";
import type { AmenityKey } from "@/lib/api/types";

const ICONS: Record<AmenityKey, LucideIcon> = {
  pool: Waves,
  wifi: Wifi,
  air_conditioning: Snowflake,
  fireplace: Flame,
  terrace: Sun,
  garden: Trees,
  sea_view: Mountain,
  parking: Car,
  kitchen: Utensils,
  hammam: Sparkles,
  staff: ConciergeBell,
  breakfast: ChefHat,
  beach_access: Waves,
};

export function PropertyAmenities({ amenities }: { amenities: AmenityKey[] }) {
  return (
    <ul className="grid gap-x-6 gap-y-1 sm:grid-cols-2">
      {amenities.map((amenity) => {
        const Icon = ICONS[amenity];
        return (
          <li
            key={amenity}
            className="flex min-h-12 items-center gap-3 border-b border-charcoal/10"
          >
            <Icon className="size-5 shrink-0 text-slate-blue" aria-hidden />
            {amenityLabels[amenity]}
          </li>
        );
      })}
    </ul>
  );
}
