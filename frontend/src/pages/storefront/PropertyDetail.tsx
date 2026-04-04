import { useParams, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useQuery } from "@tanstack/react-query";
import { propertyService } from "@/services/propertyService";
import ThemeEngine from "@/components/themes/ThemeEngine";
import PropertyComments from "@/components/storefront/PropertyComments";
import { Loader2 } from "lucide-react";

export default function PropertyDetail() {
  const { slug } = useParams<{ slug: string }>();

  const {
    data: response,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["property", slug],
    queryFn: () => propertyService.getBySlug(slug!),
    enabled: !!slug, // Chỉ gọi API khi có slug
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-12 h-12 animate-spin text-primary" />
      </div>
    );
  }

  // Bắt lỗi nếu gõ sai đường dẫn dự án
  if (error || !response?.data) {
    return <Navigate to="/" replace />;
  }

  const property = response.data;
  const priceFormatted = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(property.price);

  return (
    <>
      {/* KHU VỰC SEO: Tiêm trực tiếp thẻ Meta vào Head của HTML */}
      <Helmet>
        <title>{property.title} | Duy Estate</title>
        <meta
          name="description"
          content={`Dự án ${property.title} với mức giá siêu ưu đãi chỉ từ ${priceFormatted}.`}
        />

        {/* Open Graph cho Facebook / Zalo */}
        <meta property="og:title" content={property.title} />
        <meta
          property="og:description"
          content={`Khám phá ngay dự án bất động sản tuyệt đẹp với mức giá ${priceFormatted}`}
        />
        <meta
          property="og:image"
          content={
            property.attributes?.image_url ||
            "https://duyestate.com/default-cover.jpg"
          }
        />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* GIAO CHO THEME ENGINE RENDER GIAO DIỆN */}
      <ThemeEngine property={property} />
      {/* KHU VỰC BÌNH LUẬN */}
      <PropertyComments propertyId={property.id} />
    </>
  );
}
