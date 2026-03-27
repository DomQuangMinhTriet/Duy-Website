"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { LogOut, User as UserIcon } from "lucide-react";

export default function Header() {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    // Xóa token trong cookie nếu bạn có set cookie lúc login
    document.cookie = "token=; Max-Age=0; path=/;";
    router.push("/login");
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      <div className="text-gray-600 font-medium">
        {/* Có thể thêm Breadcrumbs ở đây sau */}
        Bảng điều khiển
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-sm text-gray-700">
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <UserIcon className="w-4 h-4" />
          </div>
          <span className="font-medium">{user?.email || "Đang tải..."}</span>
          <span className="px-2 py-0.5 text-xs bg-gray-100 rounded-md uppercase text-gray-500">
            {user?.role || "Guest"}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
          title="Đăng xuất"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
