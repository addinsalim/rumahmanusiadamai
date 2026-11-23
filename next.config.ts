import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    allowedDevOrigins: ["*.trycloudflare.com", "*.loca.lt", "localhost:3000"]
  }
};

export default nextConfig;
