import { Router } from "express";
import { upgradeUserRole } from "../controllers/userController";
import { verifyToken, requireRole } from "../middlewares/authMiddleware";

const router = Router();

// Chỉ Admin mới được quyền gọi API này
router.put(
  "/upgrade-role",
  verifyToken,
  requireRole(["admin"]),
  upgradeUserRole,
);

export default router;
