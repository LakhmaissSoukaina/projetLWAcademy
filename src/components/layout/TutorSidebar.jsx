// src/components/layout/TutorSidebar.jsx

import { NavLink } from "react-router-dom";

const links = [
  {
    name: "Overview",
    icon: "dashboard",
    path: "/tutor/dashboard",
  },
  {
    name: "My Learning",
    icon: "school",
    path: "/tutor/learning",
  },
  {
    name: "Tutor Sessions",
    icon: "event_upcoming",
    path: "/tutor/sessions",
  },
  {
    name: "Resource Hub",
    icon: "local_library",
    path: "/tutor/resources",
  },
  {
    name: "Analytics",
    icon: "insights",
    path: "/tutor/analytics",
  },
];

export default function TutorSidebar() {
  return (
    <aside className="hidden lg:flex fixed top-0 left-0 h-screen w-64 bg-white border-r border-gray-100 flex-col z-50">
      {/* LOGO */}
      <div className="px-8 py-8 border-b border-gray-100">
        <h1 className="text-2xl font-black text-blue-800 tracking-wide">
          LW Academy
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Academic Excellence
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
        <button className="w-full flex items-center gap-4 px-5 py-4 text-gray-500 hover:bg-gray-50 rounded-xl transition">
          <span className="material-symbols-outlined">
            help
          </span>

          <span className="font-semibold">Help Center</span>
        </button>

        <button className="w-full flex items-center gap-4 px-5 py-4 text-red-500 hover:bg-red-50 rounded-xl transition">
          <span className="material-symbols-outlined">
            logout
          </span>

          <span className="font-semibold">Logout</span>
        </button>
      </div>
    </aside>
  );
}