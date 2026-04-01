import { apiClient } from "./apiClient";

export const authService = {
  // Hàm gọi API đăng nhập
  login: (credentials: any) =>
    apiClient("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  // (Tùy chọn) Hàm đăng ký nếu sau này bạn cần
  register: (data: any) =>
    apiClient("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
