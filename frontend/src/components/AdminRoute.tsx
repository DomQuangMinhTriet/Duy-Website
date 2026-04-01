import { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import Sidebar from "./admin/Sidebar";
import Header from "./admin/Header";

const AdminRoute = () => {
  const { token, isLoading } = useAuth();
  // State quản lý menu trên điện thoại
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[100dvh] bg-background text-gray-500 font-medium">
        Đang xác thực quyền truy cập...
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    // Dùng 100dvh (Dynamic Viewport Height) để fix lỗi Safari iOS
    <div className="flex h-[100dvh] bg-background overflow-hidden font-sans relative">
      <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

      <div className="flex-1 flex flex-col h-[100dvh] min-w-0 overflow-hidden">
        <Header
          toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* Vùng cuộn chính */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-8 w-full">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminRoute;
