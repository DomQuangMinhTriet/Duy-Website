import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { propertyService } from "@/services/propertyService";
import { Save, ArrowLeft, Loader2, Image as ImageIcon } from "lucide-react";

// Schema bảo vệ dữ liệu (Sử dụng coerce để ép kiểu số tự động)
const propertySchema = z.object({
  title: z.string().min(5, "Tên dự án phải có ít nhất 5 ký tự"),
  price: z.coerce
    .number({ message: "Vui lòng nhập số tiền" })
    .min(1000000, "Giá quá thấp"),
  property_type: z.enum(["chung_cu", "dat_nen", "nha_pho"]),
  theme_id: z.string().min(1, "Vui lòng chọn giao diện"),
  tang: z.coerce.number().optional(),
  phong_ngu: z.coerce.number().optional(),
  mat_tien: z.coerce.number().optional(),
});

type FormData = z.infer<typeof propertySchema>;

export default function EditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [imageUrl, setImageUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // 1. Fetch dữ liệu dự án cũ
  const { data: propertyResponse, isLoading: isFetching } = useQuery({
    queryKey: ["property-edit", id],
    queryFn: () => propertyService.getById(id!),
  });

  // 2. Setup React Hook Form (Dùng as any để bypass lỗi TS của Zod coerce)
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(propertySchema) as any,
  });

  const propertyType = watch("property_type");

  // 3. Đổ dữ liệu cũ vào Form khi đã fetch xong (Logic nâng cấp, bóc tách JSONB)
  useEffect(() => {
    // Tự động bóc tách dữ liệu dù API trả về { data: {...} } hay {...}
    const p =
      propertyResponse?.data?.data ||
      propertyResponse?.data ||
      propertyResponse;

    // Đảm bảo 'p' tồn tại và có 'title' thì mới bắt đầu điền dữ liệu
    if (p && p.title) {
      // --- LOGIC XỬ LÝ ATTRIBUTES (jsonb) AN TOÀN ---
      let parsedAttrs: any = {};
      try {
        if (p.attributes) {
          // Nếu Backend trả về dạng chuỗi JSON string, thì ta parse nó
          if (typeof p.attributes === "string") {
            parsedAttrs = JSON.parse(p.attributes);
          } else {
            // Nếu đã là object rồi thì dùng luôn
            parsedAttrs = p.attributes;
          }
        }
      } catch (err) {
        console.error("Lỗi parse dữ liệu attributes jsonb:", err);
        parsedAttrs = {}; // Dự phòng nếu parse lỗi
      }
      // -----------------------------------------------

      // A. Điền các trường văn bản và số vào Form qua hàm reset()
      reset({
        title: p.title,
        price: p.price,
        property_type: p.property_type,
        theme_id: p.theme_id || "luxury-theme", // Mặc định là luxury nếu chưa có
        // Lấy từ Object đã được parse an toàn ở trên
        tang: parsedAttrs.tang,
        phong_ngu: parsedAttrs.phong_ngu,
        mat_tien: parsedAttrs.mat_tien,
      });

      // B. Cập nhật URL ảnh vào state riêng để hiển thị Preview
      // (Lấy từ Object đã parse an toàn)
      setImageUrl(parsedAttrs.image_url || "");
    }
  }, [propertyResponse, reset]);

  // 4. Logic Upload Ảnh (Giữ nguyên logic chặn 5MB)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Dung lượng ảnh vượt quá 5MB. Vui lòng chọn ảnh nhẹ hơn!");
      return;
    }
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Vui lòng chỉ tải lên file hình ảnh!");
      return;
    }

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
      } else {
        setErrorMsg(data.message || "Lỗi upload ảnh");
      }
    } catch (err) {
      setErrorMsg("Không thể kết nối đến server upload.");
    } finally {
      setIsUploading(false);
    }
  };

  // 5. Mutation gửi Update API
  const updateMutation = useMutation({
    mutationFn: (payload: any) => propertyService.update(id!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["properties"] });
      navigate("/admin/properties");
    },
    onError: (err: any) => setErrorMsg(err.message),
  });

  const onSubmit = (data: FormData) => {
    const attributes: any = { image_url: imageUrl };

    if (data.property_type === "chung_cu" || data.property_type === "nha_pho") {
      if (!data.tang || !data.phong_ngu) {
        setErrorMsg("Vui lòng nhập Số tầng và Phòng ngủ");
        return;
      }
      attributes.tang = data.tang;
      attributes.phong_ngu = data.phong_ngu;
    } else if (data.property_type === "dat_nen") {
      if (!data.mat_tien) {
        setErrorMsg("Vui lòng nhập Mặt tiền");
        return;
      }
      attributes.mat_tien = data.mat_tien;
    }

    updateMutation.mutate({
      title: data.title,
      price: data.price,
      property_type: data.property_type,
      theme_id: data.theme_id,
      attributes,
    });
  };

  if (isFetching)
    return (
      <div className="p-20 text-center">
        <Loader2 className="w-10 h-10 animate-spin mx-auto text-primary" />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-500 mb-6 hover:text-primary transition-colors bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100"
      >
        <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại danh sách
      </button>

      <h1 className="text-3xl font-bold mb-2 text-gray-900 font-serif">
        Chỉnh sửa dự án
      </h1>
      <p className="text-gray-500 mb-8">
        Cập nhật thông tin chi tiết cho dự án bất động sản.
      </p>

      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100 mb-6">
          {errorMsg}
        </div>
      )}

      {Object.keys(errors).length > 0 && (
        <div className="bg-orange-50 text-orange-600 p-4 rounded-xl text-sm font-medium border border-orange-100 mb-6">
          <p className="font-bold mb-1">Vui lòng kiểm tra lại:</p>
          <ul className="list-disc pl-5">
            {Object.values(errors).map((err: any, idx) => (
              <li key={idx}>{err.message}</li>
            ))}
          </ul>
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 space-y-8"
      >
        {/* Upload Ảnh */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">
            Ảnh đại diện dự án
          </h3>
          <div className="flex items-start space-x-6">
            <div className="w-40 h-40 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center bg-gray-50 relative overflow-hidden group">
              {imageUrl ? (
                <>
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      Đổi ảnh
                    </span>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-400">
                  <ImageIcon className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <span className="text-xs font-medium">Trống</span>
                </div>
              )}
              {isUploading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
            </div>
            <div className="flex-1 text-sm text-gray-500 pt-2">
              <p className="mb-1">
                Hỗ trợ:{" "}
                <strong className="text-gray-700">JPG, PNG, WEBP</strong>.
              </p>
              <p className="mb-1">
                Dung lượng tối đa:{" "}
                <strong className="text-gray-700">5MB</strong>.
              </p>
              <p>Click vào ô vuông bên cạnh để tải ảnh mới lên thay thế.</p>
            </div>
          </div>
        </div>

        {/* Thông tin cơ bản */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">
            1. Thông tin cơ bản
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Tên dự án *
              </label>
              <input
                {...register("title")}
                type="text"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Mức giá (VNĐ) *
                </label>
                <input
                  {...register("price")}
                  type="number"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Loại hình *
                </label>
                <select
                  {...register("property_type")}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                >
                  <option value="chung_cu">🏢 Chung cư / Căn hộ</option>
                  <option value="nha_pho">🏠 Nhà phố</option>
                  <option value="dat_nen">🏞️ Đất nền</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Giao diện (Theme) *
                </label>
                <select
                  {...register("theme_id")}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white"
                >
                  <option value="luxury-theme">👑 Luxury (Đen/Vàng)</option>
                  <option value="eco-theme">🌿 Eco (Trắng/Xanh)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Thông số chi tiết (Trồi sụt theo loại hình) */}
        <div>
          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">
            2. Thông số chi tiết
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
            {(propertyType === "chung_cu" || propertyType === "nha_pho") && (
              <>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Số tầng
                  </label>
                  <input
                    {...register("tang")}
                    type="number"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Phòng ngủ
                  </label>
                  <input
                    {...register("phong_ngu")}
                    type="number"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  />
                </div>
              </>
            )}

            {propertyType === "dat_nen" && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Mặt tiền (m)
                </label>
                <input
                  {...register("mat_tien")}
                  type="number"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                />
              </div>
            )}
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="bg-primary text-white px-8 py-3.5 rounded-xl font-bold hover:bg-[#b0894b] transition-all flex items-center justify-center min-w-[200px] shadow-lg shadow-primary/30 disabled:opacity-70"
          >
            {updateMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" /> Lưu cập nhật
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
