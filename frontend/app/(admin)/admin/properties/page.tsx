"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  Building2,
  Map,
  Home,
} from "lucide-react";

// Hàm gọi API lấy danh sách dự án
const fetchProperties = async (token: string) => {
  const res = await fetch("http://localhost:5000/api/properties", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error("Lỗi khi tải dữ liệu");
  return res.json();
};

export default function PropertiesPage() {
  const { token } = useAuthStore();

  // Ứng dụng TanStack Query để fetch và tự động cache dữ liệu
  const { data, isLoading, isError } = useQuery({
    queryKey: ["properties"],
    queryFn: () => fetchProperties(token as string),
    enabled: !!token, // Chỉ gọi API khi đã có token
  });

  const getPropertyIcon = (type: string) => {
    switch (type) {
      case "apartment":
        return <Building2 className="w-5 h-5 text-blue-500" />;
      case "land":
        return <Map className="w-5 h-5 text-green-500" />;
      case "house":
        return <Home className="w-5 h-5 text-orange-500" />;
      default:
        return <Building2 className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            Đã duyệt
          </span>
        );
      case "pending":
        return (
          <span className="px-2.5 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
            Chờ duyệt
          </span>
        );
      case "rejected":
        return (
          <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
            Từ chối
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Nút thêm mới */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý Dự án</h1>
          <p className="text-gray-500 mt-1">
            Danh sách các bất động sản bạn đang chào bán.
          </p>
        </div>
        <Link
          href="/admin/properties/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-1" /> Thêm dự án
        </Link>
      </div>

      {/* Bảng dữ liệu (Data Table) */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center h-64 text-red-500">
            <p>Đã xảy ra lỗi khi tải danh sách dự án.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 font-medium">
                <tr>
                  <th className="px-6 py-4">Tên dự án</th>
                  <th className="px-6 py-4">Loại hình</th>
                  <th className="px-6 py-4">Giá bán</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.data?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Bạn chưa có dự án nào. Hãy bấm "Thêm dự án" để bắt đầu!
                    </td>
                  </tr>
                ) : (
                  data?.data?.map((item: any) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {item.title}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {getPropertyIcon(item.property_type)}
                          <span className="ml-2 capitalize">
                            {item.property_type}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-blue-600 font-medium">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(item.price)}
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(item.status)}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50">
                          <Edit className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
