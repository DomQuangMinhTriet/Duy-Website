"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/authStore";
import {
  MessageSquare,
  CheckCircle,
  Clock,
  Trash2,
  Loader2,
  AlertCircle,
} from "lucide-react";

// Hàm lấy danh sách bài viết (Giả định Backend đã có API GET /api/forum/posts)
const fetchPosts = async (token: string) => {
  const res = await fetch("http://localhost:5000/api/forum/posts", {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Lỗi tải dữ liệu diễn đàn");
  return res.json();
};

export default function ForumManagementPage() {
  const { token, user } = useAuthStore();
  const queryClient = useQueryClient();

  // State quản lý Tab đang active
  const [activeTab, setActiveTab] = useState<"pending" | "approved">("pending");
  const [actionMessage, setActionMessage] = useState({ type: "", text: "" });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["forum-posts"],
    queryFn: () => fetchPosts(token as string),
    enabled: !!token,
  });

  // Mutation: Admin duyệt bài viết
  const approveMutation = useMutation({
    mutationFn: async (postId: string) => {
      const res = await fetch(
        `http://localhost:5000/api/forum/posts/${postId}/approve`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!res.ok) throw new Error("Lỗi khi duyệt bài");
      return res.json();
    },
    onSuccess: () => {
      setActionMessage({
        type: "success",
        text: "Đã xuất bản bài viết thành công!",
      });
      queryClient.invalidateQueries({ queryKey: ["forum-posts"] });
      setTimeout(() => setActionMessage({ type: "", text: "" }), 3000);
    },
    onError: (error: any) => {
      setActionMessage({ type: "error", text: error.message });
      setTimeout(() => setActionMessage({ type: "", text: "" }), 3000);
    },
  });

  // Lọc dữ liệu theo tab hiện tại
  const filteredPosts =
    data?.data?.filter((post: any) => post.status === activeTab) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <MessageSquare className="w-6 h-6 mr-2 text-blue-600" />
            Quản lý Diễn đàn
          </h1>
          <p className="text-gray-500 mt-1">
            Kiểm duyệt bài viết và thảo luận từ cộng đồng.
          </p>
        </div>
      </div>

      {actionMessage.text && (
        <div
          className={`p-4 rounded-lg flex items-center ${actionMessage.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}
        >
          {actionMessage.type === "success" ? (
            <CheckCircle className="w-5 h-5 mr-2" />
          ) : (
            <AlertCircle className="w-5 h-5 mr-2" />
          )}
          {actionMessage.text}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Hệ thống Tabs */}
        <div className="flex border-b border-gray-100">
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex-1 py-4 text-sm font-medium flex items-center justify-center transition-colors ${
              activeTab === "pending"
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Clock className="w-4 h-4 mr-2" />
            Bài viết chờ duyệt
          </button>
          <button
            onClick={() => setActiveTab("approved")}
            className={`flex-1 py-4 text-sm font-medium flex items-center justify-center transition-colors ${
              activeTab === "approved"
                ? "text-green-600 border-b-2 border-green-600 bg-green-50/50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            <CheckCircle className="w-4 h-4 mr-2" />
            Đã xuất bản
          </button>
        </div>

        {/* Bảng Dữ liệu */}
        <div className="p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-500">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2" />
              <p>Đang tải dữ liệu diễn đàn...</p>
            </div>
          ) : isError ? (
            <div className="flex items-center justify-center h-64 text-red-500">
              <p>Không thể tải dữ liệu diễn đàn.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-100 text-gray-600 font-medium">
                  <tr>
                    <th className="px-6 py-4">Tiêu đề / Nội dung</th>
                    <th className="px-6 py-4">Người đăng (ID)</th>
                    <th className="px-6 py-4">Ngày gửi</th>
                    <th className="px-6 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPosts.length === 0 ? (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-12 text-center text-gray-500"
                      >
                        {activeTab === "pending"
                          ? "Không có bài viết nào đang chờ duyệt."
                          : "Chưa có bài viết nào được xuất bản."}
                      </td>
                    </tr>
                  ) : (
                    filteredPosts.map((post: any) => (
                      <tr
                        key={post.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="font-medium text-gray-900 mb-1">
                            {post.title}
                          </div>
                          <div className="text-gray-500 line-clamp-2">
                            {post.content}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                          {post.author_id.substring(0, 8)}...
                        </td>
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(post.created_at).toLocaleDateString(
                            "vi-VN",
                          )}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2 flex justify-end">
                          {activeTab === "pending" &&
                            user?.role === "admin" && (
                              <button
                                onClick={() => approveMutation.mutate(post.id)}
                                disabled={approveMutation.isPending}
                                className="px-3 py-1.5 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-md transition-colors text-xs font-medium flex items-center"
                              >
                                {approveMutation.isPending && (
                                  <Loader2 className="w-3 h-3 animate-spin mr-1" />
                                )}
                                Duyệt bài
                              </button>
                            )}
                          <button className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded-md hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
