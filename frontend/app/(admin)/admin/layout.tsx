// Thêm dòng này lên trên cùng của file layout
import "@/app/globals.css";
import Sidebar from "@/components/admin/Sidebar";
import Header from "@/components/admin/Header";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans text-gray-900">
      {/* Cột trái: Sidebar */}
      <Sidebar />

      {/* Cột phải: Khung nội dung chính */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />

        {/* Vùng chứa nội dung các trang (Dashboard, Properties, v.v.) */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
