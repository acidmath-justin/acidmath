/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.shopify.com" },
      { protocol: "https", hostname: "*.myshopify.com" },
      // Demo-only: the mock catalog (lib/mockData.ts) uses placehold.co for
      // placeholder art. Remove this once real product photography is wired up.
      { protocol: "https", hostname: "placehold.co" },
    ],
  },
  // three.js / R3F ship ESM + some packages need transpiling under the App Router
  transpilePackages: ["three"],
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      type: "asset/source",
    });
    return config;
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          // Explicitly allow camera + WebXR for this origin — the Mirror's
          // Real Mirror (webcam) and AR Mode (WebXR) tabs depend on both,
          // so a stricter default here would silently break those features.
          { key: "Permissions-Policy", value: "camera=(self), xr-spatial-tracking=(self)" },
        ],
      },
    ];
  },
};

export default nextConfig;
