/**
 * DEMO DATA — photo library.
 *
 * Every photograph here is a freely licensed image from Wikimedia Commons,
 * stored in `public/demo/`. Destination photographs show the real places.
 * Property photographs are illustrations only: they do not show Majestia
 * inventory and must be replaced with real photography before launch.
 *
 * `photo-library.json` holds dimensions, alternative text and the credit
 * required by each licence. Credits are published on `/credits`.
 */
import type { Photo } from "@/lib/api/types";
import library from "./photo-library.json";

export type DemoPhotoId = keyof typeof library;

export const demoPhotoIds = Object.keys(library) as DemoPhotoId[];

/**
 * @param illustration true for property photographs, which stand in for
 * inventory that does not exist yet and are labelled as such in the interface.
 */
export function demoPhoto(id: DemoPhotoId, illustration: boolean): Photo {
  const entry = library[id];
  return {
    src: entry.src,
    width: entry.width,
    height: entry.height,
    alt: entry.alt,
    isDemo: illustration,
    credit: entry.credit,
  };
}

export function allDemoPhotos(): Photo[] {
  return demoPhotoIds.map((id) => demoPhoto(id, !id.startsWith("dest-")));
}
