import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/LifePlanSimulator",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
