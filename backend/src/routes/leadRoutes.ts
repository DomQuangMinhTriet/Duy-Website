import { Router } from "express";
import { createLead } from "../controllers/leadController";
import { validateData } from "../middlewares/validateMiddleware";
import { createLeadSchema } from "../utils/validators";

const router = Router();

// Khách hàng gửi form (Public API, không cần Token)
router.post("/", validateData(createLeadSchema), createLead);

export default router;
