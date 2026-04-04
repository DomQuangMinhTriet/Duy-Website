import { apiClient } from "./apiClient";

export const leadService = {
  // --- HÀM PUBLIC (Dành cho Storefront) ---
  create: (payload: {
    property_id: string;
    name: string;
    email: string;
    phone: string;
    message?: string;
  }) =>
    apiClient("/leads", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // --- CÁC HÀM ADMIN (Giữ nguyên) ---
  getAll: () => apiClient("/leads"),
  updateStatus: (leadId: string, status: string) =>
    apiClient(`/leads/${leadId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
  delete: (leadId: string) =>
    apiClient(`/leads/${leadId}`, {
      method: "DELETE",
    }),
};
