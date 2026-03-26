import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl || !supabaseServiceKey) {
  console.error(
    "⚠️ LỖI CẤU HÌNH: Thiếu SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY trong file .env của backend",
  );
  process.exit(1); // Dừng server nếu không có key
}

// Khởi tạo client với Service Role Key để bypass RLS cho các tác vụ Admin
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
