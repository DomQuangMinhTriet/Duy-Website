import { Request, Response } from "express";
import { supabaseAdmin } from "../config/supabase";

export const upgradeUserRole = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { user_id, new_role } = req.body;

    // Chỉ cho phép nâng cấp lên các role hợp lệ
    if (!["seller", "discussant", "admin"].includes(new_role)) {
      res
        .status(400)
        .json({ status: "error", message: "Quyền (Role) không hợp lệ" });
      return;
    }

    // Cập nhật role trong bảng public.users
    const { data, error } = await supabaseAdmin
      .from("users")
      .update({ role: new_role })
      .eq("id", user_id)
      .select()
      .single();

    if (error) {
      res.status(400).json({ status: "error", message: error.message });
      return;
    }

    res.status(200).json({
      status: "success",
      message: `Đã cấp quyền ${new_role} cho người dùng thành công!`,
      data,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Lỗi máy chủ nội bộ" });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("users")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    res.status(200).json({ data });
  } catch (err: any) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
