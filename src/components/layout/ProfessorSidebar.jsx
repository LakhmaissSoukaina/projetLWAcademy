// src/components/layout/ProfessorSidebar.jsx
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function ProfessorSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  
  const navItems = [
    { to: "/professor", icon: "dashboard", label: "Overview", exact: true },
    { to: "/professor/courses", icon: "school", label: "My Courses" },
    { to: "/professor/students", icon: "group", label: "My Students" },
    { to: "/professor/sessions", icon: "event_upcoming", label: "Tutor Sessions" },
    { to: "/professor/quiz", icon: "quiz", label: "Quiz Create" },
    { to: "/professor/ai", icon: "insights", label: "AI Reports" },
    { to: "/professor/analytics", icon: "analytics", label: "Analytics" },
  ];

  const isActiveRoute = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const handleHelpCenter = () => {
    window.open("https://support.lwacademy.com", "_blank");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col py-6 bg-white border-r border-gray-100 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] overflow-y-auto custom-scrollbar flex-shrink-0">
      {/* Logo & Workspace Label */}
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="material-symbols-outlined text-blue-900 text-xl">school</span>
          <span className="font-serif text-lg font-black text-blue-900 tracking-tight">Workspace</span>
        </div>
        <p className="text-xs text-gray-400 font-medium">Academic Excellence</p>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const active = isActiveRoute(item.to, item.exact);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                active 
                  ? "bg-blue-50 text-blue-800 font-semibold border-r-4 border-blue-800" 
                  : "text-gray-500 hover:bg-gray-50 hover:translate-x-1 hover:text-gray-700"
              }`}
            >
              <span className={`material-symbols-outlined ${active ? 'fill-1' : ''}`}>
                {item.icon}
              </span>
              <span className="text-sm font-semibold">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom Actions */}
      <div className="mt-auto px-4 pt-6 border-t border-gray-50 mx-4 space-y-1">
        <button 
          onClick={handleHelpCenter}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-lg transition-all text-sm"
        >
          <span className="material-symbols-outlined text-lg">help</span>
          <span className="font-medium">Help Center</span>
        </button>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-all text-sm"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default ProfessorSidebar;