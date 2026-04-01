import { ShieldCheck, Trash2, Loader2, Users as UsersIcon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/userService";
import { useAuth } from "@/context/AuthContext";

interface UserData {
  id: string;
  email: string;
  role: string;
  created_at?: string;
}

export default function Users() {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  // 1. Dùng useQuery để lấy danh sách (Tự động cache)
  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: userService.getAll,
  });

  // Extract dữ liệu từ API response
  const users = response?.data || response || [];

  // 2. Dùng useMutation để xử lý thao tác cập nhật quyền
  const updateRoleMutation = useMutation({
    mutationFn: (userId: string) => userService.updateRole(userId, "seller"),
    onSuccess: () => {
      // Tự động làm mới dữ liệu bảng sau khi update thành công
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => {
      alert("Lỗi khi nâng cấp quyền. Vui lòng thử lại!");
    },
  });

  const handleApproveSeller = async (userId: string) => {
    if (
      !window.confirm(
        "Bạn có chắc chắn muốn nâng cấp người này thành Người bán (Seller)?",
      )
    )
      return;
    updateRoleMutation.mutate(userId);
  };

  const isUpdating = updateRoleMutation.isPending;

  const renderRoleBadge = (role: string) => {
    switch (role) {
      case "admin":
        return (
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold">
            Admin
          </span>
        );
      case "seller":
        return (
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
            Seller
          </span>
        );
      case "discussant":
        return (
          <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
            Discussant
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
            Guest
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Quản lý Người dùng
        </h1>
        <p className="text-gray-500 mt-1.5">
          Phân quyền và quản lý tài khoản thành viên trong hệ thống.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-[0_2px_20px_rgb(0,0,0,0.02)] border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-72 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
            <p className="font-medium">Đang tải dữ liệu người dùng...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-72 text-red-500">
            <p className="font-medium">Đã xảy ra lỗi: {error.message}</p>
          </div>
        ) : !users || users.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-72 text-gray-400">
            <UsersIcon className="w-12 h-12 mb-3 text-gray-300" />
            <p className="font-medium">Chưa có dữ liệu người dùng.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-8 py-5">Email tài khoản</th>
                  <th className="px-8 py-5">Phân quyền (Role)</th>
                  <th className="px-8 py-5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {Array.isArray(users) &&
                  users.map((item: UserData) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/80 transition-colors group"
                    >
                      <td className="px-8 py-5 font-medium text-gray-900">
                        {item.email}
                      </td>
                      <td className="px-8 py-5">
                        {renderRoleBadge(item.role)}
                      </td>
                      <td className="px-8 py-5 text-right space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {currentUser?.role === "admin" &&
                          item.role !== "admin" &&
                          item.role !== "seller" && (
                            <button
                              onClick={() => handleApproveSeller(item.id)}
                              disabled={isUpdating}
                              className="px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                              title="Duyệt làm Người bán"
                            >
                              {isUpdating ? (
                                "Đang xử lý..."
                              ) : (
                                <>
                                  <ShieldCheck className="w-4 h-4 inline mr-1" />{" "}
                                  Duyệt Seller
                                </>
                              )}
                            </button>
                          )}
                        <button
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                          title="Xóa tài khoản"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
