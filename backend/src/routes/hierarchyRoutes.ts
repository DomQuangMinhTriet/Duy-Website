import { Router } from "express";
import {
  getInvestors,
  createInvestor,
  updateInvestor,
  deleteInvestor,
  getProjects,
  createProject,
  updateProject,
  deleteProject,
  getZones,
  createZone,
  updateZone,
  deleteZone,
} from "../controllers/hierarchyController";
import { verifyToken, requireRole } from "../middlewares/authMiddleware";
import { validateData } from "../middlewares/validateMiddleware";
import {
  createInvestorSchema,
  createProjectSchema,
  createZoneSchema,
} from "../utils/validators";

const router = Router();

// ==============================================
// PUBLIC ROUTES (Ai cũng có thể xem danh mục)
// ==============================================
router.get("/investors", getInvestors);
router.get("/projects", getProjects);
router.get("/zones", getZones);

// ==============================================
// PROTECTED ROUTES (Chỉ Admin có quyền Quản trị)
// ==============================================
// Áp dụng middleware kiểm tra token và phân quyền admin cho tất cả các route bên dưới
router.use(verifyToken, requireRole(["admin"]));

// CĐT
router.post("/investors", validateData(createInvestorSchema), createInvestor);
router.put(
  "/investors/:id",
  validateData(createInvestorSchema),
  updateInvestor,
); // Dùng lại schema để validate khi update
router.delete("/investors/:id", deleteInvestor);

// Dự án
router.post("/projects", validateData(createProjectSchema), createProject);
router.put("/projects/:id", validateData(createProjectSchema), updateProject);
router.delete("/projects/:id", deleteProject);

// Phân khu
router.post("/zones", validateData(createZoneSchema), createZone);
router.put("/zones/:id", validateData(createZoneSchema), updateZone);
router.delete("/zones/:id", deleteZone);

export default router;
