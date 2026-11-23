import type { NextConfig } from "next";

const nextConfig: any = {
  experimental: {
    allowedDevOrigins: ["*.trycloudflare.com", "*.loca.lt", "localhost:3000"]
  }
};

export default nextConfig as NextConfig;
