import { Request, Response } from "express";
import { supabaseAdmin } from "../config/supabase";
import { AuthRequest } from "../middlewares/authMiddleware";

export const createProperty = async (
  req: AuthRequest,
  res: Response,
): Promise<void> => {
  try {
    // 1. Trích xuất dữ liệu từ body (Dữ liệu này đã đi qua cổng kiểm tra của Zod nên cực kỳ an toàn)
    const { title, slug, price, property_type, theme_id, attributes } =
      req.body;

    // 2. Lấy ID của người tạo từ Token (đã được authMiddleware gắn vào req.user)
    const seller_id = req.user?.id;

    // 3. Đẩy dữ liệu vào bảng 'properties' trên Supabase
    const { data, error } = await supabaseAdmin
      .from("properties")
      .insert([
        {
          title,
          slug,
          price,
          property_type,
          theme_id,
          attributes,
          seller_id,
          status: "pending", // Dự án mới tạo mặc định ở trạng thái chờ Admin duyệt
        },
      ])
      .select()
      .single();

    // 4. Xử lý nếu Supabase báo lỗi (VD: trùng slug)
    if (error) {
      console.error("Lỗi Supabase:", error);
      res.status(400).json({ status: "error", message: error.message });
      return;
    }

    // 5. Trả về kết quả thành công cho Frontend
    res.status(201).json({
      status: "success",
      message: "Tạo dự án thành công",
      data: data,
    });
  } catch (error) {
    console.error("Lỗi Server:", error);
    res.status(500).json({ status: "error", message: "Lỗi máy chủ nội bộ" });
  }
};

export const getProperties = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("properties")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    res.status(200).json({ data });
  } catch (err: any) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
