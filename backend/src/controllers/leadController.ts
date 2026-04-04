import { Request, Response } from "express";
import { supabaseAdmin } from "../config/supabase";
import { Resend } from "resend";

// Khởi tạo Resend (Bạn sẽ cần thêm RESEND_API_KEY vào file .env sau)
const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_key");

export const createLead = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Lấy nguyên cục body để xử lý
    const payload = req.body;

    // Trích xuất thông minh: Nếu Frontend gửi 'name' thì lấy 'name', nếu gửi 'customer_name' thì lấy 'customer_name'
    const final_name =
      payload.name || payload.customer_name || payload.fullName;
    const final_email = payload.email || payload.customer_email;
    const final_phone =
      payload.phone || payload.customer_phone || payload.phoneNumber;

    // 1. Lưu Lead vào database Supabase
    const { data: leadData, error: leadError } = await supabaseAdmin
      .from("leads")
      .insert([
        {
          property_id: payload.property_id,
          customer_name: final_name, // Gắn biến đã trích xuất an toàn vào đây
          customer_email: final_email,
          customer_phone: final_phone,
          message: payload.message,
          status: "new",
        },
      ])
      .select()
      .single();

    if (leadError) {
      // 👉 IN LỖI RA TERMINAL ĐỂ BẮT ĐÚNG BỆNH
      console.error("Chi tiết lỗi từ Supabase:", leadError);
      res.status(400).json({
        status: "error",
        message: "Không thể lưu thông tin khách hàng: " + leadError.message, // Hiển thị luôn lỗi ra Frontend để dễ debug
      });
      return;
    }

    // 2. Truy vấn tìm Email của Seller sở hữu dự án này
    const { data: propertyData } = await supabaseAdmin
      .from("properties")
      .select("title, seller_id")
      .eq("id", payload.property_id)
      .single();

    if (propertyData && propertyData.seller_id) {
      const { data: sellerData } = await supabaseAdmin
        .from("users")
        .select("email, full_name")
        .eq("id", propertyData.seller_id)
        .single();

      // 3. Gửi Email thông báo cho Seller qua Resend
      if (sellerData && sellerData.email) {
        await resend.emails.send({
          from: "Acme <onboarding@resend.dev>", // Email mặc định của Resend khi test
          to: sellerData.email,
          subject: `🎉 Có khách hàng mới quan tâm dự án: ${propertyData.title}`,
          html: `
            <h2>Chào ${sellerData.full_name || "bạn"},</h2>
            <p>Có một khách hàng vừa để lại thông tin tư vấn cho dự án <strong>${propertyData.title}</strong>:</p>
            <ul>
              <li><strong>Tên:</strong> ${final_name}</li>
              <li><strong>SĐT:</strong> ${final_phone}</li>
              <li><strong>Email:</strong> ${final_email}</li>
              <li><strong>Lời nhắn:</strong> ${payload.message || "Không có"}</li>
            </ul>
            <p>Hãy liên hệ với khách hàng ngay nhé!</p>
          `,
        });
      }
    }

    // 4. Phản hồi thành công về cho Frontend
    res.status(201).json({
      status: "success",
      message: "Đã gửi thông tin tư vấn thành công",
      data: leadData,
    });
  } catch (error) {
    console.error("Lỗi khi xử lý Lead:", error);
    res.status(500).json({ status: "error", message: "Lỗi máy chủ nội bộ" });
  }
};

export const getLeads = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabaseAdmin
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    res.status(200).json({ data });
  } catch (err: any) {
    res.status(500).json({ status: "error", message: err.message });
  }
};

// Cập nhật trạng thái của Lead (Dành cho Admin/Seller)
export const updateLeadStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body; // Ví dụ: 'new', 'contacted', 'qualified', 'lost'

    const { data, error } = await supabaseAdmin
      .from("leads")
      .update({ status })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      res.status(400).json({ status: "error", message: error.message });
      return;
    }

    res.status(200).json({ status: "success", data });
  } catch (err: any) {
    console.error("Lỗi khi cập nhật trạng thái Lead:", err);
    res.status(500).json({ status: "error", message: "Lỗi máy chủ nội bộ" });
  }
};
