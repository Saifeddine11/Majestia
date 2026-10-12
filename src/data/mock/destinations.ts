/**
 * DEMO DATA — destinations.
 *
 * The four destinations come from the brief. The descriptive copy below is
 * placeholder editorial text and needs validation by Majestia.
 */
import type { Destination } from "@/lib/api/types";
import { demoPhoto } from "./photos";

export const demoDestinations: Destination[] = [
  {
    slug: "marrakech",
    name: "Marrakech",
    country: "Maroc",
    tagline: "La ville ocre, entre médina et palmeraie",
    intro: [
      "Derrière les portes de la médina, les riads s'ouvrent sur des patios silencieux, des bassins et des terrasses tournées vers l'Atlas.",
      "Marrakech se vit à deux rythmes : l'animation des souks le jour, la fraîcheur des jardins et la lumière des lanternes le soir.",
    ],
    highlights: ["Riads avec patio et bassin", "Toits-terrasses", "Médina et palmeraie"],
    hero: {
      ...demoPhoto("dest-marrakech", false),
      focus: { mobile: "30% 55%", desktop: "50% 58%" },
    },
    secondary: demoPhoto("dest-marrakech-2", false),
  },
  {
    slug: "tanger",
    name: "Tanger",
    country: "Maroc",
    tagline: "Entre Atlantique et Méditerranée",
    intro: [
      "Ville blanche posée sur le détroit, Tanger mêle les ruelles de la kasbah, les terrasses face à la baie et la lumière changeante de deux mers.",
      "On y séjourne dans des maisons de caractère, à quelques pas des remparts ou face à l'horizon.",
    ],
    highlights: ["Maisons de la kasbah", "Vues sur le détroit", "Cap Spartel"],
    hero: { ...demoPhoto("dest-tanger", false), focus: { mobile: "24% 50%", desktop: "40% 55%" } },
    secondary: demoPhoto("dest-tanger-2", false),
  },
  {
    slug: "marbella",
    name: "Marbella",
    country: "Espagne",
    tagline: "La douceur andalouse, face à la mer",
    intro: [
      "Entre la Concha et la Méditerranée, Marbella aligne ses villas, ses jardins et ses places blanchies à la chaux.",
      "De la vieille ville à Puerto Banús, les journées s'étirent au soleil, de la piscine à la plage.",
    ],
    highlights: ["Villas avec piscine", "Vieille ville andalouse", "Puerto Banús"],
    hero: {
      ...demoPhoto("dest-marbella", false),
      focus: { mobile: "50% 50%", desktop: "50% 42%" },
    },
    secondary: demoPhoto("dest-marbella-2", false),
  },
  {
    slug: "phuket",
    name: "Phuket",
    country: "Thaïlande",
    tagline: "Criques, lagunes et jardins tropicaux",
    intro: [
      "Sur la mer d'Andaman, Phuket déroule ses criques de sable, ses lagunes et ses collines couvertes de jungle.",
      "Les villas s'y ouvrent largement sur l'extérieur : bassins à débordement, pavillons et terrasses au-dessus de l'eau.",
    ],
    highlights: ["Villas avec bassin à débordement", "Lagunes et plages", "Jardins tropicaux"],
    hero: { ...demoPhoto("dest-phuket", false), focus: { mobile: "32% 60%", desktop: "50% 62%" } },
    secondary: demoPhoto("dest-phuket-2", false),
  },
];
