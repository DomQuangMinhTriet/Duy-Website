import { Request, Response } from "express";
import { supabaseAdmin } from "../config/supabase";

// ------------------------------------------------------------------
// HÀM GIẢ LẬP GỌI API DỊCH THUẬT (Thay bằng DeepL/Google API sau này)
// ------------------------------------------------------------------
const translateWithAPI = async (
  text: string,
  targetLang: string,
): Promise<string> => {
  // Giả lập độ trễ của mạng internet
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (targetLang === "zh") return `[中文翻译]: ${text}`; // Dành cho khách hàng nói tiếng Trung
  if (targetLang === "en") return `[English Translation]: ${text}`; // Dành cho khách nói tiếng Anh
  if (targetLang === "ko") return `[한국어 번역]: ${text}`; // Dành cho khách nói tiếng Hàn

  return `[${targetLang.toUpperCase()}]: ${text}`;
};

// ------------------------------------------------------------------
// LOGIC CHÍNH XỬ LÝ DỮ LIỆU VÀ LƯU VÀO SUPABASE
// ------------------------------------------------------------------
export const createDraftTranslations = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // entity_id: ID của dự án hoặc bài đăng
    // content_to_translate: Dữ liệu dạng Object (VD: { title: "Nhà đẹp", description: "Mặt tiền 5m" })
    const { entity_id, content_to_translate } = req.body;

    // Mặc định dịch sang 3 ngôn ngữ này nếu Frontend không truyền lên
    const target_langs = req.body.target_langs || ["en", "zh", "ko"];

    const savedTranslations = [];

    // Lặp qua từng ngôn ngữ để dịch
    for (const lang of target_langs) {
      const translatedData: Record<string, string> = {};

      // Dịch từng trường (key) bên trong object content
      for (const [key, value] of Object.entries(content_to_translate)) {
        if (typeof value === "string") {
          translatedData[key] = await translateWithAPI(value, lang);
        }
      }

      // Lưu bản dịch vào bảng 'translations' (cột content là kiểu JSONB)
      const { data, error } = await supabaseAdmin
        .from("translations")
        .insert([
          {
            entity_id: entity_id,
            lang_code: lang,
            content: translatedData, // Push toàn bộ cục JSON đã dịch vào đây
          },
        ])
        .select()
        .single();

      if (!error && data) {
        savedTranslations.push(data);
      }
    }

    res.status(201).json({
      status: "success",
      message: "Đã tạo các bản dịch đa ngôn ngữ thành công",
      data: savedTranslations,
    });
  } catch (error) {
    console.error("Lỗi API Dịch thuật:", error);
    res
      .status(500)
      .json({ status: "error", message: "Lỗi server nội bộ khi dịch dữ liệu" });
  }
};
