import { Building2, Users, Eye, TrendingUp, ArrowUpRight } from "lucide-react";

export default function AdminDashboard() {
  // Dữ liệu giả lập (Mock data) - Sau này chúng ta sẽ dùng TanStack Query để fetch từ Backend
  const stats = [
    {
      title: "Tổng dự án",
      value: "12",
      increase: "+2 hôm nay",
      icon: Building2,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Khách hàng (Leads)",
      value: "48",
      increase: "+5 hôm nay",
      icon: Users,
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      title: "Lượt truy cập",
      value: "1,204",
      increase: "+12% tuần này",
      icon: Eye,
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      title: "Tỷ lệ chuyển đổi",
      value: "4.3%",
      increase: "+1.2% tháng này",
      icon: TrendingUp,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tổng quan hệ thống</h1>
        <p className="text-gray-500 mt-1">
          Theo dõi các chỉ số quan trọng của nền tảng bất động sản.
        </p>
      </div>

      {/* Danh sách các thẻ thống kê nhanh */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    {stat.title}
                  </p>
                  <h3 className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </h3>
                </div>
                <div className={`p-3 rounded-lg ${stat.bg}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <ArrowUpRight className="w-4 h-4 text-green-500 mr-1" />
                <span className="text-green-600 font-medium">
                  {stat.increase}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Khu vực dự kiến cho Biểu đồ hoặc Danh sách Lead mới nhất */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 lg:col-span-2 min-h-[400px] flex items-center justify-center">
          <p className="text-gray-400 font-medium">
            Khu vực hiển thị Biểu đồ (Sẽ tích hợp Recharts sau)
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[400px] flex items-center justify-center">
          <p className="text-gray-400 font-medium">Hoạt động gần đây</p>
        </div>
      </div>
    </div>
  );
}
