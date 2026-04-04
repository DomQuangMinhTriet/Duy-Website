import { useState } from "react";
import { MessageSquare, Send } from "lucide-react";

export default function PropertyComments({
  propertyId,
}: {
  propertyId: string;
}) {
  const [comment, setComment] = useState("");

  const handlePostComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    // Tạm thời alert, Phase 6 chúng ta sẽ nối API tạo bài viết Diễn đàn vào đây
    alert(`Đã gửi bình luận cho dự án ${propertyId}: ${comment}`);
    setComment("");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-12">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
          <MessageSquare className="w-6 h-6 mr-3 text-primary" />
          Hỏi đáp & Thảo luận
        </h3>

        {/* Khung nhập bình luận */}
        <form onSubmit={handlePostComment} className="mb-8 relative">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Bạn có câu hỏi gì về dự án này? Hãy để lại bình luận..."
            className="w-full bg-gray-50 border-none ring-1 ring-gray-200 focus:ring-primary/50 rounded-2xl p-5 min-h-[120px] outline-none transition-all resize-none"
          ></textarea>
          <button
            type="submit"
            className="absolute bottom-4 right-4 bg-primary text-white p-3 rounded-xl hover:bg-primary/90 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

        {/* Danh sách bình luận mẫu */}
        <div className="space-y-6">
          <div className="flex gap-4 p-5 bg-gray-50 rounded-2xl">
            <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0 flex items-center justify-center font-bold text-gray-500">
              M
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-gray-900">Minh Khách Hàng</span>
                <span className="text-xs text-gray-400">2 giờ trước</span>
              </div>
              <p className="text-gray-600">
                Dự án này bao giờ thì chính thức bàn giao nhà vậy ạ?
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
