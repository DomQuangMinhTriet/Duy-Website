"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import {
  LayoutDashboard,
  Building2,
  Users,
  MessageSquare,
  Settings,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuthStore(); // Lấy thông tin user hiện tại

  const menuItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      roles: ["admin", "seller"],
    },
    {
      name: "Dự án của tôi",
      href: "/admin/properties",
      icon: Building2,
      roles: ["admin", "seller"],
    },
    {
      name: "Khách hàng (Leads)",
      href: "/admin/leads",
      icon: Users,
      roles: ["admin", "seller"],
    },
    {
      name: "Diễn đàn",
      href: "/admin/forum",
      icon: MessageSquare,
      roles: ["admin", "seller"],
    },
    // Menu này chỉ Admin mới nhìn thấy
    {
      name: "Quản lý Thành viên",
      href: "/admin/users",
      icon: Settings,
      roles: ["admin"],
    },
  ];

  // Lọc menu theo quyền (role)
  const filteredMenu = menuItems.filter((item) =>
    user?.role ? item.roles.includes(user.role) : false,
  );

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 h-screen flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-slate-800">
        <span className="text-xl font-bold text-white tracking-wider">
          DUY<span className="text-blue-500">ESTATE</span>
        </span>
      </div>

      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          {filteredMenu.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center px-6 py-3 hover:bg-slate-800 hover:text-white transition-colors ${
                    isActive
                      ? "bg-slate-800 text-blue-400 border-r-4 border-blue-500"
                      : ""
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
