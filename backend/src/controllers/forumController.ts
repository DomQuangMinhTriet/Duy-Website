import { Request, Response } from "express";
import { supabaseAdmin } from "../config/supabase";
import { AuthRequest } from "../middlewares/authMiddleware";

// 1. Người dùng tạo bài viết mới
export const createPost = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    const { title, content } = req.body;
    const author_id = req.user?.id;

    const { data, error } = await supabaseAdmin
      .from("posts")
      .insert([{ title, content, author_id, status: "pending" }])
      .select()
      .single();

    if (error) {
      res.status(400).json({ status: "error", message: error.message });
      return;
    }

    res
      .status(201)
      .json({
        status: "success",
        message: "Đã gửi bài viết, vui lòng chờ Admin duyệt",
        data,
      });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Lỗi máy chủ nội bộ" });
  }
};

// 2. Admin duyệt bài viết
export const approvePost = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { post_id } = req.params;

    const { data, error } = await supabaseAdmin
      .from("posts")
      .update({ status: "approved" })
      .eq("id", post_id)
      .select()
      .single();

    if (error) {
      res.status(400).json({ status: "error", message: error.message });
      return;
    }

    res
      .status(200)
      .json({ status: "success", message: "Bài viết đã được xuất bản", data });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Lỗi máy chủ nội bộ" });
  }
};

// 3. Lấy danh sách bài viết
export const getPosts = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    res.status(200).json({ data });
  } catch (err: any) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
