import { apiClient } from "./apiClient";

export const userService = {
  // Lấy danh sách toàn bộ người dùng
  getAll: () => apiClient("/users"),

  // API Nâng cấp quyền người dùng (Chỉ Admin mới gọi được)
  // role mới có thể là 'seller'
  updateRole: (userId: string, newRole: string) =>
    apiClient(`/users/${userId}/role`, {
      method: "PATCH",
      body: JSON.stringify({ role: newRole }),
    }),

  // (Tùy chọn) Xóa người dùng
  delete: (userId: string) =>
    apiClient(`/users/${userId}`, {
      method: "DELETE",
    }),
};
