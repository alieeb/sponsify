import type { NextConfig } from "next";

const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  // Static export: `npm run build` writes a plain HTML/JS site to ./out that any host can serve.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // Set NEXT_PUBLIC_BASE_PATH when the site lives in a sub-folder (e.g. GitHub Pages).
  ...(basePath ? { basePath } : {}),
};

export default nextConfig;
