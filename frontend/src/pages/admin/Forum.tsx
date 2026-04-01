import { useState } from "react";
import {
  MessageSquare,
  CheckCircle,
  Trash2,
  Loader2,
  Clock,
  Globe,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { forumService } from "@/services/forumService";

interface PostData {
  id: string;
  title: string;
  author_id: string;
  status: "pending" | "approved";
  created_at: string;
}

export default function Forum() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending");

  // Lấy danh sách bài viết
  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: forumService.getAllPosts,
  });

  const posts = response?.data || response || [];

  // Mutation duyệt bài
  const approvePostMutation = useMutation({
    mutationFn: (postId: string) =>
      forumService.updatePostStatus(postId, "approved"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => {
      alert("Đã xảy ra lỗi khi duyệt bài viết!");
    },
  });

  const handleApprovePost = async (postId: string) => {
    approvePostMutation.mutate(postId);
  };

  const isUpdating = approvePostMutation.isPending;

  // Lọc bài viết theo Tab hiện tại
  const filteredPosts =
    posts?.filter((post: PostData) => post.status === activeTab) || [];

  return (
    <div className="space-y-6 max-w-7xl mx-auto animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
          Quản lý Diễn đàn
        </h1>
        <p className="text-gray-500 mt-1.5">
          Kiểm duyệt các bài viết thảo luận từ cộng đồng khách hàng.
        </p>
      </div>

      <div className="flex space-x-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("pending")}
          className={`flex items-center px-6 py-3.5 font-semibold text-sm transition-all border-b-2 ${
            activeTab === "pending"
              ? "border-orange-500 text-orange-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Clock className="w-4 h-4 mr-2" />
          Chờ kiểm duyệt (
          {posts?.filter((p: PostData) => p.status === "pending").length || 0})
        </button>
        <button
          onClick={() => setActiveTab("approved")}
          className={`flex items-center px-6 py-3.5 font-semibold text-sm transition-all border-b-2 ${
            activeTab === "approved"
              ? "border-green-500 text-green-600"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Globe className="w-4 h-4 mr-2" />
          Đã xuất bản (
          {posts?.filter((p: PostData) => p.status === "approved").length || 0})
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-[0_2px_20px_rgb(0,0,0,0.02)] border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-72 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
            <p className="font-medium">Đang tải dữ liệu diễn đàn...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-72 text-red-500">
            <p className="font-medium">Đã xảy ra lỗi: {error.message}</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-72 text-gray-400">
            <MessageSquare className="w-12 h-12 mb-3 text-gray-300" />
            <p className="font-medium">Không có bài viết nào trong mục này.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50/50 border-b border-gray-100 text-gray-500 font-semibold uppercase tracking-wider text-xs">
                <tr>
                  <th className="px-8 py-5">Tiêu đề bài viết</th>
                  <th className="px-8 py-5">Tác giả (ID)</th>
                  <th className="px-8 py-5">Ngày gửi</th>
                  <th className="px-8 py-5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredPosts.map((item: PostData) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50/80 transition-colors group"
                  >
                    <td className="px-8 py-5 font-bold text-gray-900 truncate max-w-xs">
                      {item.title}
                    </td>
                    <td className="px-8 py-5 text-gray-500 font-mono text-xs">
                      {item.author_id?.substring(0, 8) || "Unknown"}
                    </td>
                    <td className="px-8 py-5 text-gray-600">
                      {new Date(
                        item.created_at || Date.now(),
                      ).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="px-8 py-5 text-right space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {item.status === "pending" && (
                        <button
                          onClick={() => handleApprovePost(item.id)}
                          disabled={isUpdating}
                          className="px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                          title="Duyệt xuất bản"
                        >
                          {isUpdating ? (
                            "Đang duyệt..."
                          ) : (
                            <>
                              <CheckCircle className="w-4 h-4 inline mr-1" />{" "}
                              Duyệt bài
                            </>
                          )}
                        </button>
                      )}
                      <button
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        title="Xóa bài viết"
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
