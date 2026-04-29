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
      title: z.string().min(5, "Tiêu đề dự án phải dài hơn 5 ký tự"), // Đổi 10 thành 5
      slug: z.string().min(3, "Đường dẫn (slug) không hợp lệ"),
      price: z.number().positive("Giá trị dự án phải lớn hơn 0"),
      // Khớp với giá trị Frontend gửi lên
      property_type: z
        .enum(["chung_cu", "dat_nen", "nha_pho"])
        .default("chung_cu"),
      theme_id: z.string().default("theme_default"),
      attributes: z.record(z.string(), z.any()).default({}),
    })
    .superRefine((data, ctx) => {
      // Cập nhật lại điều kiện check
      if (
        data.property_type === "chung_cu" ||
        data.property_type === "nha_pho"
      ) {
        if (!data.attributes?.tang) {
          ctx.addIssue({
            code: "custom",
            path: ["attributes", "tang"],
            message: "Bắt buộc nhập số Tầng",
          });
        }
        if (!data.attributes?.phong_ngu) {
          ctx.addIssue({
            code: "custom",
            path: ["attributes", "phong_ngu"],
            message: "Bắt buộc nhập số Phòng ngủ",
          });
        }
      }
      if (data.property_type === "dat_nen") {
        if (!data.attributes?.mat_tien) {
          ctx.addIssue({
            code: "custom",
            path: ["attributes", "mat_tien"],
            message: "Bắt buộc nhập Mặt tiền",
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

// ==========================================
// 4. SCHEMA PHÂN CẤP (INVESTORS, PROJECTS, ZONES)
// ==========================================
export const createInvestorSchema = z.object({
  body: z.object({
    name: z.string().min(2, "Tên chủ đầu tư phải có ít nhất 2 ký tự"),
    description: z.string().optional(),
  }),
});

export const createProjectSchema = z.object({
  body: z.object({
    investor_id: z.string().uuid("ID chủ đầu tư không hợp lệ"),
    name: z.string().min(2, "Tên dự án phải có ít nhất 2 ký tự"),
    description: z.string().optional(),
  }),
});

export const createZoneSchema = z.object({
  body: z.object({
    project_id: z.string().uuid("ID dự án không hợp lệ"),
    name: z.string().min(2, "Tên phân khu phải có ít nhất 2 ký tự"),
  }),
});

// ==========================================
// 5. SCHEMA BLOG POST (ADMIN)
// ==========================================
export const createBlogPostSchema = z.object({
  body: z.object({
    title: z.string().min(5, "Tiêu đề bài viết phải có ít nhất 5 ký tự"),
    content: z.string().min(10, "Nội dung bài viết quá ngắn"),
  }),
});
