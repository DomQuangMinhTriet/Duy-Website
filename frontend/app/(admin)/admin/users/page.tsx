"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import { Users, Shield, UserCheck, Loader2, AlertCircle } from "lucide-react";
import { useState } from "react";

// Giả định bạn đã có API GET /api/users ở Backend, nếu chưa có, API này sẽ trả về mảng rỗng tạm thời
const fetchUsers = async (token: string) => {
  const res = await fetch("http://localhost:5000/api/users", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Lỗi khi tải danh sách người dùng");
  return res.json();
};

export default function UsersPage() {
  const { token, user } = useAuthStore();
  const queryClient = useQueryClient();
  const [actionMessage, setActionMessage] = useState({ type: "", text: "" });

  // 1. Lấy danh sách users
  const { data, isLoading, isError } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchUsers(token as string),
    enabled: !!token && user?.role === "admin", // Chỉ gọi khi là Admin
  });

  // 2. Mutation: Nâng cấp Role
  const upgradeMutation = useMutation({
    mutationFn: async (userId: string) => {
      const res = await fetch("http://localhost:5000/api/users/upgrade-role", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: userId, new_role: "seller" }),
      });
      if (!res.ok) throw new Error("Không thể nâng cấp người dùng này");
      return res.json();
    },
    onSuccess: () => {
      setActionMessage({
        type: "success",
        text: "Đã cấp quyền Seller thành công!",
      });
      queryClient.invalidateQueries({ queryKey: ["users"] }); // Refresh lại bảng
      setTimeout(() => setActionMessage({ type: "", text: "" }), 3000);
    },
    onError: (error: any) => {
      setActionMessage({ type: "error", text: error.message });
      setTimeout(() => setActionMessage({ type: "", text: "" }), 3000);
    },
  });

  // Nếu không phải Admin, chặn luôn từ giao diện
  if (user?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-center">
        <Shield className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">
          Không có quyền truy cập
        </h2>
        <p className="text-gray-500 mt-2">
          Chỉ Quản trị viên (Admin) mới có thể xem trang này.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <Users className="w-6 h-6 mr-2 text-blue-600" />
            Quản lý Thành viên
          </h1>
          <p className="text-gray-500 mt-1">
            Phân quyền và quản lý tài khoản trên hệ thống.
          </p>
        </div>
      </div>

      {actionMessage.text && (
        <div
          className={`p-4 rounded-lg flex items-center ${actionMessage.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}
        >
          {actionMessage.type === "success" ? (
            <UserCheck className="w-5 h-5 mr-2" />
          ) : (
            <AlertCircle className="w-5 h-5 mr-2" />
          )}
          {actionMessage.text}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : isError ? (
          <div className="flex items-center justify-center h-64 text-red-500">
            <p>
              Không thể tải dữ liệu (Có thể API GET /api/users chưa được viết ở
              Backend).
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 font-medium">
                <tr>
                  <th className="px-6 py-4">ID / Email</th>
                  <th className="px-6 py-4">Quyền hiện tại</th>
                  <th className="px-6 py-4">Ngày đăng ký</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {data?.data?.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Chưa có người dùng nào trên hệ thống.
                    </td>
                  </tr>
                ) : (
                  data?.data?.map((u: any) => (
                    <tr
                      key={u.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {u.email}
                        </div>
                        <div className="text-xs text-gray-400 font-mono mt-0.5">
                          {u.id.substring(0, 8)}...
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                            u.role === "admin"
                              ? "bg-purple-100 text-purple-700"
                              : u.role === "seller"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(u.created_at).toLocaleDateString("vi-VN")}
                      </td>
                      <td className="px-6 py-4 text-right">
                        {u.role === "discussant" || u.role === "guest" ? (
                          <button
                            onClick={() => upgradeMutation.mutate(u.id)}
                            disabled={upgradeMutation.isPending}
                            className="text-sm px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-md transition-colors disabled:opacity-50 flex items-center inline-flex"
                          >
                            {upgradeMutation.isPending && (
                              <Loader2 className="w-3 h-3 animate-spin mr-1" />
                            )}
                            Duyệt Seller
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm italic">
                            Đã phân quyền
                          </span>
                        )}
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
