"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Save, Loader2, ArrowLeft, Building, Map, Home } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

// 1. Định nghĩa Zod Schema (Giống hệt Backend)
const propertySchema = z.object({
  title: z.string().min(5, "Tên dự án quá ngắn"),
  price: z.coerce.number().min(1, "Giá phải lớn hơn 0"),
  property_type: z.enum(["apartment", "land", "house"]),
  theme_id: z.string().default("luxury-theme"),
  // Khai báo sẵn các trường động có thể có
  so_tang: z.coerce.number().optional(),
  phong_ngu: z.coerce.number().optional(),
  mat_tien: z.coerce.number().optional(),
});

type PropertyForm = z.infer<typeof propertySchema>;

export default function CreatePropertyPage() {
  const router = useRouter();
  const { token } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");

  // 2. Khởi tạo React Hook Form
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PropertyForm>({
    resolver: zodResolver(propertySchema) as any, // Ép kiểu để bỏ qua sự khắt khe của TS
    defaultValues: {
      title: "",
      price: 0,
      property_type: "apartment", // Mặc định chọn Chung cư
      theme_id: "luxury-theme",
    },
  });

  // 3. Cơ chế "Lắng nghe" (Watch) sự thay đổi của Loại BĐS
  const selectedType = watch("property_type");

  // Hàm tạo Slug tự động từ Tiêu đề (VD: "Chung cư Xanh" -> "chung-cu-xanh-12345")
  const generateSlug = (text: string) => {
    return (
      text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") // Xóa dấu tiếng Việt
        .replace(/[^a-z0-9]+/g, "-") // Thay khoảng trắng bằng gạch ngang
        .replace(/(^-|-$)+/g, "") +
      "-" +
      Date.now().toString().slice(-5)
    ); // Thêm ID ngẫu nhiên chống trùng
  };

  const onSubmit = async (data: PropertyForm) => {
    try {
      setIsLoading(true);
      setApiError("");

      const { title, price, property_type, theme_id, ...rest } = data;

      // Đóng gói Payload chính xác 100% theo yêu cầu của Backend
      const payload = {
        title,
        slug: generateSlug(title), // Bổ sung Slug bắt buộc
        price,
        property_type,
        theme_id,
        attributes: {
          // Ép tên key chuẩn xác theo Zod Backend (tang, phong_ngu, mat_tien)
          tang: rest.so_tang,
          phong_ngu: rest.phong_ngu,
          mat_tien: rest.mat_tien,
        },
      };

      // Xóa các thuộc tính undefined/null/NaN trước khi gửi
      Object.keys(payload.attributes).forEach((key) => {
        if (
          payload.attributes[key as keyof typeof payload.attributes] ===
            undefined ||
          Number.isNaN(
            payload.attributes[key as keyof typeof payload.attributes],
          )
        ) {
          delete payload.attributes[key as keyof typeof payload.attributes];
        }
      });

      const res = await fetch("http://localhost:5000/api/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(
          result.message || "Lỗi khi tạo dự án (Check lại Backend Zod)",
        );
      }

      router.push("/admin/properties");
    } catch (err: any) {
      setApiError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/properties"
            className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 text-gray-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Đăng Dự án Mới</h1>
            <p className="text-gray-500 mt-1">
              Điền thông tin chi tiết để xuất bản bất động sản lên hệ thống.
            </p>
          </div>
        </div>
      </div>

      {apiError && (
        <div className="p-4 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm font-medium rounded-r-lg">
          {apiError}
        </div>
      )}

      {/* Form Area */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Khối 1: Thông tin Cố định (Bảng properties) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">
            Thông tin Cơ bản
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tên dự án <span className="text-red-500">*</span>
              </label>
              <input
                {...register("title")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="VD: Khu đô thị Eco Green..."
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giá bán (VNĐ) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                {...register("price")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Giao diện (Theme Engine)
              </label>
              <select
                {...register("theme_id")}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="luxury-theme">Luxury 3D (Cao cấp)</option>
                <option value="eco-theme">Eco Green (Thân thiện)</option>
                <option value="minimal-theme">Minimalist (Tối giản)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Khối 2: Thông tin Động (Cột JSONB attributes) */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2 flex items-center">
            Thông số Đặc thù (JSONB)
          </h2>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Chọn Loại hình Bất động sản:
            </label>
            <div className="grid grid-cols-3 gap-4">
              <label
                className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer transition-all ${selectedType === "apartment" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 hover:bg-gray-50"}`}
              >
                <input
                  type="radio"
                  value="apartment"
                  {...register("property_type")}
                  className="sr-only"
                />
                <Building className="w-8 h-8 mb-2" />
                <span className="font-medium">Chung cư</span>
              </label>
              <label
                className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer transition-all ${selectedType === "land" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 hover:bg-gray-50"}`}
              >
                <input
                  type="radio"
                  value="land"
                  {...register("property_type")}
                  className="sr-only"
                />
                <Map className="w-8 h-8 mb-2" />
                <span className="font-medium">Đất nền</span>
              </label>
              <label
                className={`border rounded-lg p-4 flex flex-col items-center cursor-pointer transition-all ${selectedType === "house" ? "border-blue-500 bg-blue-50 text-blue-700" : "border-gray-200 hover:bg-gray-50"}`}
              >
                <input
                  type="radio"
                  value="house"
                  {...register("property_type")}
                  className="sr-only"
                />
                <Home className="w-8 h-8 mb-2" />
                <span className="font-medium">Nhà phố</span>
              </label>
            </div>
          </div>

          {/* RENDERING ĐỘNG DỰA TRÊN `watch('property_type')` */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
            {selectedType === "apartment" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số tầng đang bán
                  </label>
                  <input
                    type="number"
                    {...register("so_tang")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="VD: Tầng 15"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số phòng ngủ
                  </label>
                  <input
                    type="number"
                    {...register("phong_ngu")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="VD: 3"
                  />
                </div>
              </>
            )}

            {selectedType === "land" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Chiều ngang mặt tiền (m)
                </label>
                <input
                  type="number"
                  {...register("mat_tien")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                  placeholder="VD: 5.5"
                />
              </div>
            )}

            {selectedType === "house" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số tầng nhà
                  </label>
                  <input
                    type="number"
                    {...register("so_tang")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="VD: 4"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mặt tiền hẻm/đường (m)
                  </label>
                  <input
                    type="number"
                    {...register("mat_tien")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="VD: 12"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <Link
            href="/admin/properties"
            className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
          >
            Hủy bỏ
          </Link>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            Lưu Dự án
          </button>
        </div>
      </form>
    </div>
  );
}
