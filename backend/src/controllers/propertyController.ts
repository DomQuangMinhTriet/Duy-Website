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

// Lấy danh sách dự án công khai (Chỉ lấy dự án đã được duyệt)
export const getPublicProperties = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { data, error } = await supabaseAdmin
      .from("properties")
      .select("*")
      .eq("status", "approved") // Chỉ lấy dự án đã duyệt
      .order("created_at", { ascending: false });

    if (error) throw error;
    res.status(200).json({ data });
  } catch (err: any) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Lấy chi tiết 1 dự án dựa vào Slug (Đường dẫn SEO)
export const getPropertyBySlug = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { slug } = req.params;
    const { data, error } = await supabaseAdmin
      .from("properties")
      .select("*")
      .eq("slug", slug)
      .eq("status", "approved")
      .single();

    if (error) {
      res
        .status(404)
        .json({ status: "error", message: "Không tìm thấy dự án" });
      return;
    }
    res.status(200).json({ data });
  } catch (err: any) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

export const updatePropertyStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const { data, error } = await supabaseAdmin
      .from("properties")
      .update({ status })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    res.status(200).json({ status: "success", data });
  } catch (err: any) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Xóa dự án
export const deleteProperty = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    // Xóa trong Supabase
    const { error } = await supabaseAdmin
      .from("properties")
      .delete()
      .eq("id", id);
    if (error) throw error;

    res
      .status(200)
      .json({ status: "success", message: "Đã xóa dự án thành công" });
  } catch (err: any) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Cập nhật thông tin dự án
export const updateProperty = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const { data, error } = await supabaseAdmin
      .from("properties")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    res.status(200).json({ status: "success", data });
  } catch (err: any) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Lấy chi tiết 1 dự án theo ID (Dành cho Admin)
export const getPropertyById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { data, error } = await supabaseAdmin
      .from("properties")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      res
        .status(404)
        .json({ status: "error", message: "Không tìm thấy dự án" });
      return;
    }
    res.status(200).json({ data });
  } catch (err: any) {
    res.status(500).json({ status: "error", message: err.message });
  }
};
