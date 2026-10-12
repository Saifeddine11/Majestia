import type { Metadata } from "next";
import { RequestLookup } from "@/components/request/RequestLookup";
import { api } from "@/lib/api";
import { destinationNames } from "@/lib/catalog";
import { toRequestCatalog } from "@/lib/request-catalog";

interface PageProps {
  params: Promise<{ reference: string }>;
}

export const metadata: Metadata = {
  title: "Votre demande",
  robots: { index: false, follow: false },
};

function safeDecode(value: string): string {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export default async function RequestReferencePage({ params }: PageProps) {
  const { reference } = await params;
  const [properties, destinations] = await Promise.all([
    api.listProperties(),
    api.listDestinations(),
  ]);
  // No number is assumed: without this variable, no WhatsApp action is shown.
  const whatsappNumber = (process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "").replace(/\D/g, "");

  return (
    <div className="container-page pt-28 md:pt-36">
      <RequestLookup
        reference={safeDecode(reference)}
        catalog={toRequestCatalog(properties, destinations)}
        destinationNames={destinationNames(destinations)}
        whatsappNumber={whatsappNumber}
      />
    </div>
  );
}
