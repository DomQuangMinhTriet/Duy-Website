import { Router } from "express";
import {
  getAdminBlogPosts,
  createAdminBlogPost,
} from "../controllers/blogController";
import { verifyToken, requireRole } from "../middlewares/authMiddleware";
import { validateData } from "../middlewares/validateMiddleware";
import { createBlogPostSchema } from "../utils/validators";

const router = Router();

// ==============================================
// PUBLIC ROUTES
// ==============================================
// Ai cũng có thể xem danh sách bài viết trên Blog đã được duyệt
router.get("/", getAdminBlogPosts);

// ==============================================
// PROTECTED ROUTES (Chỉ Admin)
// ==============================================
// Chỉ người dùng có role 'admin' mới được gọi API này để tạo bài viết Auto-approve
router.post(
  "/",
  verifyToken,
  requireRole(["admin"]),
  validateData(createBlogPostSchema),
  createAdminBlogPost,
);

export default router;
