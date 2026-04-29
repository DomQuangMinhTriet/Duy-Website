import { Request, Response } from "express";
import { supabaseAdmin } from "../config/supabase";
import { AuthRequest } from "../middlewares/authMiddleware";

// ==========================================
// QUẢN LÝ BLOG (BÀI VIẾT TỰ ĐỘNG DUYỆT CỦA ADMIN)
// ==========================================

export const getAdminBlogPosts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Chỉ lấy các bài viết có trạng thái 'approved' (Công khai)
    const { data, error } = await supabaseAdmin
      .from("posts")
      .select(`*, users(email, role)`)
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) throw error;

    res.status(200).json({ status: "success", data });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

export const createAdminBlogPost = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { title, content } = req.body;

    // Auth middleware đã xác thực và gắn user vào request
    if (!req.user) {
      res.status(401).json({ status: "error", message: "Chưa xác thực" });
      return;
    }

    const author_id = req.user.id;

    // Insert vào bảng posts với trạng thái ép cứng là 'approved' dành riêng cho Admin
    const { data, error } = await supabaseAdmin
      .from("posts")
      .insert([
        {
          title,
          content,
          author_id,
          status: "approved", // Auto-approve bypass
        },
      ])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json({ status: "success", data });
  } catch (error: any) {
    res.status(500).json({ status: "error", message: error.message });
  }
};
