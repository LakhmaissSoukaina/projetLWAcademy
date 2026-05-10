// src/components/layout/ProfessorLayout.jsx
import { Outlet } from "react-router-dom";
import ProfessorSidebar from "./ProfessorSidebar";
import ProfessorNavbar from "./ProfessorNavbar";

function ProfessorLayout() {
  return (
    <div className="flex min-h-screen bg-[#f9f9ff] overflow-hidden">
      {/* Sidebar fixe */}
      <ProfessorSidebar />
      
      {/* Main Content Area */}
      <div className="flex-1 ml-64 min-w-0 w-full overflow-hidden flex flex-col">
        <ProfessorNavbar />
        
        {/* Content Canvas - sans padding car les pages ont leur propre padding */}
        <main className="flex-1 bg-[#f9f9ff] w-full max-w-full overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default ProfessorLayout;