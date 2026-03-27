import { Router } from "express";
import { getUsers, upgradeUserRole } from "../controllers/userController";
import { verifyToken, requireRole } from "../middlewares/authMiddleware";

const router = Router();

// Chỉ Admin mới được quyền gọi API này
router.put(
  "/upgrade-role",
  verifyToken,
  requireRole(["admin"]),
  upgradeUserRole,
);
router.get("/", verifyToken, requireRole(["admin"]), getUsers);
export default router;
