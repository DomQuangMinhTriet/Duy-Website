import { apiClient } from "./apiClient";

export const leadService = {
  // Lấy danh sách khách hàng liên hệ
  getAll: () => apiClient("/leads"),

  // Cập nhật trạng thái khách hàng (VD: 'new' -> 'contacted')
  updateStatus: (leadId: string, status: string) =>
    apiClient(`/leads/${leadId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  // Xóa khách hàng
  delete: (leadId: string) =>
    apiClient(`/leads/${leadId}`, {
      method: "DELETE",
    }),
};
