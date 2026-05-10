// src/components/layout/TutorNavbar.jsx
import { useAuth } from "../../hooks/useAuth";

export default function TutorNavbar() {
  const { user } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <div>
        <h2 className="text-xl font-semibold">Dashboard Tutor</h2>
        <p className="text-sm text-gray-500">Connecté: {user?.email}</p>
      </div>
      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
        {user?.prenom?.[0]}{user?.nom?.[0]}
      </div>
    </header>
  );
}