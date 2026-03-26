import { Request, Response } from "express";
import cloudinary from "../config/cloudinary";

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

    // 2. Chuyển đổi file buffer sang chuỗi Base64 để API Cloudinary có thể đọc được
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    // 3. Tiến hành upload
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: "real_estate_properties", // Tạo thư mục riêng trên Cloudinary cho gọn gàng
      resource_type: "auto",
    });

    // 4. Trả về URL an toàn (HTTPS) cho Frontend
    res.status(200).json({
      status: "success",
      message: "Upload ảnh thành công",
      url: result.secure_url,
    });
  } catch (error) {
    console.error("Lỗi Cloudinary:", error);
    res
      .status(500)
      .json({ status: "error", message: "Lỗi server khi upload ảnh" });
  }
};
