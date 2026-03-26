export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi">
      <body>
        <div className="flex min-h-screen bg-gray-100">
          {/* Cột Sidebar giả lập */}
          <aside className="w-64 bg-slate-900 text-white p-6">
            <h2 className="text-xl font-bold">Admin Panel</h2>
          </aside>

          {/* Nội dung chính */}
          <main className="flex-1 p-8 text-black">{children}</main>
        </div>
      </body>
    </html>
  );
}
