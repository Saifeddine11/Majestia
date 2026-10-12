import type {
  AmenityKey,
  AvailabilityStatus,
  ContactChannel,
  PropertyType,
  RequestStatus,
} from "@/lib/api/types";

/**
 * Interface labels. French.
 *
 * Availability and status wording is deliberately cautious: nothing here
 * states that dates are guaranteed, that a booking is confirmed, or that a
 * payment has been made.
 */

export const amenityLabels: Record<AmenityKey, string> = {
  pool: "Piscine ou bassin",
  wifi: "Wi-Fi",
  air_conditioning: "Climatisation",
  fireplace: "Cheminée",
  terrace: "Terrasse",
  garden: "Jardin",
  sea_view: "Vue mer",
  parking: "Stationnement",
  kitchen: "Cuisine équipée",
  hammam: "Hammam",
  staff: "Personnel de maison",
  breakfast: "Petit-déjeuner",
  beach_access: "Accès plage",
};

export const propertyTypeLabels: Record<PropertyType, string> = {
  riad: "Riad",
  villa: "Villa",
  maison: "Maison",
};

export const priceLabels = {
  fromPerNight: "À partir de",
  perNight: "/ nuit",
  stayEstimate: "Estimation du séjour",
  estimateNote: "Indicatif, hors services. Le montant définitif figure dans notre proposition.",
  onRequest: "Tarif sur demande",
  customQuote: "Devis personnalisé",
} as const;

export const availabilityLabels: Record<AvailabilityStatus, { label: string; hint: string }> = {
  open_to_request: {
    label: "Dates ouvertes à la demande",
    hint: "Sous réserve de confirmation par notre équipe.",
  },
  unavailable: {
    label: "Indisponible à ces dates",
    hint: "D'autres dates peuvent convenir.",
  },
  unknown: {
    label: "Disponibilité à confirmer",
    hint: "Notre équipe la vérifie avec votre demande.",
  },
};

export const requestStatusLabels: Record<RequestStatus, { label: string; description: string }> = {
  received: {
    label: "Demande reçue",
    description: "Votre demande est enregistrée.",
  },
  in_review: {
    label: "Demande à l'étude",
    description: "Notre équipe vérifie la disponibilité et le tarif.",
  },
  answered: {
    label: "Proposition envoyée",
    description: "Une proposition vous a été adressée.",
  },
  closed: {
    label: "Demande clôturée",
    description: "Cette demande n'est plus en cours.",
  },
};

export const channelLabels: Record<ContactChannel, { label: string; field: string; via: string }> =
  {
    whatsapp: { label: "WhatsApp", field: "Numéro WhatsApp", via: "par WhatsApp" },
    email: { label: "E-mail", field: "Adresse e-mail", via: "par e-mail" },
    phone: { label: "Téléphone", field: "Numéro de téléphone", via: "par téléphone" },
  };
