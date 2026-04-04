import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/services/propertyService";
import { Building2, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext"; // 1. Import Hook Đa ngôn ngữ
import PublicForum from "@/components/storefront/PublicForum"; // 2. Import Forum

export default function Home() {
  const { t } = useLanguage(); // Lấy hàm t() để dịch

  const { data: response, isLoading } = useQuery({
    queryKey: ["public-properties"],
    queryFn: propertyService.getPublicAll,
  });

  const properties = response?.data || response || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Duy Estate - {t("search_home")}</title>
      </Helmet>

      {/* Hero Banner - Đã thay bằng biến dịch thuật */}
      <div className="bg-gray-900 text-white py-32 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
          {t("search_home")}
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          {t("search_desc")}
        </p>
      </div>

      {/* Grid Danh sách dự án */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-16 mb-20">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            {t("featured_projects")}
          </h2>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
          </div>
        ) : !properties || properties.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <Building2 className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>{t("no_projects")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((item: any) => (
              <Link
                to={`/property/${item.slug}`}
                key={item.id}
                className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-gray-100"
              >
                <div className="relative h-64 overflow-hidden bg-gray-100">
                  {item.attributes?.image_url ? (
                    <img
                      src={item.attributes.image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Building2 className="w-10 h-10 text-gray-300" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 uppercase tracking-wider">
                    {item.property_type === "chung_cu"
                      ? "Căn hộ"
                      : item.property_type === "nha_pho"
                        ? "Nhà phố"
                        : "Đất nền"}
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-1">
                    {item.title}
                  </h3>
                  <p className="text-2xl font-bold text-primary">
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* 3. NHÚNG KHU VỰC CỘNG ĐỒNG VÀO CUỐI TRANG CHỦ */}
      <PublicForum />
    </div>
  );
}
