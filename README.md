# 🏢 Real Estate Multi-Tenant Platform

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-181818?style=for-the-badge&logo=supabase&logoColor=3ECF8E)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)

A comprehensive, scalable, and highly customizable real estate platform designed for property sales. The system leverages a **Boundary-Control-Entity (BCE)** architecture, separating a flexible Next.js theme engine from a secure Node.js backend, all powered by a Supabase PostgreSQL database with strict Data Isolation.

## ✨ Key Features

- 🎨 **Dynamic Theme Engine (UI/UX First):** Utilizes Next.js App Router and Route Groups to deliver completely distinct UIs (up to 90% difference) for different property landing pages (e.g., Luxury, Eco-Green) on the same domain without CSS conflicts.
- 🗄️ **Hybrid Database Schema:** Handles complex, varying property data by combining core relational columns with a robust `JSONB` attribute architecture, allowing up to 70% attribute variance between property types (e.g., Land vs. Apartments).
- 🔐 **Multi-Tenant & Enterprise Security:** Implements rigorous Role-Based Access Control (RBAC) and Row-Level Security (RLS) acting as a Virtual Private Database (VPD). Sellers have completely isolated workspaces and lead data.
- 🌍 **Automated Localization:** Built-in workflow for multi-language support (EN, ZH, KO) integrating third-party translation APIs with an admin-approval draft system.
- 💬 **Community Forum & Lead Routing:** Integrated discussion boards with moderation, paired with dynamic lead capture forms that trigger real-time email notifications via Resend/Brevo.

## 🏗️ System Architecture

The project is structured as a logical Monorepo containing both the Frontend and Backend layers for streamlined development.

```text
real-estate-platform/
├── frontend/             # Next.js (App Router)
│   ├── src/app/(admin)   # Vite-inspired Admin Panel SPA
│   └── src/app/(storefront) # Public Web & Dynamic Theme Engine
└── backend/              # Node.js + Express API Gateway
    ├── src/controllers/  # Business Logic (Email, Translations, Moderation)
    └── src/middlewares/  # Auth & Role Validation

🚀 Getting Started
Prerequisites
Node.js (v18.17 or newer)

npm or pnpm

A Supabase account (Region: Singapore recommended)

Installation:

Clone the repository:
git clone [https://github.com/YOUR-USERNAME/real-estate-platform.git](https://github.com/YOUR-USERNAME/real-estate-platform.git)
cd real-estate-platform

Install dependencies:
# Install root tools (concurrently)
npm install

# Install frontend and backend dependencies
cd frontend && npm install
cd ../backend && npm install
cd ..

Environment Setup:
Create .env files in both frontend and backend directories. Refer to .env.example for required keys (Supabase URL, Anon Key, Service Role Key, Resend API Key).

Database Seeding:
Execute the provided DDL and RLS SQL scripts located in docs/schema.sql within your Supabase SQL Editor to initialize the Hybrid Schema and security policies.

Run the Development Servers:
Launch both Next.js and Node.js simultaneously from the root directory:
npm run dev
Storefront: http://localhost:3000

Admin Dashboard: http://localhost:3000/admin

Backend API: http://localhost:5000

🛡️ License
Distributed under the MIT License. See LICENSE for more information.