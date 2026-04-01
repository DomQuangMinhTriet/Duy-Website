// Sử dụng biến môi trường Vite (import.meta.env)
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const apiClient = async (
  endpoint: string,
  options: RequestInit = {},
) => {
  // Lấy thẳng token từ localStorage (Đồng bộ với logic của AuthContext)
  const token = localStorage.getItem("token");

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Lỗi kết nối đến máy chủ API");
  }

  return data;
};
