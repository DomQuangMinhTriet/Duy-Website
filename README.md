# 🏢 Real Estate Enterprise Platform (V2.1)

A high-performance, SEO-optimized, and multi-tenant real estate platform. Built for property sales with a cutting-edge Theme Engine, comprehensive community features, and professional agent management.

## 🌟 Core Pillars

### 1. 🎨 Theme Engine (UI/UX First)
*   **Extreme Variance:** Each theme is 80-90% different, tailored for specific projects (e.g., Luxury 3D vs. Eco-Green).
*   **Dictionary Pattern:** Scalable architecture allowing new themes to be added without refactoring.
*   **Dynamic Assignment:** Apply unique themes to specific projects/landing pages on a single domain.

### 2. 🚀 SEO & Storefront (Next.js SSR)
*   **SSR Power:** Server-Side Rendering for all property pages to ensure perfect Google indexing and social media previews (Zalo/Facebook).
*   **Hierarchical Navigation:** Investor -> Project -> Zone -> Product structure to prevent "visual clutter".
*   **Advanced UX:** Mobile-first design, floating contact buttons, and "No-Login" wishlist.

### 3. 🗄️ Hybrid Multi-Tenant Data
*   **70% Attribute Variance:** Handles complex data (Land vs. Apartment) using PostgreSQL JSONB.
*   **Enterprise Security:** Virtual Private Database (VPD) logic via Supabase RLS. Sellers only see their own leads and properties.

### 4. 💬 Community & CMS
*   **Admin Personal Blog:** Dedicated space for Admin insights.
*   **Moderated Forum:** Full control over community posts and comments.
*   **Workflow i18n:** Auto-translation (EN, ZH, KO) -> Admin Review -> Publish.

## 🏗️ Architecture Detail

*   **Frontend (`frontend/`):** Thư mục chứa toàn bộ giao diện người dùng, bao gồm **Storefront** (Next.js App Router SSR dành cho Customers) và **Admin Panel** (Vite + React SPA dành cho Admin/Seller thao tác tốc độ cao).
*   **Backend (`backend/`):** Node.js API Gateway xử lý logic nghiệp vụ, Zod validation và tối ưu hoá hình ảnh bằng Sharp.
*   **Database:** Supabase với bảo mật RLS nghiêm ngặt và cấu trúc phân cấp (Hierarchical schema) kết hợp JSONB.

## 🚦 Getting Started

### Prerequisites
*   Node.js (v18.17+)
*   Supabase Account (Region: Singapore)
*   API Keys: Cloudinary, Resend, Translation Service (DeepL/Google).

### Installation

1.  **Clone Repository:**
    ```bash
    git clone [your-repo-link]
    ```

2.  **Install Dependencies:**
    Di chuyển vào từng thư mục để cài đặt các gói cần thiết:
    ```bash
    cd frontend && npm install
    cd ../backend && npm install
    ```

3.  **Environment Setup:**
    Dựa trên file `.env.example` ở thư mục gốc, hãy tạo các file `.env` tương ứng bên trong thư mục `frontend/` và `backend/` với các API Keys của bạn.

4.  **Database Setup:**
    Chạy file `docs/schema_v2.sql` (Hierarchy + RLS) trong Supabase SQL Editor để khởi tạo CSDL. *(Lưu ý: Đảm bảo bạn đã thêm file này vào thư mục docs/)*.

5.  **Run Dev Mode:**
    Quay lại thư mục gốc và chạy lệnh khởi động song song:
    ```bash
    npm run dev
    ```

## 🔐 User Roles

1.  **Admin:** Toàn quyền kiểm soát hệ thống, bài viết tự động được phê duyệt.
2.  **Customer (Guest):** Xem toàn bộ nội dung, gửi form liên hệ (Leads) không cần đăng nhập. Chỉ yêu cầu đăng ký khi muốn bình luận/đăng bài diễn đàn.
3.  **Community Member:** Người dùng đã xác thực để tham gia thảo luận (Mọi bài đăng đều chờ kiểm duyệt).
4.  **Seller (Agent):** Tài khoản đối tác thứ 3 (được Admin phê duyệt offline). Có không gian làm việc độc lập, dữ liệu (Leads & Properties) được cách ly an toàn.

## 🛡️ License
Distributed under the MIT License.

## 💡 About
A scalable real estate marketplace with multi-language support, automated lead routing, and distinct UI/UX themes per property.
