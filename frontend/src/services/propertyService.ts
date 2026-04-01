import { apiClient } from "./apiClient";

export const propertyService = {
  // Lấy toàn bộ danh sách dự án
  getAll: () => apiClient("/properties"),

  // Tạo dự án mới
  create: (payload: any) =>
    apiClient("/properties", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Lấy chi tiết 1 dự án
  getById: (id: string) => apiClient(`/properties/${id}`),

  // Xóa dự án
  delete: (id: string) =>
    apiClient(`/properties/${id}`, {
      method: "DELETE",
    }),
};
