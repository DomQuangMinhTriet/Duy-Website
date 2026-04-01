import { Request, Response } from "express";
import { supabaseAdmin } from "../config/supabase";

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, full_name, role } = req.body;

    // 1. Tạo user trong hệ thống Auth của Supabase
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError || !authData.user) {
      res.status(400).json({ status: "error", message: authError?.message });
      return;
    }

    // 2. Lưu thông tin bổ sung vào bảng public.users của chúng ta
    const { error: dbError } = await supabaseAdmin.from("users").insert([
      {
        id: authData.user.id,
        email,
        full_name,
        role: role || "guest",
      },
    ]);

    if (dbError) {
      res.status(400).json({ status: "error", message: dbError.message });
      return;
    }

    res
      .status(201)
      .json({ status: "success", message: "Đăng ký tài khoản thành công" });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Lỗi server nội bộ" });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const { data: authData, error: authError } =
      await supabaseAdmin.auth.signInWithPassword({ email, password });

    if (authError || !authData.user) {
      res
        .status(401)
        .json({
          status: "error",
          message: "Email hoặc mật khẩu không chính xác",
        });
      return;
    }

    // LẤY ROLE THỰC TẾ TỪ BẢNG USERS (Tạm bỏ .single() để debug)
    console.log("👉 1. ID ĐANG TÌM KIẾM:", authData.user.id);

    const { data: userData, error: userError } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("id", authData.user.id); // <--- BỎ .single() Ở ĐÂY

    if (userError) {
      console.error("🔴 LỖI TRUY VẤN:", userError.message);
    }

    console.log("👉 2. KẾT QUẢ TÌM THẤY:", userData);

    // Lấy phần tử đầu tiên của mảng (nếu có), nếu không thì cho làm guest
    const actualRole =
      userData && userData.length > 0 ? userData[0].role : "guest";
    console.log("👉 3. ROLE CHỐT HẠ GỬI CHO FRONTEND:", actualRole);

    res.status(200).json({
      status: "success",
      message: "Đăng nhập thành công",
      token: authData.session?.access_token,
      user: { ...authData.user, role: actualRole },
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: "Lỗi server nội bộ" });
  }
};
