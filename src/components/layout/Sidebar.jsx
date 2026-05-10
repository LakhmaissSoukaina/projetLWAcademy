// src/components/layout/Sidebar.jsx
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logoutUser } = useAuth();
  
  const navItems = [
    { to: "/admin", icon: "dashboard", label: "Dashboard", exact: true },
    { to: "/admin/users", icon: "group", label: "Users" },
    { to: "/admin/courses", icon: "school", label: "Courses" },
    { to: "/admin/tutors", icon: "person_search", label: "Tuteurs" },
    { to: "/admin/ai", icon: "insights", label: "IA Reports" },
  ];

  const isActiveRoute = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col py-6 bg-white border-r border-gray-100 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] overflow-y-auto custom-scrollbar flex-shrink-0">
      {/* Logo */}
      <div className="px-6 mb-8">
        <h1 className="font-serif text-xl font-black text-blue-900 tracking-tight">LW Academy</h1>
        <p className="text-xs text-gray-400 mt-1 font-medium">Academic Excellence</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map((item) => {
          const active = isActiveRoute(item.to, item.exact);
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.exact}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                active 
                  ? "bg-blue-50 text-blue-800 font-semibold shadow-sm border-r-4 border-blue-800" 
                  : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
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

      {/* CTA Button */}
      <div className="px-4 mt-6">
        <button className="w-full bg-blue-900 text-white py-3 px-4 rounded-xl text-sm font-semibold shadow-md hover:bg-blue-800 transition-all flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-sm">add</span>
          New Request
        </button>
      </div>

      {/* Bottom Links */}
      <div className="mt-auto px-3 pt-6 border-t border-gray-100 mx-4 space-y-1">
        <a href="#" className="flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors text-sm">
          <span className="material-symbols-outlined text-lg">help</span>
          <span className="font-medium">Help Center</span>
        </a>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-gray-500 hover:bg-gray-50 rounded-xl transition-colors text-sm"
        >
          <span className="material-symbols-outlined text-lg">logout</span>
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;