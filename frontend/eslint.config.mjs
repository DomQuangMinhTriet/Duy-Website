import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Bạn có thể thêm các rule kiểm tra code khắt khe hơn ở đây trong tương lai
  {
    rules: {
      "react/no-unescaped-entities": "off", // Tắt cảnh báo dấu nháy trong React
      "@typescript-eslint/no-unused-vars": "warn", // Cảnh báo nếu khai báo biến mà không dùng
    },
  },
];

export default eslintConfig;