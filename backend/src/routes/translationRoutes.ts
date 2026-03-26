import { Router } from "express";
import { createDraftTranslations } from "../controllers/translationController";
import { verifyToken, requireRole } from "../middlewares/authMiddleware";

const router = Router();

// Chỉ Admin hoặc Seller mới có quyền kích hoạt tính năng tự động dịch
router.post(
  "/auto-translate",
  verifyToken,
  requireRole(["admin", "seller"]),
  createDraftTranslations,
);

export default router;
