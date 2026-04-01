import {
  Contact,
  Phone,
  Mail,
  CheckCircle,
  Clock,
  Trash2,
  Loader2,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { leadService } from "@/services/leadService";

interface LeadData {
  id: string;
  customer_name: string;
  phone: string;
  email: string;
  property_id: string;
  status: "new" | "contacted";
  created_at: string;
}

export default function Leads() {
  const queryClient = useQueryClient();

  // 1. Lấy dữ liệu Leads bằng React Query
  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["leads"],
    queryFn: leadService.getAll,
  });

  const leads = response?.data || response || [];

  // 2. Mutation để đổi trạng thái Lead
  const updateStatusMutation = useMutation({
    mutationFn: (leadId: string) =>
      leadService.updateStatus(leadId, "contacted"),
    onSuccess: () => {
      // Báo cho React Query tải lại danh sách leads mới
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
    onError: () => {
      alert("Đã xảy ra lỗi khi cập nhật trạng thái!");
    },
  });

  const handleMarkAsContacted = async (leadId: string) => {
    updateStatusMutation.mutate(leadId);
  };

  const isUpdating = updateStatusMutation.isPending;

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Khách hàng Tiềm năng
        </h1>
        <p className="text-gray-500 mt-1.5">
          Danh sách khách hàng để lại thông tin liên hệ tư vấn dự án.
        </p>
      </div>

      <div className="bg-white rounded-3xl shadow-[0_2px_20px_rgb(0,0,0,0.02)] border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-72 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
            <p className="font-medium">Đang tải dữ liệu khách hàng...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-72 text-red-500">
            <p className="font-medium">Đã xảy ra lỗi: {error.message}</p>
          </div>
        ) : !leads || leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-72 text-gray-400">
            <Contact className="w-12 h-12 mb-3 text-gray-300" />
            <p className="font-medium">Chưa có khách hàng nào liên hệ.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-8 py-5">Khách hàng</th>
                  <th className="px-8 py-5">Liên hệ</th>
                  <th className="px-8 py-5">ID Dự án (Tạm)</th>
                  <th className="px-8 py-5">Trạng thái</th>
                  <th className="px-8 py-5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {leads.map((item: LeadData) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/80 transition-colors group"
                  >
                    <td className="px-8 py-5">
                      <div className="font-bold text-gray-900">
                        {item.customer_name}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(
                          item.created_at || Date.now(),
                        ).toLocaleDateString("vi-VN")}
                      </div>
                    </td>
                    <td className="px-8 py-5 space-y-1">
                      <div className="flex items-center text-gray-600">
                        <Phone className="w-3.5 h-3.5 mr-2" /> {item.phone}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Mail className="w-3.5 h-3.5 mr-2" /> {item.email}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-gray-500 font-mono text-xs">
                      {item.property_id?.substring(0, 8) || "N/A"}...
                    </td>
                    <td className="px-8 py-5">
                      {item.status === "new" ? (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-100">
                          <Clock className="w-3 h-3 mr-1" /> Chờ tư vấn
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600 border border-green-100">
                          <CheckCircle className="w-3 h-3 mr-1" /> Đã liên hệ
                        </span>
                      )}
                    </td>
                    <td className="px-8 py-5 text-right space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.status === "new" && (
                        <button
                          onClick={() => handleMarkAsContacted(item.id)}
                          disabled={isUpdating}
                          className="p-2 text-gray-400 hover:text-green-600 transition-colors disabled:opacity-50"
                          title="Đánh dấu đã tư vấn"
                        >
                          <CheckCircle className="w-5 h-5" />
                        </button>
                      )}
                      <button
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Xóa"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
