// src/components/layout/StudentLayout.jsx

import { Outlet } from "react-router-dom";

import StudentSidebar from "./StudentSidebar";
import StudentNavbar from "./StudentNavbar";

const StudentLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Sidebar */}
      <StudentSidebar />

      {/* Main Content */}
      <div className="ml-64">
        
        {/* Navbar */}
        <StudentNavbar />

        {/* Page Content */}
        <main className="p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
};

export default StudentLayout;