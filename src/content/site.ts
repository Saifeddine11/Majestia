/**
 * Site-wide copy. French, kept apart from components.
 */
export const site = {
  name: "Majestia",
  title: "Majestia — Séjours et conciergerie de propriétés d'exception",
  description:
    "Riads, villas et maisons de caractère à Marrakech, Tanger, Marbella et Phuket. Composez votre demande de séjour en ligne.",
  nav: [
    { label: "Séjours", href: "/stays" },
    { label: "Destinations", href: "/destinations" },
    { label: "La conciergerie", href: "/#conciergerie" },
  ],
  cta: { label: "Trouver mon séjour", href: "/stays" },
  footer: {
    baseline: "Des lieux remarquables. Un séjour qui vous ressemble.",
    explore: "Explorer",
    destinations: "Destinations",
    information: "Informations",
    credits: "Crédits photographiques",
    rights: "Majestia. Tous droits réservés.",
  },
  demo: {
    badge: "Démo",
    title: "Version de démonstration",
    body: "Ce site fonctionne avec des données de démonstration. Les propriétés, les tarifs et les disponibilités affichés sont fictifs, et les demandes envoyées ne sont transmises à personne.",
    photoLabel: "Photo d'illustration",
  },
} as const;
