// src/components/layout/TutorSidebar.jsx
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const links = [
  {
    name: "Dashboard",
    icon: "dashboard",
    path: "/tutor/dashboard",
  },
  {
    name: "Mes Sessions",
    icon: "event_available",
    path: "/tutor/sessions",
  },
  {
    name: "Historique",
    icon: "history",
    path: "/tutor/history",
  },
  {
    name: "Messages",
    icon: "chat_bubble",
    path: "/tutor/messages",
  },
];

export default function TutorSidebar() {
  const { logoutUser } = useAuth();

  return (
    <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-100 flex-col z-50">
      {/* LOGO */}
      <div className="px-8 py-8 border-b border-gray-100">
        <h1 className="text-2xl font-black text-blue-800 tracking-wide">
          LW Academy
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Tutor Panel
        </p>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.path}
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-4 rounded-r-2xl transition-all duration-200 font-semibold ${
                isActive
                  ? "bg-blue-50 text-blue-800 border-r-4 border-blue-800"
                  : "text-gray-500 hover:bg-gray-50 hover:translate-x-1"
              }`
            }
          >
            <span className="material-symbols-outlined">
              {link.icon}
            </span>
            <span>{link.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* FOOTER */}
      <div className="border-t border-gray-100 p-4 space-y-2">
        <button 
          onClick={() => window.location.href = "/help"}
          className="w-full flex items-center gap-4 px-5 py-4 text-gray-500 hover:bg-gray-50 rounded-xl transition"
        >
          <span className="material-symbols-outlined">help</span>
          <span className="font-semibold">Help Center</span>
        </button>

        <button 
          onClick={logoutUser}
          className="w-full flex items-center gap-4 px-5 py-4 text-red-500 hover:bg-red-50 rounded-xl transition"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-semibold">Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}