// src/pages/student/StudentAssignment.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getStudentAssignments, submitAssignment } from "../../api/studentApi";

export default function StudentAssignment() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    averageGrade: 0,
    nextDeadline: null
  });

  // 🔍 Recherche globale (depuis la StudentNavbar)
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");

  useEffect(() => {
    const handleSearch = (event) => {
      setGlobalSearchTerm(event.detail);
    };
    window.addEventListener("searchTermChange", handleSearch);
    return () => window.removeEventListener("searchTermChange", handleSearch);
  }, []);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const data = await getStudentAssignments();
      setAssignments(data);
      
      const pending = data.filter(a => a.status === "pending" || a.status === "À Faire").length;
      const graded = data.filter(a => a.grade);
      const avgGrade = graded.length > 0 
        ? (graded.reduce((acc, a) => acc + a.grade, 0) / graded.length).toFixed(1)
        : 0;
      const upcoming = data
        .filter(a => a.status === "pending")
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))[0];
      
      setStats({
        pending,
        averageGrade: avgGrade,
        nextDeadline: upcoming?.deadline || null,
        nextTitle: upcoming?.title || null
      });
      
    } catch (error) {
      console.error("Error loading assignments:", error);
      setAssignments([
        { id: 1, title: "Analyse Comparative: Voltaire vs Rousseau", description: "Rédiger un essai de 1500 mots sur la notion de contrat social.", deadline: "2023-10-15", status: "pending", color: "blue" },
        { id: 2, title: "Probabilités et Statistiques Appliquées", description: "Résolution de la série d'exercices n°4 sur les variables aléatoires.", deadline: "2023-10-08", status: "submitted", color: "gray", grade: null },
        { id: 3, title: "Histoire de l'Art: Le Modernisme", description: "Exposé sur l'influence du Bauhaus.", deadline: "2023-09-28", status: "graded", color: "green", grade: 18 },
        { id: 4, title: "Anglais Académique: Dissertation", description: "Research paper on linguistic relativity.", deadline: "2023-10-01", status: "late", color: "red" }
      ]);
      setStats({ pending: 4, averageGrade: 16.5, nextDeadline: "2023-10-15", nextTitle: "Philosophie Appliquée" });
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (assignmentId, file) => {
    const formData = new FormData();
    formData.append("file", file);
    try {
      await submitAssignment(assignmentId, formData);
      await fetchAssignments();
      alert("Devoir soumis avec succès !");
    } catch (error) {
      console.error("Error submitting assignment:", error);
      alert("Erreur lors de la soumission");
    }
  };

  const getStatusConfig = (status) => {
    const config = {
      pending: { label: "À Faire", color: "bg-blue-100 text-blue-700", action: "Déposer PDF" },
      submitted: { label: "Soumis", color: "bg-gray-200 text-gray-700", action: "En attente de correction" },
      graded: { label: "Noté", color: "bg-green-100 text-green-700", action: "Voir note" },
      late: { label: "En Retard", color: "bg-red-100 text-red-700", action: "Remettre tardivement" }
    };
    return config[status] || config.pending;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const getDaysUntil = (dateString) => {
    const today = new Date();
    const deadline = new Date(dateString);
    const diffTime = deadline - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  // 🔍 Filtrer les devoirs
  const filteredAssignments = assignments.filter(assignment => {
    if (!globalSearchTerm.trim()) return true;
    const term = globalSearchTerm.toLowerCase();
    return (
      assignment.title.toLowerCase().includes(term) ||
      assignment.description.toLowerCase().includes(term) ||
      (assignment.status && getStatusConfig(assignment.status).label.toLowerCase().includes(term))
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#141b2b]">
      <main className="max-w-[1440px] mx-auto px-6 py-8">
        {/* BREADCRUMB */}
        <nav className="flex items-center gap-2 mb-12 text-sm text-gray-500">
          <span>Dashboard</span>
          <span>›</span>
          <span className="text-blue-800 font-semibold">Assignments</span>
        </nav>

        {/* HEADER */}
        <header className="mb-12">
          <h1 className="text-6xl font-bold text-blue-900 mb-6">
            Gestion des Devoirs
          </h1>
          <p className="text-2xl text-gray-500 max-w-3xl leading-relaxed">
            Consultez vos travaux en cours, téléchargez vos documents et suivez vos résultats académiques.
          </p>
          {globalSearchTerm && (
            <div className="mt-6 inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm">
              <span className="material-symbols-outlined text-sm">search</span>
              Showing assignments matching: <strong>{globalSearchTerm}</strong>
              <button
                onClick={() => setGlobalSearchTerm("")}
                className="ml-1 hover:bg-blue-100 rounded-full p-0.5"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          )}
        </header>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-white rounded-3xl shadow-sm p-8 border-l-4 border-blue-700">
            <p className="uppercase tracking-widest text-sm text-gray-400 mb-4">À Terminer</p>
            <div className="flex items-end gap-3">
              <span className="text-6xl font-bold text-blue-900">{stats.pending}</span>
              <span className="text-gray-500 mb-2">Devoirs actifs</span>
            </div>
          </div>
          <div className="bg-white rounded-3xl shadow-sm p-8 border-l-4 border-gray-700">
            <p className="uppercase tracking-widest text-sm text-gray-400 mb-4">Moyenne Générale</p>
            <div className="flex items-end gap-3">
              <span className="text-6xl font-bold text-gray-900">{stats.averageGrade}</span>
              <span className="text-gray-500 mb-2">/ 20</span>
            </div>
          </div>
          <div className="bg-white rounded-3xl shadow-sm p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 to-transparent"></div>
            <div className="relative z-10">
              <p className="uppercase tracking-widest text-sm text-gray-400 mb-4">Prochain Délai</p>
              <p className="text-3xl font-bold">{stats.nextTitle || "Aucun"}</p>
              {stats.nextDeadline && (
                <p className="text-red-500 font-semibold mt-3 text-lg">
                  Dans {getDaysUntil(stats.nextDeadline)} jours
                </p>
              )}
            </div>
          </div>
        </div>

        {/* TABLEAU */}
        <div className="bg-white rounded-3xl shadow-sm overflow-hidden">
          <div className="p-8 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-3xl font-bold text-blue-900">
              Liste des Travaux
              {globalSearchTerm && (
                <span className="ml-3 text-base font-normal text-gray-500">
                  ({filteredAssignments.length} résultat(s))
                </span>
              )}
            </h3>
            {/* Le bouton "Filtrer" a été supprimé */}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-8 py-5 text-left text-sm uppercase tracking-widest text-gray-400">Titre & Instruction</th>
                  <th className="px-8 py-5 text-left text-sm uppercase tracking-widest text-gray-400">Date Limite</th>
                  <th className="px-8 py-5 text-left text-sm uppercase tracking-widest text-gray-400">Statut</th>
                  <th className="px-8 py-5 text-left text-sm uppercase tracking-widest text-gray-400">Action / Note</th>
                </tr>
              </thead>
              <tbody>
                {filteredAssignments.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="px-8 py-12 text-center text-gray-400">
                      <span className="material-symbols-outlined text-4xl">search_off</span>
                      <p className="mt-2">Aucun devoir ne correspond à votre recherche.</p>
                      <button
                        onClick={() => setGlobalSearchTerm("")}
                        className="mt-3 text-blue-700 font-semibold hover:underline"
                      >
                        Effacer la recherche
                      </button>
                    </td>
                  </tr>
                ) : (
                  filteredAssignments.map((item) => {
                    const statusConfig = getStatusConfig(item.status);
                    return (
                      <tr key={item.id} className="border-t border-gray-100 hover:bg-blue-50/30 transition">
                        <td className="px-8 py-6">
                          <div>
                            <h4 className="font-bold text-lg mb-2">{item.title}</h4>
                            <p className="text-gray-500">{item.description}</p>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2 text-gray-500">
                            <span>📅</span>
                            <span>{formatDate(item.deadline)}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-4 py-2 rounded-full text-xs font-bold uppercase ${statusConfig.color}`}>
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          {item.status === "graded" ? (
                            <div className="flex items-center gap-4">
                              <span className="text-2xl font-bold">{item.grade}/20</span>
                              <button className="hover:scale-110 transition">👁</button>
                            </div>
                          ) : (
                            <button className="font-semibold hover:underline text-blue-700">
                              {statusConfig.action}
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* FOOTER */}
          <div className="p-8 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              {globalSearchTerm 
                ? `Affichage de ${filteredAssignments.length} devoir(s) correspondant(s) à la recherche`
                : `Affichage de ${assignments.length} devoirs`
              }
            </p>
            <div className="flex gap-3">
              <button className="w-10 h-10 rounded-lg border border-gray-200 hover:bg-white transition">←</button>
              <button className="w-10 h-10 rounded-lg border border-gray-200 hover:bg-white transition">→</button>
            </div>
          </div>
        </div>
      </main>

      {/* HELP BUTTON */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-white rounded-full shadow-xl flex items-center justify-center text-2xl hover:scale-105 transition">
        🎧
      </button>

      {/* FOOTER */}
      <footer className="mt-20 border-t border-gray-100 py-10 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="font-bold text-blue-900 uppercase tracking-widest">LW Academy</span>
            <span className="text-sm text-gray-400">© 2024 Excellence in Education.</span>
          </div>
          <div className="flex gap-8 text-sm text-gray-500">
            <a href="#" className="hover:text-blue-700">Privacy Policy</a>
            <a href="#" className="hover:text-blue-700">Academic Integrity</a>
            <a href="#" className="hover:text-blue-700">System Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}