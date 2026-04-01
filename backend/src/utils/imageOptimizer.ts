// File: backend/src/utils/imageOptimizer.ts
import sharp from "sharp";

interface OptimizeOptions {
  width?: number; // Chiều rộng tối đa
  height?: number; // Chiều cao tối đa (Thường để auto theo width)
  quality?: number; // Chất lượng (1-100)
  format?: "webp" | "jpeg" | "png"; // Định dạng đầu ra
}

/**
 * Module nén và tối ưu hóa hình ảnh
 * @param buffer - File buffer nhận được từ Multer
 * @param options - Các thông số nén tùy chỉnh
 * @returns Buffer đã được nén
 */
export const optimizeImage = async (
  buffer: Buffer,
  options: OptimizeOptions = {},
): Promise<Buffer> => {
  // Đặt giá trị mặc định tối ưu nhất cho Web
  const { width = 1200, quality = 80, format = "webp" } = options;

  let transformer = sharp(buffer).resize({
    width,
    withoutEnlargement: true, // Không phóng to nếu ảnh gốc nhỏ hơn width
    fit: "inside", // Giữ nguyên tỷ lệ khung hình
  });

  // Ép sang định dạng thế hệ mới WebP để dung lượng nhẹ nhất mà không mờ
  if (format === "webp") {
    transformer = transformer.webp({ quality });
  } else if (format === "jpeg") {
    transformer = transformer.jpeg({ quality, progressive: true });
  } else if (format === "png") {
    transformer = transformer.png({ quality });
  }

  return await transformer.toBuffer();
};
