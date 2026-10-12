import Image from "next/image";

/**
 * Decorative photograph behind the stays page. Purely visual: it is hidden
 * from assistive technology and takes no pointer events. The image and the
 * colour veil are separate layers; the page content is a sibling, so no
 * blur or opacity ever touches it.
 */
export function StaysBackdrop() {
  return (
    <div className="scene-backdrop" aria-hidden="true">
      <div className="scene-backdrop-image">
        <Image
          src="/backgrounds/stays-pool.jpg"
          alt=""
          fill
          sizes="100vw"
          quality={60}
          preload
          draggable={false}
          className="object-cover"
        />
      </div>
      <div className="scene-backdrop-veil" />
    </div>
  );
}
