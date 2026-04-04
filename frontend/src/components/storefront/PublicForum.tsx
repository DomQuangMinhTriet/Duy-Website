import { useQuery } from "@tanstack/react-query";
import { forumService } from "@/services/forumService";
import { MessageSquare, Clock, User } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function PublicForum() {
  const { t } = useLanguage();

  // Gọi API lấy danh sách bài viết
  const { data: response, isLoading } = useQuery({
    queryKey: ["public-posts"],
    queryFn: forumService.getAllPosts, // Hiện tại hàm này đang cần Token. Chúng ta sẽ điều chỉnh backend sau nếu cần mở Public hoàn toàn.
  });

  // Lọc chỉ lấy bài đã được duyệt (Trường hợp API trả về cả đống)
  const approvedPosts =
    response?.data?.filter((post: any) => post.status === "approved") || [];

  if (isLoading) return null; // Ẩn nếu đang tải

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-12">
          <span className="text-primary font-bold uppercase tracking-wider text-sm mb-2 block">
            {t("community")}
          </span>
          <h2 className="text-3xl font-bold text-gray-900">
            Góc nhìn từ chuyên gia & Cộng đồng
          </h2>
        </div>

        {approvedPosts.length === 0 ? (
          <div className="text-center text-gray-500 py-10">
            Chưa có bài viết thảo luận nào.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {approvedPosts.slice(0, 3).map((post: any) => (
              <div
                key={post.id}
                className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className="flex items-center text-xs text-gray-500 mb-4 space-x-4">
                  <span className="flex items-center">
                    <User className="w-3.5 h-3.5 mr-1" /> Người dùng ẩn danh
                  </span>
                  <span className="flex items-center">
                    <Clock className="w-3.5 h-3.5 mr-1" />{" "}
                    {new Date(post.created_at).toLocaleDateString("vi-VN")}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
                  {post.content || "Nội dung bài viết đang được cập nhật..."}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
