import { Router } from "express";
import {
  createPost,
  approvePost,
  getPosts,
} from "../controllers/forumController";
import { verifyToken, requireRole } from "../middlewares/authMiddleware";

const router = Router();

// Mọi User đã đăng nhập (Guest, Discussant, Seller, Admin) đều được viết bài
router.post("/posts", verifyToken, createPost);

// Chỉ Admin mới được duyệt bài
router.put(
  "/posts/:post_id/approve",
  verifyToken,
  requireRole(["admin"]),
  approvePost,
);

router.get("/posts", verifyToken, getPosts);

export default router;
