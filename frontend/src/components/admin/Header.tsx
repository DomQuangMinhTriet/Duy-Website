import { useAuth } from "@/context/AuthContext";
import { LogOut, UserCircle, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  toggleMobileMenu: () => void;
}

export default function Header({ toggleMobileMenu }: HeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-8 shadow-sm shrink-0 z-10">
      <div className="flex items-center">
        {/* Nút Hamburger chỉ hiện trên Mobile */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden p-2 mr-3 text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="text-xl font-bold text-gray-800 hidden sm:block">
          Bảng điều khiển
        </div>
      </div>

      <div className="flex items-center space-x-4 md:space-x-6">
        <div className="flex items-center space-x-3 bg-gray-50 px-3 md:px-4 py-2 rounded-full border border-gray-100">
          <UserCircle className="w-6 h-6 text-primary shrink-0" />
          <div className="flex flex-col hidden sm:flex">
            <span className="text-sm font-bold text-gray-700 leading-none">
              {user?.email || "Người dùng"}
            </span>
            <span className="text-xs text-red-500 font-bold mt-1 capitalize leading-none">
              {user?.role || "Guest"}
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
          title="Đăng xuất"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}
