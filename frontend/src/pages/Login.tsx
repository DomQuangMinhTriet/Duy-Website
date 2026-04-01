import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Building2, Mail, Lock } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { authService } from "@/services/authService";

// 1. Khai báo Schema bắt lỗi Zod
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Vui lòng nhập email")
    .email("Email không đúng định dạng"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const navigate = useNavigate();
  const { login, token } = useAuth(); // Lấy hàm login từ Context
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Nếu đã đăng nhập (có token thật), đá thẳng vào Admin luôn, không cho ở lại trang Login
  if (token) {
    return <Navigate to="/admin" replace />;
  }

  // 2. Hàm xử lý gửi form
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      // Gọi API gửi Email & Password xuống Backend
      const response = await authService.login(data);

      // Giả định Backend trả về: { user: { id, email, role }, token: "jwt_token..." }
      // Đưa dữ liệu vào AuthContext để lưu vào localStorage
      login(response.user, response.token);

      // Thành công -> Chuyển hướng vào trang Quản trị
      navigate("/admin");
    } catch (error: any) {
      setErrorMsg(
        error.message || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8">
        {/* Logo & Tiêu đề */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Chào mừng trở lại
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            Đăng nhập để quản trị hệ thống Duy Estate
          </p>
        </div>

        {/* Thông báo lỗi từ API */}
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium border border-red-100 text-center animate-fade-in">
            {errorMsg}
          </div>
        )}

        {/* Form Đăng nhập */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email tài khoản
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register("email")}
                type="email"
                placeholder="admin@duyestate.com"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50/50"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-xs mt-1.5 ml-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                {...register("password")}
                type="password"
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-gray-50/50"
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1.5 ml-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-[#b0894b] transition-all flex items-center justify-center shadow-lg shadow-primary/30 mt-8 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Đăng nhập hệ thống"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
