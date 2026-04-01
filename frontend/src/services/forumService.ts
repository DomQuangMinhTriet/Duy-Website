import { apiClient } from "./apiClient";

export const forumService = {
  // Đã thêm chữ /forum vào trước /posts
  getAllPosts: () => apiClient("/forum/posts"),

  updatePostStatus: (postId: string, status: string) =>
    apiClient(`/forum/posts/${postId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  deletePost: (postId: string) =>
    apiClient(`/forum/posts/${postId}`, {
      method: "DELETE",
    }),
};
