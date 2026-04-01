import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import {
  LayoutDashboard,
  Building2,
  Users,
  MessageSquare,
  Contact,
  X,
  AlertTriangle,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const { user } = useAuth();
  const location = useLocation();

  const menuItems = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
      roles: ["admin", "seller"],
    },
    {
      name: "Dự án",
      href: "/admin/properties",
      icon: Building2,
      roles: ["admin", "seller"],
    },
    {
      name: "Khách hàng",
      href: "/admin/leads",
      icon: Contact,
      roles: ["admin", "seller"],
    },
    {
      name: "Diễn đàn",
      href: "/admin/forum",
      icon: MessageSquare,
      roles: ["admin", "seller"],
    },
    { name: "Người dùng", href: "/admin/users", icon: Users, roles: ["admin"] },
  ];

  const filteredMenu = menuItems.filter((item) =>
    user?.role ? item.roles.includes(user.role) : false,
  );

  return (
    <>
      {/* Lớp nền mờ khi mở menu trên điện thoại */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-20 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar chính */}
      <aside
        className={`fixed md:relative top-0 left-0 z-30 w-72 h-[100dvh] bg-[#1A1C23] text-slate-300 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out shrink-0 ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div className="h-20 flex items-center justify-between px-8 border-b border-white/5 shrink-0">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-primary/20">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-wide">
              DUY<span className="text-primary font-light">ESTATE</span>
            </span>
          </div>

          {/* Nút đóng menu trên Mobile */}
          <button
            onClick={() => setIsOpen(false)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <nav className="flex-1 py-6 px-4 overflow-y-auto">
          {/* Cảnh báo nếu không có quyền */}
          {filteredMenu.length === 0 ? (
            <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-center">
              <AlertTriangle className="w-8 h-8 text-red-400 mx-auto mb-2" />
              <p className="text-sm text-red-300 font-medium">
                Tài khoản Guest không có quyền truy cập quản trị.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {filteredMenu.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? location.pathname === "/admin" ||
                      location.pathname === "/admin/"
                    : location.pathname.startsWith(item.href);
                const Icon = item.icon;

                return (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      onClick={() => setIsOpen(false)} // Bấm xong tự đóng menu trên mobile
                      className={`flex items-center px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                        isActive
                          ? "bg-primary/10 text-primary font-semibold"
                          : "text-slate-400 hover:bg-white/5 hover:text-white font-medium"
                      }`}
                    >
                      <Icon
                        className={`w-5 h-5 mr-3 transition-colors ${isActive ? "text-primary" : "text-slate-500 group-hover:text-slate-300"}`}
                      />
                      <span>{item.name}</span>
                      {isActive && (
                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </nav>
      </aside>
    </>
  );
}
