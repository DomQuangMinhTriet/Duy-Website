import { Router } from "express";
import { createLead, getLeads } from "../controllers/leadController";
import { validateData } from "../middlewares/validateMiddleware";
import { verifyToken, requireRole } from "../middlewares/authMiddleware";
import { createLeadSchema } from "../utils/validators";

const router = Router();

// Khách hàng gửi form (Public API, không cần Token)
router.post("/", validateData(createLeadSchema), createLead);
router.get("/", verifyToken, requireRole(["admin", "seller"]), getLeads);

export default router;
