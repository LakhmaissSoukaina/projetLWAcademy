// src/components/layout/TutorLayout.jsx
import { Outlet } from "react-router-dom";
import TutorNavbar from "./TutorNavbar";
import TutorSidebar from "./TutorSidebar";

export default function TutorLayout() {
  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#141b2b] font-[Manrope]">
      <TutorSidebar />
      <div className="lg:ml-64">
        <TutorNavbar />
        <main className="p-0">   {/* ← Changé : p-0 au lieu de p-6 lg:p-10 */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}