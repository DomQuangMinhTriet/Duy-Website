import { Outlet, Link } from "react-router-dom";
import { Building2, Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function StorefrontLayout() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <header className="h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 fixed top-0 w-full z-50 transition-all">
        <div className="max-w-7xl mx-auto px-4 md:px-8 h-full flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center group">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mr-3 shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900 tracking-wide">
              DUY<span className="text-primary font-light">ESTATE</span>
            </span>
          </Link>

          {/* Menu Điều hướng Đa ngôn ngữ */}
          <nav className="hidden md:flex items-center space-x-8 font-medium text-sm text-gray-600">
            <Link to="/" className="hover:text-primary transition-colors">
              {t("home")}
            </Link>
            <Link
              to="/properties"
              className="hover:text-primary transition-colors"
            >
              {t("projects")}
            </Link>
            <Link to="/forum" className="hover:text-primary transition-colors">
              {t("community")}
            </Link>

            {/* Bộ chuyển đổi ngôn ngữ */}
            <div className="relative group cursor-pointer flex items-center">
              <Globe className="w-4 h-4 mr-1 text-gray-500" />
              <span className="uppercase text-gray-700">{language}</span>
              <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                <button
                  onClick={() => setLanguage("vi")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-50 hover:text-primary rounded-t-xl"
                >
                  Tiếng Việt
                </button>
                <button
                  onClick={() => setLanguage("en")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-50 hover:text-primary"
                >
                  English
                </button>
                <button
                  onClick={() => setLanguage("zh")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-50 hover:text-primary"
                >
                  中文
                </button>
                <button
                  onClick={() => setLanguage("ko")}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-50 hover:text-primary rounded-b-xl"
                >
                  한국어
                </button>
              </div>
            </div>
          </nav>

          <Link
            to="/login"
            className="text-sm font-bold bg-gray-900 text-white px-5 py-2.5 rounded-full hover:bg-gray-800 transition-colors"
          >
            {t("login_seller")}
          </Link>
        </div>
      </header>

      <main className="flex-1 pt-20">
        <Outlet />
      </main>

      <footer className="bg-gray-900 text-gray-400 py-12 text-center text-sm">
        <p>© 2026 Duy Estate. Nền tảng Bất động sản Đa nhiệm.</p>
      </footer>
    </div>
  );
}
