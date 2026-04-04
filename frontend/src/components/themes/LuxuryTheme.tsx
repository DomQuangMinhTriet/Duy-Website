import LeadForm from "../storefront/LeadForm";

export default function LuxuryTheme({ property }: { property: any }) {
  return (
    <div className="bg-[#0a0a0a] text-white min-h-screen font-serif pb-24 md:pb-0">
      {/* Hero Banner (Giữ nguyên) */}
      <div className="relative h-[70vh] w-full">
        <img
          src={property.attributes?.image_url}
          alt={property.title}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
        <div className="absolute bottom-10 left-4 md:left-20 max-w-3xl">
          <span className="text-[#D4AF37] uppercase tracking-[0.3em] text-xs font-bold mb-4 block">
            Bộ sưu tập Luxury
          </span>
          <h1 className="text-4xl md:text-6xl font-light mb-4 leading-tight">
            {property.title}
          </h1>
          <p className="text-2xl text-gray-300">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(property.price)}
          </p>
        </div>
      </div>

      {/* Main Content & Sidebar */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16 flex flex-col md:flex-row gap-12 relative">
        {/* Cột trái: Thông tin dự án */}
        <div className="w-full md:w-2/3">
          <h2 className="text-2xl text-[#D4AF37] mb-6 border-b border-white/10 pb-4">
            Thông số kỹ thuật
          </h2>
          <div className="grid grid-cols-2 gap-6 text-gray-300 mb-12">
            {Object.entries(property.attributes || {}).map(
              ([key, value]) =>
                key !== "image_url" && (
                  <div
                    key={key}
                    className="bg-white/5 p-4 rounded-xl border border-white/10"
                  >
                    <p className="text-xs uppercase text-gray-500 mb-1">
                      {key.replace("_", " ")}
                    </p>
                    <p className="text-lg font-medium">{String(value)}</p>
                  </div>
                ),
            )}
          </div>
        </div>

        {/* Cột phải: Sticky Lead Form */}
        <div className="w-full md:w-1/3">
          <div className="sticky top-28">
            {/* Gọi Component LeadForm truyền ID và Tên dự án vào */}
            <LeadForm propertyId={property.id} propertyName={property.title} />
          </div>
        </div>
      </div>
    </div>
  );
}
