import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75],
    // Adds 1440 and 2560 to the defaults, so a request just above 2048 px is
    // not answered with a 3840 px image.
    deviceSizes: [640, 750, 828, 1080, 1200, 1440, 1920, 2048, 2560, 3840],
  },
};

export default nextConfig;
