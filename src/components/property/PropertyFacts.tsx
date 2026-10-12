import { Bath, BedDouble, Home, Users, type LucideIcon } from "lucide-react";
import { propertyTypeLabels } from "@/content/labels";
import type { Property } from "@/lib/api/types";

/** The four key facts of a property, as stated by the data source. */
export function PropertyFacts({ property }: { property: Property }) {
  const facts: Array<{ icon: LucideIcon; label: string; value: string }> = [
    { icon: Users, label: "Voyageurs", value: String(property.capacity) },
    { icon: BedDouble, label: "Chambres", value: String(property.bedrooms) },
    { icon: Bath, label: "Salles de bain", value: String(property.bathrooms) },
    { icon: Home, label: "Type", value: propertyTypeLabels[property.type] },
  ];

  return (
    <dl className="surface-tint grid grid-cols-2 gap-y-5 rounded-panel p-5 sm:grid-cols-4 md:p-6">
      {facts.map(({ icon: Icon, label, value }) => (
        <div key={label} className="px-2">
          <Icon className="size-5 text-slate-blue" aria-hidden />
          <dt className="mt-3 text-[0.875rem] text-ink-muted">{label}</dt>
          <dd className="text-[1.375rem] leading-tight font-medium tracking-[-0.01em]">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
