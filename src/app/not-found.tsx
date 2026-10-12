import type { Metadata } from "next";
import { NotFoundMessage } from "@/components/layout/NotFoundMessage";

export const metadata: Metadata = { title: "Page introuvable" };

/** Shown for any address that matches no route. Rendered without the public header. */
export default function NotFound() {
  return (
    <main>
      <NotFoundMessage />
    </main>
  );
}
