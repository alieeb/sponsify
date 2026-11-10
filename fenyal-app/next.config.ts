import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: `npm run build` writes a plain HTML/JS site to ./out that any host can serve.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
