const StudentNavbar = () => {
  return (
    <header className="sticky top-0 z-40 h-16 bg-white border-b border-gray-100 flex items-center justify-between px-8 shadow-sm">
      {/* Search */}
      <div className="flex-1 max-w-md relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          search
        </span>

        <input
          type="text"
          placeholder="Search courses, tutors, or resources..."
          className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-6">
        {/* Language Switch */}
        <div className="flex items-center bg-gray-100 rounded-full p-1">
          <button className="px-3 py-1 bg-white rounded-full text-xs font-bold text-blue-700 shadow">
            FR
          </button>

          <button className="px-3 py-1 text-xs font-bold text-gray-500">
            AR
          </button>
        </div>

        {/* Icons */}
        <div className="flex items-center gap-4 text-gray-500">
          <button className="relative hover:text-blue-700 transition-all">
            <span className="material-symbols-outlined">
              notifications
            </span>

            <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
          </button>

          <button className="hover:text-blue-700 transition-all">
            <span className="material-symbols-outlined">
              chat
            </span>
          </button>

          <button className="hover:text-blue-700 transition-all">
            <span className="material-symbols-outlined">
              settings
            </span>
          </button>
        </div>

        {/* Divider */}
        <div className="w-px h-8 bg-gray-200"></div>

        {/* Profile */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:block text-right">
            <p className="text-sm font-bold text-gray-800">
              Alexandre Dubois
            </p>

            <p className="text-xs text-gray-500">
              Premium Scholar
            </p>
          </div>

          <img
            src="https://i.pravatar.cc/150?img=12"
            alt="student"
            className="w-10 h-10 rounded-full object-cover border-2 border-blue-100"
          />
        </div>
      </div>
    </header>
  );
};

export default StudentNavbar;