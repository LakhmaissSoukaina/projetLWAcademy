// src/components/layout/TutorLayout.jsx

import { Outlet } from "react-router-dom";
import TutorNavbar from "../../components/layout/TutorNavbar";
import TutorSidebar from "../../components/layout/TutorSidebar";

export default function TutorLayout() {
  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#141b2b] font-[Manrope]">
      {/* SIDEBAR */}
      <TutorSidebar />

      {/* MAIN AREA */}
      <div className="lg:ml-64">
        <TutorNavbar />

        <main className="p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}