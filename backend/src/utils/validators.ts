import { z } from "zod";

// ==========================================
// 1. SCHEMA XÁC THỰC (ĐĂNG NHẬP / ĐĂNG KÝ)
// ==========================================
export const authSchema = z.object({
  body: z.object({
    // Sửa lại thành z.string().email()
    email: z.email("Email không đúng định dạng"),
    password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  }),
});

// ==========================================
// 2. SCHEMA DỰ ÁN (PROPERTIES) - HYBRID JSONB
// ==========================================
export const createPropertySchema = z.object({
  body: z
    .object({
      title: z.string().min(10, "Tiêu đề dự án phải dài hơn 10 ký tự"),
      slug: z.string().min(3, "Đường dẫn (slug) không hợp lệ"),
      price: z.number().positive("Giá trị dự án phải lớn hơn 0"),
      property_type: z
        .enum(["apartment", "land", "house"])
        .default("apartment"),
      theme_id: z.string().default("theme_default"),

      // SỬA LỖI Ở ĐÂY: Khai báo rõ Key là string, Value là any
      attributes: z.record(z.string(), z.any()).default({}),
    })
    .superRefine((data, ctx) => {
      // Lưu ý: Vì superRefine đang nằm trực tiếp trên object "body",
      // nên đường dẫn (path) chỉ cần bắt đầu từ 'attributes' là đủ.

      if (data.property_type === "apartment") {
        if (!data.attributes?.tang) {
          ctx.addIssue({
            code: "custom",
            path: ["attributes", "tang"], // Đã bỏ 'body' đi để Zod ghép chuỗi chính xác
            message: "Loại hình Chung cư bắt buộc phải nhập số Tầng",
          });
        }
        if (!data.attributes?.phong_ngu) {
          ctx.addIssue({
            code: "custom",
            path: ["attributes", "phong_ngu"],
            message: "Loại hình Chung cư bắt buộc phải nhập số Phòng ngủ",
          });
        }
      }

      if (data.property_type === "land") {
        if (!data.attributes?.mat_tien) {
          ctx.addIssue({
            code: "custom",
            path: ["attributes", "mat_tien"],
            message: "Loại hình Đất nền bắt buộc phải nhập thông số Mặt tiền",
          });
        }
      }
    }),
});

// ==========================================
// 3. SCHEMA KHÁCH HÀNG TIỀM NĂNG (LEADS)
// ==========================================
export const createLeadSchema = z.object({
  body: z.object({
    property_id: z.uuid("ID dự án không hợp lệ"),
    name: z.string().min(2, "Tên khách hàng quá ngắn"),
    email: z.email("Email không đúng định dạng"),
    phone: z.string().min(9, "Số điện thoại không hợp lệ"),
    message: z.string().optional(),
  }),
});
