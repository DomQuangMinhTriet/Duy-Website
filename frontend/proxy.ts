import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const isAccessingAdmin = request.nextUrl.pathname.startsWith("/admin");

  // Chưa đăng nhập mà cố vào admin -> Đuổi về login
  if (isAccessingAdmin && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Đã đăng nhập mà vào trang login -> Đẩy vào dashboard
  if (request.nextUrl.pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login"],
};
