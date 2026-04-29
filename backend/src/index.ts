import express, { Express, Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import Routes
import userRoutes from "./routes/userRoutes";
import forumRoutes from "./routes/forumRoutes";
import uploadRoutes from "./routes/uploadRoutes";
import leadRoutes from "./routes/leadRoutes";
import authRoutes from "./routes/authRoutes";
import propertyRoutes from "./routes/propertyRoutes";
import translationRoutes from "./routes/translationRoutes";
import hierarchyRoutes from "./routes/hierarchyRoutes";
import blogRoutes from "./routes/blogRoutes";

// Load biến môi trường
dotenv.config();
// --- ĐOẠN DEBUG NHANH ---
const keyParts = process.env.SUPABASE_SERVICE_ROLE_KEY?.split(".");
if (keyParts && keyParts.length === 3) {
  const payload = JSON.parse(Buffer.from(keyParts[1], "base64").toString());
  console.log(
    "🔍 [DEBUG] Role thực tế của Key trong .env đang là:",
    payload.role,
  );
}
// ------------------------

// Khởi tạo Express
const app: Express = express();
const port = process.env.PORT || 5000;

// Cấu hình Middlewares cơ bản
app.use(cors()); // Cho phép cross-origin requests
app.use(express.json()); // Phân tích các request có body định dạng JSON

// API Route cơ bản (Health Check)
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "success",
    message: "Nền tảng Bất Động Sản - Backend API đang hoạt động 🚀",
  });
});

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/forum", forumRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/leads", leadRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/translations", translationRoutes);
app.use("/api/hierarchy", hierarchyRoutes);
app.use("/api/blog", blogRoutes);

// Khởi động server
app.listen(port, () => {
  console.log(
    `[Server]: 🟢 Backend Node.js đang chạy tại http://localhost:${port}`,
  );
  console.log(`[Server]: 🟢 Sẵn sàng xử lý nghiệp vụ...`);
});
