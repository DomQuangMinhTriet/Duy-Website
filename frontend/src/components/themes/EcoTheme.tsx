import LeadForm from "../storefront/LeadForm";

export default function EcoTheme({ property }: { property: any }) {
  // 1. Trích xuất attributes (JSONB) an toàn
  let attrs: any = {};
  try {
    if (typeof property.attributes === "string") {
      attrs = JSON.parse(property.attributes);
    } else {
      attrs = property.attributes || {};
    }
  } catch (e) {
    console.error("Lỗi parse attributes EcoTheme:", e);
  }

  // 2. Format dữ liệu
  const imageUrl =
    attrs.image_url ||
    property.image_url ||
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=80";
  const priceFormatted = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(property.price);

  return (
    // Sử dụng màu nền và font chữ theo đúng thiết kế Verdant Living của bạn
    <div className="font-sans bg-[#fbf9f3] min-h-screen text-[#1b1c18] selection:bg-[#163422]/20 relative">
      {/* KHU VỰC NHÚNG FONT & ICON TỰ ĐỘNG (Không cần sửa index.html) */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700;800&family=Noto+Serif:ital,wght@0,400;0,700;1,400&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0');
        
        .font-headline { font-family: 'Noto Serif', serif; }
        .font-body { font-family: 'Manrope', sans-serif; }
        .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 24; }
        .glass-badge { background: rgba(251, 249, 243, 0.7); backdrop-filter: blur(20px); }
      `,
        }}
      />

      {/* NỘI DUNG CHÍNH (Split-screen Layout) */}
      <main className="flex flex-col md:flex-row min-h-screen font-body">
        {/* CỘT TRÁI: Ảnh Sticky nghệ thuật */}
        <section className="w-full md:w-1/2 md:h-screen md:sticky md:top-0 overflow-hidden relative">
          <img
            className="w-full h-full object-cover transition-transform duration-[2000ms] hover:scale-105"
            alt={property.title}
            src={imageUrl}
          />
          <div className="absolute inset-0 bg-black/5"></div>

          {/* Badge Sinh thái (Glassmorphism) */}
          <div className="absolute top-8 left-8 lg:top-12 lg:left-12 glass-badge px-6 py-3 rounded-full flex items-center gap-2 shadow-sm">
            <span className="material-symbols-outlined text-[#163422] text-sm">
              energy_savings_leaf
            </span>
            <span className="text-[#163422] font-bold text-xs uppercase tracking-[0.2em]">
              Dự án sinh thái
            </span>
          </div>

          {/* Label nghệ thuật góc dưới */}
          <div className="absolute bottom-12 left-8 lg:bottom-16 lg:left-12 text-white max-w-xs">
            <p className="text-xs uppercase tracking-[0.3em] font-medium opacity-80 mb-2">
              Verdant Living
            </p>
            <div className="h-[1px] w-12 bg-white/40 mb-4"></div>
            <p className="italic text-sm font-headline">
              Hòa quyện cùng dòng chảy tự nhiên trong thiết kế đương đại.
            </p>
          </div>
        </section>

        {/* CỘT PHẢI: Nội dung cuộn (Scrolling Content) */}
        <section className="w-full md:w-1/2 bg-[#fbf9f3] p-8 md:p-16 lg:p-24 flex flex-col gap-12">
          {/* Tiêu đề & Giá bán */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 border border-[#163422]/30 px-4 py-1.5 rounded-full">
              <span className="material-symbols-outlined text-[16px] text-[#163422]">
                eco
              </span>
              <span className="text-[#163422] text-[11px] font-bold uppercase tracking-[0.15em]">
                Mảng xanh thiên nhiên
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-headline font-bold text-[#163422] leading-tight">
              {property.title}
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-4">
              <span className="text-3xl font-extrabold text-[#163422] tracking-tighter">
                {priceFormatted}
              </span>
              <span className="text-stone-400 text-sm font-medium uppercase tracking-widest">
                Giá niêm yết
              </span>
            </div>
          </div>

          {/* Grid Thông số (Pill Design từ HTML của bạn) */}
          <div className="flex flex-wrap gap-4">
            {attrs.tang && (
              <div className="bg-[#d2e5c6]/50 px-6 py-3 rounded-full flex items-center gap-3">
                <span className="material-symbols-outlined text-[#163422] text-lg">
                  layers
                </span>
                <span className="text-[#2d4b37] font-semibold text-sm">
                  {attrs.tang} Tầng cao
                </span>
              </div>
            )}

            {attrs.phong_ngu && (
              <div className="bg-[#eae8e2] px-6 py-3 rounded-full flex items-center gap-3">
                <span className="material-symbols-outlined text-[#52634a] text-lg">
                  bed
                </span>
                <span className="text-[#52634a] font-semibold text-sm">
                  {attrs.phong_ngu} Phòng ngủ
                </span>
              </div>
            )}

            {attrs.mat_tien && (
              <div className="bg-[#163422] px-6 py-3 rounded-full flex items-center gap-3 shadow-lg shadow-[#163422]/10">
                <span className="material-symbols-outlined text-white text-lg">
                  straighten
                </span>
                <span className="text-white font-semibold text-sm">
                  Mặt tiền {attrs.mat_tien}m
                </span>
              </div>
            )}

            <div className="bg-[#f0eee8] px-6 py-3 rounded-full flex items-center gap-3">
              <span className="material-symbols-outlined text-[#452805] text-lg">
                water_drop
              </span>
              <span className="text-[#452805] font-semibold text-sm">
                View Sinh Thái
              </span>
            </div>
          </div>

          {/* Mô tả dự án */}
          <div className="prose prose-stone max-w-none">
            <p className="text-lg leading-relaxed text-[#424843] font-light">
              Tọa lạc tại vị trí độc bản, <strong>{property.title}</strong> là
              một tác phẩm nghệ thuật kiến trúc bền vững. Không gian được tối ưu
              hóa để đón nhận ánh sáng tự nhiên và gió trời, mang lại cảm giác
              tĩnh tại giữa nhịp sống hiện đại.
            </p>
            <p className="text-lg leading-relaxed text-[#424843] font-light mt-4">
              Chúng tôi không chỉ xây dựng nhà, chúng tôi kiến tạo một hệ sinh
              thái. Với diện tích lớn dành cho mảng xanh, cư dân sẽ được tận
              hưởng bầu không khí trong lành đạt tiêu chuẩn nghỉ dưỡng cao cấp.
            </p>
          </div>

          {/* Khu vực Form Đăng Ký */}
          <div className="bg-[#d2e5c6]/30 rounded-[3rem] p-8 md:p-12 lg:p-14 mt-12 border border-[#d2e5c6]/50 shadow-sm">
            <div className="mb-8">
              <h2 className="text-3xl font-headline font-bold text-[#163422] mb-2">
                Đăng ký tham quan
              </h2>
              <p className="text-[#52634a]">
                Để lại thông tin để nhận tư vấn chuyên sâu và tài liệu dự án chi
                tiết.
              </p>
            </div>

            {/* Tích hợp LeadForm thật của hệ thống */}
            <div className="[&_input]:bg-white [&_input]:border-none [&_input]:ring-1 [&_input]:ring-[#c2c8c0]/50 [&_input]:rounded-full [&_input]:px-6 [&_input]:py-4 [&_button]:rounded-full [&_button]:bg-[#163422] [&_button]:hover:bg-[#2d4b37]">
              <LeadForm
                propertyId={property.id}
                propertyName={property.title}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
