import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-[#f5f7fb] overflow-hidden">
      {/* Sidebar fixe */}
      <Sidebar />
      
      {/* 
        CORRECTION CRITIQUE :
        - ml-64 = exactement la largeur de la sidebar
        - min-w-0 = empêche l'expansion forcée
        - overflow-hidden = coupe tout débordement
        - w-full = prend le reste de la largeur
      */}
      <div className="flex-1 ml-64 min-w-0 w-full overflow-hidden flex flex-col">
        <Navbar />
        
        {/* 
          CORRECTION :
          - w-full = 100% du parent
          - overflow-x-hidden = pas de scroll horizontal
          - max-w-full = ne dépasse jamais le parent
        */}
        <main className="flex-1 p-6 lg:p-8 w-full max-w-full overflow-x-hidden overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;