import { Request, Response, NextFunction } from "express";
import { supabaseAdmin } from "../config/supabase";

// Mở rộng kiểu dữ liệu Request của Express để chứa thông tin user
export interface AuthRequest extends Request {
  user?: any;
}

// 1. Hàm kiểm tra Token (Có đăng nhập hay chưa?)
export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res
        .status(401)
        .json({
          status: "error",
          message: "Vui lòng cung cấp token xác thực (Bearer Token)",
        });
      return;
    }

    const token = authHeader.split(" ")[1];

    // Nhờ Supabase giải mã và kiểm tra token
    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      res
        .status(401)
        .json({
          status: "error",
          message: "Token không hợp lệ hoặc đã hết hạn",
        });
      return;
    }

    // Gắn thông tin user vào request để các API sau dùng tiếp
    req.user = user;
    next(); // Cho phép đi tiếp vào Controller
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Lỗi server khi xác thực token" });
  }
};

// 2. Hàm kiểm tra Quyền hạn (Role-based Access Control)
export const requireRole = (allowedRoles: string[]) => {
  return async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      if (!req.user) {
        res
          .status(401)
          .json({ status: "error", message: "Chưa xác thực người dùng" });
        return;
      }

      // Lấy role hiện tại của user từ bảng public.users
      const { data: userData, error } = await supabaseAdmin
        .from("users")
        .select("role")
        .eq("id", req.user.id)
        .single();

      if (error || !userData) {
        res
          .status(403)
          .json({
            status: "error",
            message: "Không tìm thấy thông tin quyền hạn",
          });
        return;
      }

      // Kiểm tra xem role của user có nằm trong danh sách cho phép không
      if (!allowedRoles.includes(userData.role)) {
        res.status(403).json({
          status: "error",
          message: `Truy cập bị từ chối. Cần quyền: ${allowedRoles.join(" hoặc ")}`,
        });
        return;
      }

      // Gắn thêm role vào user object cho tiện sử dụng
      req.user.role = userData.role;
      next(); // Cho phép đi tiếp
    } catch (error) {
      res
        .status(500)
        .json({
          status: "error",
          message: "Lỗi server khi kiểm tra phân quyền",
        });
    }
  };
};
