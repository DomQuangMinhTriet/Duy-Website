"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "../../store/authStore";
import { Lock, Mail, Loader2 } from "lucide-react";

// 1. Sử dụng lại Zod Schema y hệt như dưới Backend để đồng bộ tuyệt đối
const loginSchema = z.object({
  email: z.string().email("Email không đúng định dạng"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type LoginForm = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [apiError, setApiError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    try {
      setIsLoading(true);
      setApiError("");

      // 2. Gọi API Backend (Nhớ bật server Backend ở cổng 5000)
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message || "Đăng nhập thất bại");
      }

      // 3. Lưu token vào Cookie để Middleware (bảo mật route) đọc được
      // Max-Age=86400 tương đương 1 ngày
      document.cookie = `token=${result.token}; path=/; max-age=86400; SameSite=Strict`;

      // 4. Lưu thông tin phiên đăng nhập vào Zustand Store
      setAuth(
        {
          id: result.user.id,
          email: result.user.email,
          role: "admin", // Tạm thời hardcode role để test Full Menu, sau này fetch từ public.users
        },
        result.token,
      );

      // 5. Mở khóa thành công -> Đi vào Bảng điều khiển
      router.push("/admin");
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              DUY<span className="text-blue-600">ESTATE</span>
            </h1>
            <p className="text-slate-500 mt-2">Đăng nhập hệ thống quản trị</p>
          </div>

          {apiError && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  {...register("email")}
                  type="email"
                  className="pl-10 w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="admin@duyestate.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mật khẩu
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  {...register("password")}
                  type="password"
                  className="pl-10 w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.password.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-medium py-2.5 rounded-lg hover:bg-blue-700 transition-colors flex justify-center items-center"
            >
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Đăng nhập"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
