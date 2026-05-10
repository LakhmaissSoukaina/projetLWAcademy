import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [language, setLanguage] = useState("fr");

  // État local pour la recherche
  const [searchTerm, setSearchTerm] = useState("");

  const translations = {
    fr: {
      search: "Rechercher dans les logs...",
      dashboard: "Tableau de bord",
      courses: "Cours",
      library: "Bibliothèque",
      schedule: "Planning",
      profile: "Profil",
      settings: "Paramètres",
      logout: "Déconnexion",
      administrator: "Administrateur",
      notifications: "Notifications",
      chat: "Discussion"
    },
    en: {
      search: "Search system logs...",
      dashboard: "Dashboard",
      courses: "Courses",
      library: "Library",
      schedule: "Schedule",
      profile: "Profile",
      settings: "Settings",
      logout: "Logout",
      administrator: "Administrator",
      notifications: "Notifications",
      chat: "Chat"
    }
  };

  const t = translations[language];

  const toggleLanguage = (lang) => {
    setLanguage(lang);
    setShowLanguageMenu(false);
    localStorage.setItem("language", lang);
  };

  // Charger la langue sauvegardée
  useEffect(() => {
    const savedLang = localStorage.getItem("language");
    if (savedLang && (savedLang === "fr" || savedLang === "en")) {
      setLanguage(savedLang);
    }
  }, []);

  // 🔍 Gestion de la recherche + émission d'un événement personnalisé
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // Émettre un événement que le Dashboard pourra écouter
    window.dispatchEvent(new CustomEvent("searchTermChange", { detail: value }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      // Optionnel : action supplémentaire (ex: navigation)
      console.log("Recherche soumise :", searchTerm);
    }
  };

  return (
    <header className="sticky top-0 z-40 h-16 bg-white border-b border-gray-100 shadow-[0_4px_20px_rgba(30,64,175,0.05)]">
      <div className="flex justify-between items-center h-full px-6 lg:px-8">
        {/* Left Side */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 material-symbols-outlined text-lg">
              search
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-full w-56 lg:w-64 text-sm focus:ring-2 focus:ring-blue-200 focus:bg-white focus:border-transparent transition-all outline-none"
              placeholder={t.search}
            />
          </div>
          <nav className="hidden lg:flex gap-6">
            <a href="#" className="text-gray-500 hover:text-blue-700 transition-colors text-sm font-medium">{t.dashboard}</a>
            <a href="#" className="text-gray-500 hover:text-blue-700 transition-colors text-sm font-medium">{t.courses}</a>
            <a href="#" className="text-gray-500 hover:text-blue-700 transition-colors text-sm font-medium">{t.library}</a>
            <a href="#" className="text-gray-500 hover:text-blue-700 transition-colors text-sm font-medium">{t.schedule}</a>
          </nav>
        </div>

        {/* Right Side - inchangé */}
        <div className="flex items-center gap-2">
          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setShowLanguageMenu(!showLanguageMenu)}
              className="text-blue-800 text-sm font-bold cursor-pointer hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors flex items-center gap-1"
            >
              {language === "fr" ? "FR" : "EN"}
              <span className="material-symbols-outlined text-sm">arrow_drop_down</span>
            </button>
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
          
          <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-all relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          
          <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-all">
            <span className="material-symbols-outlined">chat</span>
          </button>
          
          <button className="p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-all">
            <span className="material-symbols-outlined">settings</span>
          </button>

          {/* User Profile */}
          <div className="relative ml-1">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full hover:bg-gray-50 transition-all"
            >
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center ring-2 ring-blue-50">
                <span className="material-symbols-outlined text-blue-800 text-sm">person</span>
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-bold text-gray-900 leading-tight">{user?.prenom} {user?.nom}</p>
                <p className="text-[10px] text-gray-400 leading-tight">{t.administrator}</p>
              </div>
              <span className="material-symbols-outlined text-gray-400 text-sm">expand_more</span>
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-bold text-gray-900">{user?.prenom} {user?.nom}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
                <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">person</span>
                  {t.profile}
                </button>
                <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">settings</span>
                  {t.settings}
                </button>
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">logout</span>
                    {t.logout}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Navbar;