import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import AdminRoute from "./components/AdminRoute";
import StorefrontLayout from "./components/storefront/StorefrontLayout";

const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Properties = lazy(() => import("./pages/admin/Properties"));
const CreateProperties = lazy(() => import("./pages/admin/CreateProperties"));
const Users = lazy(() => import("./pages/admin/Users"));
const Lead = lazy(() => import("./pages/admin/Lead"));
const Forum = lazy(() => import("./pages/admin/Forum"));

// STOREFRONT
const Home = lazy(() => import("./pages/storefront/Home"));
const PropertyDetail = lazy(() => import("./pages/storefront/PropertyDetail"));
// Thêm import lazy
const EditProperty = lazy(() => import("./pages/admin/EditProperty"));

// Tạo một Component Loading nhỏ để hiển thị trong lúc chờ tải file
const PageFallback = () => (
  <div className="flex items-center justify-center h-screen w-full text-primary">
    <Loader2 className="w-8 h-8 animate-spin" />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* VÙNG STOREFRONT (KHÁCH HÀNG) */}
          <Route element={<StorefrontLayout />}>
            <Route path="/" element={<Home />} />
            {/* Dynamic Route hiển thị chi tiết dự án */}
            <Route path="/property/:slug" element={<PropertyDetail />} />
          </Route>

          {/* VÙNG AUTH */}
          <Route path="/login" element={<Login />} />

          {/* Vùng Admin */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/properties" element={<Properties />} />
            <Route
              path="/admin/properties/create"
              element={<CreateProperties />}
            />
            <Route
              path="/admin/properties/edit/:id"
              element={<EditProperty />}
            />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/leads" element={<Lead />} />
            <Route path="/admin/forum" element={<Forum />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
