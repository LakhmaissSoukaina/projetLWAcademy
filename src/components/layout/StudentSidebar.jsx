import { NavLink } from "react-router-dom";

const navItems = [
  {
    name: "Overview",
    icon: "dashboard",
    path: "/student/dashboard",
  },
  {
    name: "My Courses",
    icon: "school",
    path: "/student/courses",
  },
  {
    name: "Tutor Sessions",
    icon: "group",
    path: "/student/sessions",
  },
  {
    name: "Quiz",
    icon: "Quiz Create",
    path: "/student/quizes",
  },
  {
    name: "Assignments",
    icon: "local_library",
    path: "/student/assignments",
  },
  {
    name: "AI Reports",
    icon: "insights",
    path: "/student/aireports",
  },
];

const StudentSidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-100 flex flex-col z-50">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-gray-100">
        <h1 className="text-2xl font-black text-blue-800">
          LW Academy
        </h1>

        <p className="text-xs text-gray-500 mt-1">
          Academic Excellence
        </p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                isActive
                  ? "bg-blue-50 text-blue-800 border-r-4 border-blue-700"
                  : "text-gray-500 hover:bg-gray-50 hover:text-blue-700"
              }`
            }
          >
            <span className="material-symbols-outlined">
              {item.icon}
            </span>

            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Buttons */}
      <div className="p-4 border-t border-gray-100">
        <button className="w-full flex items-center justify-center gap-2 bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-xl font-semibold transition-all">
          <span className="material-symbols-outlined text-sm">
            add
          </span>

          New Request
        </button>

        <div className="mt-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-500 hover:bg-gray-50 transition-all">
            <span className="material-symbols-outlined">
              help
            </span>

            Help Center
          </button>

          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-all">
            <span className="material-symbols-outlined">
              logout
            </span>

            Logout
          </button>
        </div>
      </div>
    </aside>
  );
};

export default StudentSidebar;