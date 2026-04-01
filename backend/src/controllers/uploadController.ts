import { Request, Response } from "express";
import cloudinary from "../config/cloudinary";
import { optimizeImage } from "../utils/imageOptimizer"; // Nhúng Module nén ảnh

export const uploadImage = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // 1. Kiểm tra xem có file gửi lên không
    if (!req.file) {
      res
        .status(400)
        .json({ status: "error", message: "Không tìm thấy file ảnh" });
      return;
    }

    // 2. NÉN ẢNH VỚI MODULE TÁI SỬ DỤNG
    // Ảnh 5MB gửi lên sẽ được bóp lại còn khoảng 100-200KB và ép thành WebP
    const optimizedBuffer = await optimizeImage(req.file.buffer, {
      width: 1200, // Resize chiều ngang tối đa 1200px (Chuẩn màn hình máy tính)
      quality: 80, // Giữ 80% chất lượng
      format: "webp", // Tối ưu SEO cho Frontend
    });

    // 3. Chuyển đổi file buffer (ĐÃ NÉN) sang chuỗi Base64
    // Chú ý: Vì module trả ra ảnh webp, nên mimetype ở đây ta hardcode là image/webp
    const b64 = optimizedBuffer.toString("base64");
    const dataURI = "data:image/webp;base64," + b64;

    // 4. Tiến hành upload lên Cloudinary
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "real_estate_properties",
      resource_type: "image",
    });

    // 5. Trả về URL an toàn (HTTPS) cho Frontend
    res.status(200).json({
      status: "success",
      message: "Upload và nén ảnh thành công",
      url: result.secure_url,
    });
  } catch (error) {
    console.error("Lỗi hệ thống khi upload ảnh:", error);
    res
      .status(500)
      .json({ status: "error", message: "Lỗi server khi upload và nén ảnh" });
  }
};
