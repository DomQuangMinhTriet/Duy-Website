import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cấu hình Cloudinary đã làm ở Phase 2 [cite: 184]
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
    ],
  },
  // Thêm đoạn này để dập tắt Warning [cite: 337]
  experimental: {
    turbopack: {
      root: "../",
    },
  },
};

export default nextConfig;
