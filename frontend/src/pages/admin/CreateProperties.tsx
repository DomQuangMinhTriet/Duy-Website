import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Save, Loader2, ImagePlus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { propertyService } from "@/services/propertyService";

// 1. Khởi tạo Schema bắt lỗi bằng Zod
// Thay thế đoạn propertySchema cũ bằng đoạn này:
const propertySchema = z.object({
  title: z.string().min(5, "Tên dự án phải có ít nhất 5 ký tự"),
  price: z.coerce
    .number({ message: "Vui lòng nhập số tiền hợp lệ" })
    .min(1000000, "Giá quá thấp"),
  property_type: z.enum(["chung_cu", "dat_nen", "nha_pho"]),
  tang: z.coerce.number().optional(),
  phong_ngu: z.coerce.number().optional(),
  mat_tien: z.coerce.number().optional(),
});

type PropertyFormData = z.infer<typeof propertySchema>;
type PropertyFormInput = z.input<typeof propertySchema>;

export default function CreateProperty() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ==========================================
  // STATE QUẢN LÝ UPLOAD ẢNH
  // ==========================================
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PropertyFormInput, any, PropertyFormData>({
    resolver: zodResolver(propertySchema),
    defaultValues: {
      property_type: "chung_cu",
    },
  });

  const currentPropertyType = watch("property_type");

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/([^0-9a-z-\s])/g, "")
      .replace(/(\s+)/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // ==========================================
  // HÀM XỬ LÝ UPLOAD ẢNH ĐỘC LẬP
  // ==========================================
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. KIỂM TRA DUNG LƯỢNG (Tối đa 5MB)
    const MAX_SIZE = 5 * 1024 * 1024; // 5MB tính bằng bytes
    if (file.size > MAX_SIZE) {
      setErrorMsg("Dung lượng ảnh vượt quá 5MB. Vui lòng chọn ảnh nhẹ hơn!");
      return; // Dừng lại, không gọi API
    }

    // 2. KIỂM TRA ĐỊNH DẠNG (Bắt buộc là ảnh)
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Vui lòng chỉ tải lên file hình ảnh (JPG, PNG, WEBP)!");
      return;
    }

    // Vượt qua kiểm tra -> Xóa lỗi cũ và bắt đầu upload
    setIsUploading(true);
    setErrorMsg(null);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/upload`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        },
      );

      const data = await response.json();
      if (data.status === "success") {
        setImageUrl(data.url);
        setErrorMsg(null);
      } else {
        setErrorMsg(data.message || "Lỗi upload ảnh từ máy chủ");
      }
    } catch (err) {
      setErrorMsg("Không thể kết nối đến server upload. Vui lòng thử lại sau.");
    } finally {
      setIsUploading(false);
    }
  };

  // ==========================================
  // REACT QUERY MUTATION (TẠO DỰ ÁN)
  // ==========================================
  const createPropertyMutation = useMutation({
    mutationFn: (payload: any) => propertyService.create(payload),
    onSuccess: () => {
      // Xóa bộ nhớ đệm cũ để trang Danh sách tự tải lại bản mới nhất
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      navigate("/admin/properties");
    },
    onError: (error: any) => {
      setErrorMsg(error.message || "Đã xảy ra lỗi khi tạo dự án");
    },
  });

  // Hàm xử lý gửi form (Đóng gói JSONB)
  const onSubmit = async (data: PropertyFormData) => {
    setErrorMsg(null);

    try {
      // Bắt buộc phải có ảnh
      if (!imageUrl)
        throw new Error("Vui lòng tải lên 1 ảnh đại diện cho dự án!");

      const attributes: Record<string, any> = {};

      attributes.image_url = imageUrl;

      // THÊM ĐIỀU KIỆN "|| data.property_type === 'nha_pho'" VÀO ĐÂY:
      if (
        data.property_type === "chung_cu" ||
        data.property_type === "nha_pho"
      ) {
        if (!data.tang || !data.phong_ngu)
          throw new Error("Vui lòng nhập đầy đủ Số tầng và Phòng ngủ");
        attributes.tang = data.tang;
        attributes.phong_ngu = data.phong_ngu;
      } else if (data.property_type === "dat_nen") {
        if (!data.mat_tien)
          throw new Error("Vui lòng nhập Mặt tiền cho Đất nền");
        attributes.mat_tien = data.mat_tien;
      }

      const payload = {
        title: data.title,
        slug: generateSlug(data.title),
        price: data.price,
        property_type: data.property_type,
        attributes: attributes,
        theme_id: "theme_default",
      };

      // Kích hoạt Mutation để gửi dữ liệu
      createPropertyMutation.mutate(payload);
    } catch (error: any) {
      setErrorMsg(error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 bg-white rounded-xl border border-gray-100 shadow-sm hover:bg-gray-50 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
            Thêm Dự án mới
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Điền đầy đủ thông tin để đăng bán bất động sản.
          </p>
        </div>
      </div>

      {/* 1. Báo lỗi từ Backend (Đã có sẵn) */}
      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 mb-4">
          {errorMsg}
        </div>
      )}

      {/* 2. THÊM ĐOẠN NÀY: Báo lỗi từ Frontend Zod (Chống lỗi ẩn) */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-orange-50 text-orange-600 p-4 rounded-xl text-sm font-medium border border-orange-100 mb-4">
          <p className="font-bold mb-1">Vui lòng kiểm tra lại dữ liệu nhập:</p>
          <ul className="list-disc pl-5">
            {Object.values(errors).map((err: any, idx) => (
              <li key={idx}>{err.message || "Trường dữ liệu không hợp lệ"}</li>
            ))}
          </ul>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-6xl mx-auto pb-20"
      >
        {/* ========================================== */}
        {/* KHU VỰC UPLOAD ẢNH                         */}
        {/* ========================================== */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold border-b pb-2">
            Ảnh đại diện dự án *
          </h2>
          <div className="flex items-center space-x-6">
            <div className="w-40 h-40 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 relative group transition-colors hover:bg-gray-100">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-gray-400">
                  {isUploading ? (
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary" />
                  ) : (
                    <ImagePlus className="w-8 h-8 mx-auto group-hover:text-primary transition-colors" />
                  )}
                  <span className="text-xs mt-2 block font-medium">
                    Chưa có ảnh
                  </span>
                </div>
              )}
              {/* Nút input ẩn đè lên toàn bộ khối để bắt sự kiện click */}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading || createPropertyMutation.isPending}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
              />
            </div>
            <div className="text-sm text-gray-500 space-y-1">
              <p>
                Hỗ trợ:{" "}
                <span className="font-medium text-gray-700">
                  JPG, PNG, WEBP
                </span>
                .
              </p>
              <p>
                Dung lượng tối đa:{" "}
                <span className="font-medium text-gray-700">5MB</span>.
              </p>
              <p
                className={`mt-2 font-medium ${isUploading ? "text-primary animate-pulse" : "text-gray-400"}`}
              >
                {isUploading
                  ? "Đang đẩy lên máy chủ Cloudinary..."
                  : "Click vào ô vuông để tải ảnh lên"}
              </p>
            </div>
          </div>
        </div>

        {/* Khối 1: Thông tin Cố định */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold border-b pb-2">
            1. Thông tin cơ bản
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên dự án *
            </label>
            <input
              {...register("title")}
              type="text"
              placeholder="VD: Vinhomes Grand Park"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
            {errors.title && (
              <p className="text-red-500 text-xs mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mức giá (VNĐ) *
              </label>
              <input
                {...register("price")}
                type="number"
                placeholder="VD: 3500000000"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
              {errors.price && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Loại hình *
              </label>
              <select
                {...register("property_type")}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
              >
                <option value="chung_cu">🏢 Chung cư / Căn hộ</option>
                <option value="dat_nen">🗺️ Đất nền</option>
                <option value="nha_pho">🏠 Nhà phố</option>
              </select>
            </div>
          </div>
        </div>

        {/* Khối 2: Thông tin Động (JSONB) */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold border-b pb-2">
            2. Thông số chi tiết
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50/50 p-6 rounded-2xl border border-gray-100">
            {(currentPropertyType === "chung_cu" ||
              currentPropertyType === "nha_pho") && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số tầng
                  </label>
                  <input
                    {...register("tang")}
                    type="number"
                    placeholder="VD: 15"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phòng ngủ
                  </label>
                  <input
                    {...register("phong_ngu")}
                    type="number"
                    placeholder="VD: 2"
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200"
                  />
                </div>
              </>
            )}

            {currentPropertyType === "dat_nen" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mặt tiền (mét)
                </label>
                <input
                  {...register("mat_tien")}
                  type="number"
                  placeholder="VD: 5"
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200"
                />
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={createPropertyMutation.isPending || isUploading}
            className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#b0894b] flex items-center shadow-lg shadow-primary/30 disabled:opacity-70 disabled:cursor-not-allowed transition-all"
          >
            {createPropertyMutation.isPending ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            ) : (
              <Save className="w-5 h-5 mr-2" />
            )}
            {createPropertyMutation.isPending ? "Đang xử lý..." : "Lưu dự án"}
          </button>
        </div>
      </form>
    </div>
  );
}
