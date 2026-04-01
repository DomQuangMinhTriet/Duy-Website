import { Building2, Users, Contact, TrendingUp } from "lucide-react";

export default function Dashboard() {
  const stats = [
    {
      title: "Tổng số Dự án",
      value: "24",
      icon: Building2,
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      title: "Khách hàng (Leads)",
      value: "156",
      icon: Contact,
      color: "text-green-500",
      bg: "bg-green-50",
    },
    {
      title: "Người dùng",
      value: "48",
      icon: Users,
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    {
      title: "Lượt tương tác",
      value: "1,204",
      icon: TrendingUp,
      color: "text-orange-500",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Tổng quan hệ thống
        </h1>
        <p className="text-gray-500 mt-1.5">
          Số liệu thống kê hoạt động kinh doanh bất động sản.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="bg-white p-6 rounded-3xl shadow-[0_2px_20px_rgb(0,0,0,0.02)] border border-gray-100 flex items-center"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center mr-5 ${stat.bg}`}
              >
                <Icon className={`w-7 h-7 ${stat.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">
                  {stat.title}
                </p>
                <h3 className="text-2xl font-bold text-gray-900">
                  {stat.value}
                </h3>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
