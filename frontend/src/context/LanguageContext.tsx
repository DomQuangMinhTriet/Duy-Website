import React, {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

type Language = "vi" | "en" | "zh" | "ko";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string; // Hàm dịch (Translate function)
}

const translations = {
  vi: {
    home: "Trang chủ",
    projects: "Dự án",
    community: "Cộng đồng",
    login_seller: "Đăng nhập Seller",
    search_home: "Tìm kiếm ngôi nhà mơ ước của bạn",
    search_desc:
      "Bộ sưu tập các dự án bất động sản cao cấp được tuyển chọn kỹ lưỡng.",
    featured_projects: "Dự án nổi bật",
    no_projects: "Hiện chưa có dự án nào được mở bán.",
    call_now: "Gọi ngay",
    get_quote: "Nhận báo giá",
  },
  en: {
    home: "Home",
    projects: "Projects",
    community: "Community",
    login_seller: "Seller Login",
    search_home: "Find your dream home",
    search_desc: "A curated collection of premium real estate projects.",
    featured_projects: "Featured Projects",
    no_projects: "No projects available at the moment.",
    call_now: "Call Now",
    get_quote: "Get Quote",
  },
  zh: {
    home: "首页",
    projects: "项目",
    community: "社区",
    login_seller: "卖家登录",
    search_home: "寻找您的梦想家园",
    search_desc: "精选优质房地产项目集合。",
    featured_projects: "精选项目",
    no_projects: "目前没有可用的项目。",
    call_now: "立即致电",
    get_quote: "获取报价",
  },
  ko: {
    home: "홈",
    projects: "프로젝트",
    community: "커뮤니티",
    login_seller: "판매자 로그인",
    search_home: "꿈의 집을 찾아보세요",
    search_desc: "엄선된 프리미엄 부동산 프로젝트 컬렉션입니다.",
    featured_projects: "추천 프로젝트",
    no_projects: "현재 사용 가능한 프로젝트가 없습니다.",
    call_now: "지금 전화하기",
    get_quote: "견적 받기",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Lấy ngôn ngữ từ localStorage hoặc mặc định là Tiếng Việt
  const [language, setLanguageState] = useState<Language>(
    (localStorage.getItem("language") as Language) || "vi",
  );

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang); // Lưu lại lựa chọn của người dùng
  };

  // Hàm t() dùng để gọi từ khóa ra giao diện
  const t = (key: string): string => {
    return (translations[language] as any)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
