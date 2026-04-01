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
    const { property_id, name, email, phone, message } = req.body;

    // 1. Lưu Lead vào database Supabase
    const { data: leadData, error: leadError } = await supabaseAdmin
      .from("leads")
      .insert([{ property_id, name, email, phone, message }])
      .select()
      .single();

    if (leadError) {
      res.status(400).json({
        status: "error",
        message: "Không thể lưu thông tin khách hàng",
      });
      return;
    }

    // 2. Truy vấn tìm Email của Seller sở hữu dự án này
    const { data: propertyData } = await supabaseAdmin
      .from("properties")
      .select("title, seller_id")
      .eq("id", property_id)
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
              <li><strong>Tên:</strong> ${name}</li>
              <li><strong>SĐT:</strong> ${phone}</li>
              <li><strong>Email:</strong> ${email}</li>
              <li><strong>Lời nhắn:</strong> ${message || "Không có"}</li>
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
