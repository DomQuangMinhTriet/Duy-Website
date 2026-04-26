# 🏢 Real Estate Enterprise Platform (V2.1)

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React_SPA-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=3ECF8E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

A high-performance, SEO-optimized, and multi-tenant real estate platform. Built for property sales with a cutting-edge Theme Engine, comprehensive community features, and professional agent management.

## 🌟 Core Pillars

### 1. 🎨 Theme Engine (UI/UX First)
- **Extreme Variance:** Each theme is 80-90% different, tailored for specific projects (e.g., Luxury 3D vs. Eco-Green).
- **Dictionary Pattern:** Scalable architecture allowing new themes to be added without refactoring.
- **Dynamic Assignment:** Apply unique themes to specific projects/landing pages on a single domain.

### 2. 🚀 SEO & Storefront (Next.js SSR)
- **SSR Power:** Server-Side Rendering for all property pages to ensure perfect Google indexing and social media previews (Zalo/Facebook).
- **Hierarchical Navigation:** Investor -> Project -> Zone -> Product structure to prevent "visual clutter".
- **Advanced UX:** Mobile-first design, floating contact buttons, and "No-Login" wishlist.

### 3. 🗄️ Hybrid Multi-Tenant Data
- **70% Attribute Variance:** Handles complex data (Land vs. Apartment) using PostgreSQL JSONB.
- **Enterprise Security:** Virtual Private Database (VPD) logic via Supabase RLS. Sellers only see their own leads and properties.

### 4. 💬 Community & CMS
- **Admin Personal Blog:** Dedicated space for Admin insights.
- **Moderated Forum:** Full control over community posts and comments.
- **Workflow i18n:** Auto-translation (EN, ZH, KO) -> Admin Review -> Publish.

## 🏗️ Architecture Detail

- **Storefront (`apps/storefront`):** Next.js App Router (SSR) for Customers.
- **Admin Panel (`apps/admin-panel`):** Vite + React SPA for high-speed management.
- **Backend (`backend/`):** Node.js API Gateway with Zod validation and sharp image optimization.
- **Database:** Supabase with strict RLS and hierarchical schema.

## 🚦 Getting Started

### Prerequisites
- Node.js (v18.17+)
- Supabase Account (Region: Singapore)
- API Keys: Cloudinary, Resend, Translation Service (DeepL/Google).

### Installation
1. **Clone & Install:**
   ```bash
   git clone [your-repo-link]
   npm install
   ```
2. **Environment:**
   Create `.env` in `storefront`, `admin-panel`, and `backend`.
3. **Database Setup:**
   Run `docs/schema_v2.sql` (Hierarchy + RLS) in Supabase SQL Editor.
4. **Dev Mode:**
   ```bash
   npm run dev
   ```

## 🔐 User Roles
1. **Admin:** Full system control, auto-approved posts.
2. **Customer (Guest):** Access all content, submit leads. Registration required for comments/posts.
3. **Community Member:** Authenticated user for discussions (Moderated).
4. **Seller (Agent):** Isolated workspace for property and lead management (Approved by Admin).

## 🛡️ License
Distributed under the MIT License.
