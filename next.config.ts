import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    "*.space-z.ai",
    "*.chatglm.cn",
    "localhost",
    "127.0.0.1",
  ],
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@react-three/drei",
      "@react-three/postprocessing",
    ],
  },
};

export default nextConfig;
