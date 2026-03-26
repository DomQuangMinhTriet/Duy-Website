import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cấu hình cho phép tải ảnh từ domain bên ngoài (Cloudinary)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        port: "",
        pathname: "/**",
      },
      // Bạn có thể thêm các hostname khác vào đây sau này nếu cần
    ],
  },
  // Bật React Strict Mode để bắt lỗi logic sớm trong quá trình Dev
  reactStrictMode: true,
};

export default nextConfig;
