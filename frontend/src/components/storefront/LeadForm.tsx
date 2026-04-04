import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation } from "@tanstack/react-query";
import { leadService } from "@/services/leadService";
import { Send, Loader2, CheckCircle2, Phone, X } from "lucide-react";

// 1. Zod Schema kiểm tra dữ liệu khách nhập
const leadSchema = z.object({
  name: z.string().min(2, "Vui lòng nhập tên của bạn"),
  phone: z.string().min(9, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không đúng định dạng"),
  message: z.string().optional(),
});

type LeadFormData = z.infer<typeof leadSchema>;

export default function LeadForm({
  propertyId,
  propertyName,
}: {
  propertyId: string;
  propertyName: string;
}) {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isMobileModalOpen, setIsMobileModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
  });

  // 2. Gọi API bằng React Query Mutation
  const submitMutation = useMutation({
    mutationFn: (data: LeadFormData) =>
      leadService.create({ ...data, property_id: propertyId }),
    onSuccess: () => {
      setIsSuccess(true);
      reset(); // Xóa trắng form sau khi gửi
      setTimeout(() => setIsSuccess(false), 5000); // Ẩn thông báo sau 5s
    },
  });

  const onSubmit = (data: LeadFormData) => {
    submitMutation.mutate(data);
  };

  // Khối giao diện Form chính
  const FormContent = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {isSuccess ? (
        <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center animate-fade-in">
          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-green-800 mb-1">
            Gửi thành công!
          </h3>
          <p className="text-sm text-green-600">
            Chuyên viên tư vấn sẽ liên hệ với bạn trong thời gian sớm nhất.
          </p>
        </div>
      ) : (
        <>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Nhận thông tin dự án
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Đăng ký để nhận bảng giá và chính sách ưu đãi mới nhất từ{" "}
            {propertyName}.
          </p>

          <div>
            <input
              {...register("name")}
              type="text"
              placeholder="Họ và tên *"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-gray-900"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1 ml-1">
                {errors.name.message}
              </p>
            )}
          </div>
          <div>
            <input
              {...register("phone")}
              type="tel"
              placeholder="Số điện thoại *"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-gray-900"
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1 ml-1">
                {errors.phone.message}
              </p>
            )}
          </div>
          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Email liên hệ *"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-gray-900"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 ml-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <div>
            <textarea
              {...register("message")}
              placeholder="Lời nhắn (tùy chọn)"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-gray-900 resize-none"
            ></textarea>
          </div>

          {submitMutation.error && (
            <p className="text-red-500 text-sm">
              {(submitMutation.error as any).message}
            </p>
          )}

          <button
            type="submit"
            disabled={submitMutation.isPending}
            className="w-full bg-primary text-white py-3.5 rounded-xl font-bold hover:bg-[#b0894b] transition-all flex items-center justify-center disabled:opacity-70 shadow-lg shadow-primary/30"
          >
            {submitMutation.isPending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" /> Đăng ký tư vấn
              </>
            )}
          </button>
        </>
      )}
    </form>
  );

  return (
    <>
      {/* 1. HIỂN THỊ TRÊN DESKTOP (Máy tính) */}
      <div className="hidden md:block bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
        <FormContent />
      </div>

      {/* 2. STICKY BAR TRÊN MOBILE (Điện thoại) */}
      <div className="md:hidden fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 p-4 z-40 flex gap-3 shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <button className="flex-1 bg-gray-100 text-gray-900 font-bold py-3.5 rounded-xl flex items-center justify-center">
          <Phone className="w-5 h-5 mr-2 text-primary" /> Gọi ngay
        </button>
        <button
          onClick={() => setIsMobileModalOpen(true)}
          className="flex-1 bg-primary text-white font-bold py-3.5 rounded-xl flex items-center justify-center shadow-lg shadow-primary/30"
        >
          Nhận báo giá
        </button>
      </div>

      {/* 3. MODAL FORM TRÊN MOBILE */}
      {isMobileModalOpen && (
        <div className="md:hidden fixed inset-0 bg-black/60 z-50 flex items-end animate-fade-in">
          <div className="bg-white w-full rounded-t-3xl p-6 pb-10 relative">
            <button
              onClick={() => setIsMobileModalOpen(false)}
              className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="mt-4">
              <FormContent />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
