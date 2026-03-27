import { Router } from "express";
import {
  createProperty,
  getProperties,
} from "../controllers/propertyController";
import { verifyToken, requireRole } from "../middlewares/authMiddleware";
import { validateData } from "../middlewares/validateMiddleware";
import { createPropertySchema } from "../utils/validators";

const router = Router();

// ==========================================
// API: THÊM DỰ ÁN MỚI
// Đường dẫn thực tế: POST /api/properties/
// ==========================================
router.post(
  "/",
  verifyToken, // Lớp bảo vệ 1: Bắt buộc phải có Token đăng nhập
  requireRole(["admin", "seller"]), // Lớp bảo vệ 2: Chỉ Admin hoặc Seller mới được đăng bài
  validateData(createPropertySchema), // Lớp bảo vệ 3: Zod quét lỗi dữ liệu (Phải đủ số Tầng nếu là Chung cư)
  createProperty, // Cho qua: Vào Controller lưu vào CSDL
);

router.get("/", verifyToken, getProperties);

export default router;
