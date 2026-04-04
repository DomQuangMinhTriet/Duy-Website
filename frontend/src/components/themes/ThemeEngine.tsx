import React from "react";
import LuxuryTheme from "./LuxuryTheme";
import EcoTheme from "./EcoTheme";
// Import các theme tương lai ở đây:
// import ModernTheme from './ModernTheme';
// import ClassicTheme from './ClassicTheme';

// BỘ TỪ ĐIỂN MAP THEME: 'theme_id_trong_database' : Component_Tương_Ứng
const themeMap: Record<string, React.FC<{ property: any }>> = {
  "luxury-theme": LuxuryTheme,
  "eco-theme": EcoTheme,
  // 'modern-theme': ModernTheme,
};

export default function ThemeEngine({ property }: { property: any }) {
  // Lấy ra theme component dựa vào theme_id của dự án
  // Nếu database trả về 1 theme_id lạ (hoặc null), nó sẽ tự động fallback về LuxuryTheme
  const SelectedTheme = themeMap[property.theme_id] || LuxuryTheme;

  return <SelectedTheme property={property} />;
}
