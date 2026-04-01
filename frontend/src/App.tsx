// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import { AuthProvider } from '@/context/AuthContext';
// import AdminRoute from '@/components/AdminRoute';
// import Dashboard from '@/pages/admin/Dashboard';
// import Properties from '@/pages/admin/Properties';
// import CreateProperties from '@/pages/admin/CreateProperties';
// import Users from '@/pages/admin/Users';
// import Lead from '@/pages/admin/Lead';
// import Forum from '@/pages/admin/Forum';
// import Login from '@/pages/Login';

// function App() {
//   return (
//     <AuthProvider>
//       <BrowserRouter>
//         <Routes>
//           {/* ======================================= */}
//           {/* VÙNG KHÁCH HÀNG (Public)                  */}
//           {/* ======================================= */}
//           <Route path="/" element={
//             <div className="flex items-center justify-center h-screen text-2xl font-bold">
//               🏠 Giao diện Khách hàng (Storefront)
//             </div>
//           } />

//           <Route path="/login" element={<Login />} />

//           {/* VÙNG QUẢN TRỊ (Phải có Token mới được vào) */}
//           <Route element={<AdminRoute />}>
//             <Route path="/admin" element={<Dashboard />} />
//             <Route path="/admin/properties" element={<Properties />} />
//             <Route path="/admin/properties/create" element={<CreateProperties />} />
//             <Route path="/admin/users" element={<Users />} />
//             <Route path="/admin/leads" element={<Lead />} />
//             <Route path="/admin/forum" element={<Forum />} />
//           </Route>
//         </Routes>
//       </BrowserRouter>
//     </AuthProvider>
//   );
// }

// export default App;

import { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Loader2 } from "lucide-react";
import AdminRoute from "./components/AdminRoute";

const Login = lazy(() => import("./pages/Login"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const Properties = lazy(() => import("./pages/admin/Properties"));
const CreateProperties = lazy(() => import("./pages/admin/CreateProperties"));
const Users = lazy(() => import("./pages/admin/Users"));
const Lead = lazy(() => import("./pages/admin/Lead"));
const Forum = lazy(() => import("./pages/admin/Forum"));

// Tạo một Component Loading nhỏ để hiển thị trong lúc chờ tải file
const PageFallback = () => (
  <div className="flex items-center justify-center h-screen w-full text-primary">
    <Loader2 className="w-8 h-8 animate-spin" />
  </div>
);

function App() {
  return (
    <BrowserRouter>
      {/* Bọc toàn bộ Routes trong Suspense */}
      <Suspense fallback={<PageFallback />}>
        <Routes>
          {/* Vùng Public */}
          <Route
            path="/"
            element={<div>Trang chủ Storefront (Sẽ làm ở Phase 5)</div>}
          />
          <Route path="/login" element={<Login />} />

          {/* Vùng Admin */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/properties" element={<Properties />} />
            <Route
              path="/admin/properties/create"
              element={<CreateProperties />}
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
