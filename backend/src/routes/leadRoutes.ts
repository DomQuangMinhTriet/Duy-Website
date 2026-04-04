import express from "express";
import {
  createLead,
  getLeads,
  updateLeadStatus,
} from "../controllers/leadController";
import { verifyToken, requireRole } from "../middlewares/authMiddleware";

const router = express.Router();

// 🟢 PUBLIC ROUTE: Bất kỳ ai cũng có thể gửi form báo giá (KHÔNG có verifyToken)
router.post("/", createLead);

// 🔴 PRIVATE ROUTE: Chỉ Admin/Seller đã đăng nhập mới được xem và sửa trạng thái
router.get("/", verifyToken, requireRole(["admin", "seller"]), getLeads);
router.patch(
  "/:id/status",
  verifyToken,
  requireRole(["admin", "seller"]),
  updateLeadStatus,
);

export default router;
