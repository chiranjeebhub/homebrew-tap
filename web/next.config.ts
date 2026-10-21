import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Fully static site: `next build` writes plain HTML to ./out for Vercel to serve.
  output: "export",
  images: { unoptimized: true },
}

export default nextConfig
