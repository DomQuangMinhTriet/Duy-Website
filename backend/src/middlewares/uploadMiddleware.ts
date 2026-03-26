import multer from "multer";

// Sử dụng MemoryStorage để giữ file trong RAM, tối ưu tốc độ và không rác ổ cứng server
const storage = multer.memoryStorage();

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Giới hạn dung lượng tối đa 5MB/ảnh để chống spam
  },
});
