// src/components/student/StudentNavbar.js
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

const StudentNavbar = () => {
  const { user } = useContext(AuthContext);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [language, setLanguage] = useState("fr");
  const [searchTerm, setSearchTerm] = useState(""); // état local

  // Traductions
  const translations = {
    fr: {
      search: "Rechercher des cours, tuteurs ou ressources...",
      frLabel: "FR",
      enLabel: "EN",
      arLabel: "AR",
      premiumScholar: "Étudiant Premium"
    },
    en: {
      search: "Search courses, tutors or resources...",
      frLabel: "FR",
      enLabel: "EN",
      arLabel: "AR",
      premiumScholar: "Premium Scholar"
    }
  };

  const t = translations[language];

  // Charger la langue sauvegardée
  useEffect(() => {
    const savedLang = localStorage.getItem("student_language");
    if (savedLang === "fr" || savedLang === "en") {
      setLanguage(savedLang);
    }
  }, []);

  const toggleLanguage = (lang) => {
    setLanguage(lang);
    setShowLanguageMenu(false);
    localStorage.setItem("student_language", lang);
  };

  // 🔍 Gestion de la recherche + émission d'événement
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    // Émettre un événement que le Dashboard pourra écouter
    window.dispatchEvent(new CustomEvent("searchTermChange", { detail: value }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      console.log("Recherche soumise :", searchTerm);
    }
  };

  const userName = user ? `${user.prenom || "Alexandre"} ${user.nom || "Dubois"}` : "Alexandre Dubois";
  const userRole = user?.roles?.includes("ROLE_ETUDIANT") ? "Étudiant" : t.premiumScholar;

  return (
    <header className="sticky top-0 z-40 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 shadow-sm">
      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          search
        </span>

        <input
          type="text"
          placeholder={t.search}
          value={searchTerm}
          onChange={handleSearchChange}
          onKeyDown={handleKeyDown}
          className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {/* Right Side (inchangé) */}
      <div className="flex items-center gap-6">
        {/* Language Switch */}
        <div className="relative">
          <div className="flex items-center bg-gray-100 rounded-full p-1">
            <button 
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="px-3 py-1 bg-white rounded-full text-xs font-bold text-blue-700 shadow flex items-center gap-1"
            >
              {language === "fr" ? t.frLabel : t.enLabel}
              <span className="material-symbols-outlined text-sm">arrow_drop_down</span>
            </button>
            <button className="px-3 py-1 text-xs font-bold text-gray-500">
              {t.arLabel}
            </button>
          </div>
          
          {showLanguageMenu && (
            <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
              <button 
                onClick={() => toggleLanguage("fr")}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${language === "fr" ? "text-blue-700 font-bold" : "text-gray-700"}`}
              >
                <span className="material-symbols-outlined text-sm">translate</span>
                Français
              </button>
              <button 
                onClick={() => toggleLanguage("en")}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${language === "en" ? "text-blue-700 font-bold" : "text-gray-700"}`}
              >
                <span className="material-symbols-outlined text-sm">translate</span>
                English
              </button>
            </div>
          )}
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4 text-gray-500">
          <button className="relative hover:text-blue-700 transition-all">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>
          <button className="hover:text-blue-700 transition-all">
            <span className="material-symbols-outlined">chat</span>
          </button>
          <button className="hover:text-blue-700 transition-all">
            <span className="material-symbols-outlined">settings</span>
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-200"></div>

        {/* Profile */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:block text-right">
            <p className="text-sm font-bold text-gray-800">{userName}</p>
            <p className="text-xs text-gray-500">{userRole}</p>
          </div>
          <img
            src={user?.photo || "https://i.pravatar.cc/150?img=12"}
            alt="student"
            className="w-10 h-10 rounded-full object-cover border-2 border-blue-100"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://i.pravatar.cc/150?img=12";
            }}
          />
        </div>
      </div>
    </header>
  );
};

export default StudentNavbar;