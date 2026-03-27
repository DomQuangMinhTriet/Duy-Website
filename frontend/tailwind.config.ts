import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}", // Quét toàn bộ app/ bao gồm (admin) và (storefront)
    "./components/**/*.{js,ts,jsx,tsx,mdx}", // Quét thư mục components của bạn
    "./providers/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)", // Link với CSS Variables trong globals.css [cite: 175]
        foreground: "var(--foreground)",
        primary: "var(--primary)",
      },
    },
  },
  plugins: [],
};
export default config;
