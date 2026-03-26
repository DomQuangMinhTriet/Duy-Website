import { Router } from "express";
import { uploadImage } from "../controllers/uploadController";
import { upload } from "../middlewares/uploadMiddleware";
import { verifyToken, requireRole } from "../middlewares/authMiddleware";

const router = Router();

// API: Upload 1 ảnh. Bắt buộc là Admin hoặc Seller mới được quyền upload.
// 'image' là tên của field (key) mà Frontend sẽ dùng khi gửi file
router.post(
  "/",
  verifyToken,
  requireRole(["admin", "seller"]),
  upload.single("image"),
  uploadImage,
);

export default router;
