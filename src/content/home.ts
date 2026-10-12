/**
 * Homepage copy. French.
 *
 * The concierge services below are described in general terms because the
 * real service list was not available. They need validation by Majestia.
 * No response time is promised anywhere, since none has been configured.
 */
export const home = {
  hero: {
    eyebrow: "Conciergerie de propriétés d'exception",
    titleLines: ["Des lieux", "remarquables."],
    subtitle: "Un séjour qui vous ressemble.",
    body: "Riads, villas et maisons de caractère à Marrakech, Tanger, Marbella et Phuket. Composez votre demande en ligne ; notre équipe prend le relais.",
    primary: { label: "Trouver mon séjour", href: "/stays" },
    secondary: { label: "Découvrir les destinations", href: "/destinations" },
    sceneLink: "Explorer",
  },
  destinations: {
    eyebrow: "Destinations",
    title: "Quatre destinations, un même sens du lieu.",
    body: "Chaque destination a sa lumière, son architecture et son rythme. Choisissez la vôtre.",
    link: "Toutes les destinations",
  },
  selection: {
    eyebrow: "Sélection",
    title: "Quelques séjours à découvrir.",
    body: "Un aperçu des propriétés proposées. Indiquez vos dates pour savoir lesquelles peuvent être demandées.",
    link: "Voir tous les séjours",
  },
  concierge: {
    eyebrow: "La conciergerie",
    title: "Une équipe attentive, avant et pendant votre séjour.",
    body: "Majestia ne se limite pas à proposer des lieux. Notre conciergerie prépare votre arrivée et reste votre interlocutrice sur place.",
    note: "Les services dépendent de la propriété et de la destination. Ils sont précisés avec votre demande.",
    services: [
      {
        title: "Avant l'arrivée",
        body: "Transferts, courses et préparation de la maison, sur demande.",
      },
      {
        title: "Sur place",
        body: "Ménage, cuisine à domicile et intendance, selon la propriété.",
      },
      {
        title: "Expériences",
        body: "Tables, excursions et activités organisées selon vos envies.",
      },
      {
        title: "Un seul interlocuteur",
        body: "Votre demande et sa référence vous suivent du premier échange au départ.",
      },
    ],
  },
  process: {
    eyebrow: "Comment ça marche",
    title: "De la recherche à la demande, en quatre étapes.",
    steps: [
      {
        title: "Explorez",
        body: "Choisissez une destination, vos dates et le nombre de voyageurs.",
      },
      {
        title: "Sélectionnez",
        body: "Retenez une ou plusieurs propriétés qui vous plaisent.",
      },
      {
        title: "Envoyez votre demande",
        body: "Un formulaire court suffit. Votre demande reçoit une référence.",
      },
      {
        title: "Poursuivez avec notre équipe",
        body: "Disponibilité, tarif et services sont confirmés par la conciergerie, par le canal que vous préférez.",
      },
    ],
    note: "Une demande n'est pas une réservation. Aucun paiement n'est demandé sur ce site.",
  },
  faq: {
    eyebrow: "Questions fréquentes",
    title: "Ce qu'il faut savoir avant d'envoyer une demande.",
  },
  closing: {
    title: "Votre prochain séjour commence par une demande.",
    body: "Dites-nous où, quand et avec qui. Nous nous occupons du reste avec vous.",
    cta: { label: "Trouver mon séjour", href: "/stays" },
  },
} as const;
