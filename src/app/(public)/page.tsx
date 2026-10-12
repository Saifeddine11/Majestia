import { DestinationSection } from "@/components/destination/DestinationSection";
import { HomeHero } from "@/components/hero/HomeHero";
import { ClosingSection } from "@/components/home/ClosingSection";
import { ConciergeSection } from "@/components/home/ConciergeSection";
import { FAQ } from "@/components/home/FAQ";
import { ProcessSection } from "@/components/home/ProcessSection";
import { SelectionSection } from "@/components/home/SelectionSection";
import { api } from "@/lib/api";
import { countByDestination, destinationNames, toDestinationOptions } from "@/lib/catalog";

const CENTRED = { mobile: "50% 50%", desktop: "50% 50%" };

export default async function HomePage() {
  const [destinations, properties] = await Promise.all([
    api.listDestinations(),
    api.listProperties(),
  ]);

  const scenes = destinations.map((destination) => ({
    slug: destination.slug,
    name: destination.name,
    country: destination.country,
    tagline: destination.tagline,
    href: `/destinations/${destination.slug}`,
    photo: destination.hero,
    focus: destination.hero.focus ?? CENTRED,
  }));
  const featured = properties.filter((property) => property.featured).slice(0, 3);
  const conciergePhoto = featured[0]?.photos.at(-1) ?? destinations[0]?.secondary;
  const closingPhoto = destinations[2]?.secondary ?? destinations[0]?.secondary;

  return (
    <>
      <HomeHero scenes={scenes} destinations={toDestinationOptions(destinations)} />
      <DestinationSection destinations={destinations} counts={countByDestination(properties)} />
      <SelectionSection properties={featured} destinationNames={destinationNames(destinations)} />
      {conciergePhoto ? <ConciergeSection photo={conciergePhoto} /> : null}
      <ProcessSection />
      <FAQ />
      {closingPhoto ? <ClosingSection photo={closingPhoto} /> : null}
    </>
  );
}
