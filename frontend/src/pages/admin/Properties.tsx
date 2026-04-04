import { Link } from "react-router-dom";
import {
  Plus,
  Edit,
  Trash2,
  Loader2,
  Building2,
  CheckCircle,
} from "lucide-react"; // Thêm CheckCircle
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"; // Thêm mutation
import { propertyService } from "@/services/propertyService";

// Định nghĩa kiểu dữ liệu tạm thời cho Property
interface Property {
  id: string;
  title: string;
  property_type: string;
  price: number;
  status: string;
}

export default function Properties() {
  const queryClient = useQueryClient();

  const {
    data: propertiesResponse,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["properties"],
    queryFn: propertyService.getAll,
  });

  const properties = propertiesResponse?.data || propertiesResponse || [];

  // THÊM MUTATION DUYỆT DỰ ÁN
  const approveMutation = useMutation({
    mutationFn: (id: string) => propertyService.updateStatus(id, "approved"),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["properties"] }),
  });

  // MUTATION XÓA DỰ ÁN
  const deleteMutation = useMutation({
    mutationFn: (id: string) => propertyService.delete(id),
    onSuccess: () => {
      alert("Đã xóa dự án thành công!");
      queryClient.invalidateQueries({ queryKey: ["properties"] }); // Tự động load lại bảng
    },
    onError: (err: any) => {
      alert("Lỗi khi xóa: " + err.message);
    },
  });

  // Hàm xác nhận trước khi xóa (Chống xóa nhầm)
  const handleDelete = (id: string, title: string) => {
    if (
      window.confirm(
        `⚠️ Bạn có chắc chắn muốn xóa vĩnh viễn dự án "${title}" không? Hành động này không thể hoàn tác!`,
      )
    ) {
      deleteMutation.mutate(id);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      {/* Header Area */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Quản lý Dự án
          </h1>
          <p className="text-gray-500 mt-1.5">
            Danh sách các bất động sản đang chờ bán trên hệ thống.
          </p>
        </div>
        <Link
          to="/admin/properties/create"
          className="bg-primary text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-[#b0894b] transition-all flex items-center shadow-lg shadow-primary/30"
        >
          <Plus className="w-5 h-5 mr-1.5" /> Thêm dự án mới
        </Link>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-3xl shadow-[0_2px_20px_rgb(0,0,0,0.02)] border border-gray-100 overflow-hidden">
        {isLoading ? (
          // Trạng thái Loading
          <div className="flex flex-col items-center justify-center h-72 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
            <p className="font-medium">Đang tải dữ liệu dự án...</p>
          </div>
        ) : error ? (
          // Trạng thái Lỗi
          <div className="flex flex-col items-center justify-center h-72 text-red-500">
            <div className="bg-red-50 p-3 rounded-full mb-3">
              <Building2 className="w-8 h-8" />
            </div>
            <p className="font-medium">Đã xảy ra lỗi: {error.message}</p>
          </div>
        ) : !properties || properties.length === 0 ? (
          // Trạng thái Trống (Empty)
          <div className="flex flex-col items-center justify-center h-72 text-gray-400">
            <Building2 className="w-12 h-12 mb-3 text-gray-300" />
            <p className="font-medium">Chưa có dự án nào trong hệ thống.</p>
          </div>
        ) : (
          // Bảng dữ liệu (Table)
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-8 py-5">Tên dự án</th>
                  <th className="px-8 py-5">Loại hình</th>
                  <th className="px-8 py-5">Giá bán</th>
                  <th className="px-8 py-5">Trạng thái</th>
                  <th className="px-8 py-5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {Array.isArray(properties) &&
                  properties.map((item: Property) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/80 transition-colors group"
                    >
                      <td className="px-8 py-5 font-bold text-gray-900">
                        {item.title}
                      </td>
                      <td className="px-8 py-5 capitalize text-gray-600">
                        {item.property_type}
                      </td>
                      <td className="px-8 py-5 text-primary font-bold">
                        {formatPrice(item.price)}
                      </td>
                      <td className="px-8 py-5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            item.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {item.status === "approved"
                            ? "Đã duyệt"
                            : "Chờ duyệt"}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Thêm thẻ div bọc ngoài với flex, items-center và gap-3 để căn đều mọi thứ tăm tắp */}
                        <div className="flex items-center justify-end gap-3">
                          {/* NÚT DUYỆT */}
                          {item.status === "pending" && (
                            <button
                              onClick={() => approveMutation.mutate(item.id)}
                              disabled={approveMutation.isPending}
                              className="text-green-500 hover:text-green-600 transition-colors disabled:opacity-50 flex items-center"
                              title="Duyệt xuất bản"
                            >
                              <CheckCircle className="w-5 h-5" />
                            </button>
                          )}

                          {/* NÚT SỬA */}
                          <Link
                            to={`/admin/properties/edit/${item.id}`}
                            className="text-gray-400 hover:text-blue-500 transition-colors flex items-center"
                            title="Sửa"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>

                          {/* NÚT XÓA */}
                          <button
                            onClick={() => handleDelete(item.id, item.title)}
                            disabled={deleteMutation.isPending}
                            className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50 flex items-center"
                            title="Xóa"
                          >
                            {deleteMutation.isPending &&
                            deleteMutation.variables === item.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash2 className="w-4 h-4" />
                            )}
                          </button>
                        </div>
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
