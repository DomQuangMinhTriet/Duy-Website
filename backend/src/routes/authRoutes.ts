import { Router } from "express";
import { register, login } from "../controllers/authController";
import { validateData } from "../middlewares/validateMiddleware";
import { authSchema } from "../utils/validators";

const router = Router();

// Đăng ký: Kiểm tra định dạng email/pass trước khi cho vào Controller
router.post("/register", validateData(authSchema), register);

// Đăng nhập
router.post("/login", validateData(authSchema), login);

export default router;
