import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // Import Theme Engine [cite: 263]
import QueryProvider from "../providers/QueryProvide"; // Cung cấp TanStack Query cho toàn bộ hệ thống [cite: 264]

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nền tảng Bất Động Sản Cao Cấp",
  description: "Hệ thống quản lý và giao dịch bất động sản",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body className={inter.className}>
        {/* TanStack Query giờ đây có sẵn cho toàn bộ hệ thống */}
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
