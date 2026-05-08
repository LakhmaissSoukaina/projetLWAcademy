import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";

function ProfessorNavbar() {
  const { user, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);

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
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-full w-56 lg:w-64 text-sm focus:ring-2 focus:ring-blue-200 focus:bg-white focus:border-transparent transition-all outline-none" 
              placeholder="Search courses..." 
              type="text"
            />
          </div>
          <nav className="hidden lg:flex gap-6">
            <a href="#" className="text-blue-800 font-semibold border-b-2 border-blue-800 pb-1 text-sm">Dashboard</a>
            <a href="#" className="text-gray-500 hover:text-blue-700 transition-colors text-sm font-medium">Courses</a>
            <a href="#" className="text-gray-500 hover:text-blue-700 transition-colors text-sm font-medium">Library</a>
            <a href="#" className="text-gray-500 hover:text-blue-700 transition-colors text-sm font-medium">Schedule</a>
          </nav>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-2">
          <span className="text-blue-800 text-sm font-bold cursor-pointer hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors">
            FR/AR
          </span>
          
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
                <p className="text-sm font-bold text-gray-900 leading-tight">{user?.prenom || "Dr. Alexandre"} {user?.nom || "Mansour"}</p>
                <p className="text-[10px] text-gray-400 leading-tight">Professor</p>
              </div>
              <span className="material-symbols-outlined text-gray-400 text-sm">expand_more</span>
            </button>

            {showDropdown && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-bold text-gray-900">{user?.prenom || "Dr. Alexandre"} {user?.nom || "Mansour"}</p>
                  <p className="text-xs text-gray-400">{user?.email || "a.mansour@w-centre.edu"}</p>
                </div>
                <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">person</span>
                  Profile
                </button>
                <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <span className="material-symbols-outlined text-sm">settings</span>
                  Settings
                </button>
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button 
                    onClick={logout}
                    className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">logout</span>
                    Logout
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

export default ProfessorNavbar;