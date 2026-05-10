// src/pages/student/StudentAssignment.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getStudentAssignments, submitAssignment } from "../../api/studentApi";

export default function StudentAssignment() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
  const [stats, setStats] = useState({
    pending: 0,
    averageGrade: 0,
    nextDeadline: null
  });

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

  const handleFileSelect = (assignmentId, file) => {
    setSelectedFile(file);
    setSelectedAssignmentId(assignmentId);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Veuillez sélectionner un fichier PDF");
      return;
    }
    
    const formData = new FormData();
    formData.append("file", selectedFile);
    
    setUploadingId(selectedAssignmentId);
    
    try {
      await submitAssignment(selectedAssignmentId, formData);
      await fetchAssignments();
      alert("Devoir soumis avec succès !");
      setSelectedFile(null);
      setSelectedAssignmentId(null);
    } catch (error) {
      console.error("Error submitting assignment:", error);
      alert("Erreur lors de la soumission");
    } finally {
      setUploadingId(null);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#141b2b]">
      <main className="max-w-[1600px] mx-auto px-8 py-8">
        {/* BREADCRUMB */}
        <nav className="flex items-center gap-2 mb-8 text-sm text-gray-500">
          <span>Dashboard</span>
          <span>›</span>
          <span className="text-blue-800 font-semibold">Assignments</span>
        </nav>

        {/* HEADER */}
        <header className="mb-8">
          <h1 className="text-5xl font-bold text-blue-900 mb-4">
            Gestion des Devoirs
          </h1>
          <p className="text-xl text-gray-500 max-w-3xl leading-relaxed">
            Consultez vos travaux en cours, téléchargez vos documents et suivez vos résultats académiques.
          </p>
        </header>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-blue-700">
            <p className="uppercase tracking-widest text-xs text-gray-400 mb-2">À Terminer</p>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-bold text-blue-900">{stats.pending}</span>
              <span className="text-gray-500 mb-1">Devoirs actifs</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 border-l-4 border-gray-700">
            <p className="uppercase tracking-widest text-xs text-gray-400 mb-2">Moyenne Générale</p>
            <div className="flex items-end gap-2">
              <span className="text-5xl font-bold text-gray-900">{stats.averageGrade}</span>
              <span className="text-gray-500 mb-1">/ 20</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/5 to-transparent"></div>
            <div className="relative z-10">
              <p className="uppercase tracking-widest text-xs text-gray-400 mb-2">Prochain Délai</p>
              <p className="text-xl font-bold">{stats.nextTitle || "Aucun"}</p>
              {stats.nextDeadline && (
                <p className="text-red-500 font-semibold mt-2">
                  Dans {getDaysUntil(stats.nextDeadline)} jours
                </p>
              )}
            </div>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-2xl font-bold text-blue-900">Liste des Travaux</h3>
            <button className="px-4 py-2 rounded-xl border border-blue-700 text-blue-700 text-sm hover:bg-blue-50 transition">
              Filtrer
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px]">
              <thead className="bg-gray-50">
                <tr className="text-left text-xs uppercase tracking-widest text-gray-400">
                  <th className="px-6 py-4">Titre & Instruction</th>
                  <th className="px-6 py-4">Date Limite</th>
                  <th className="px-6 py-4">Statut</th>
                  <th className="px-6 py-4">Action / Note</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map((item, i) => {
                  const statusConfig = getStatusConfig(item.status);
                  const isUploading = uploadingId === item.id;
                  const isSelected = selectedAssignmentId === item.id;
                  
                  return (
                    <tr key={item.id || i} className="border-t border-gray-100 hover:bg-blue-50/30 transition">
                      <td className="px-6 py-5">
                        <div>
                          <h4 className="font-bold text-base mb-1">{item.title}</h4>
                          <p className="text-gray-500 text-sm">{item.description}</p>
                        </div>
                       </td>
                      <td className="px-6 py-5 text-gray-600">
                        {formatDate(item.deadline)}
                       </td>
                      <td className="px-6 py-5">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${statusConfig.color}`}>
                          {statusConfig.label}
                        </span>
                       </td>
                      <td className="px-6 py-5">
                        {item.status === "graded" ? (
                          <div className="flex items-center gap-4">
                            <span className="text-xl font-bold">{item.grade}/20</span>
                            <button className="hover:scale-110 transition">👁</button>
                          </div>
                        ) : item.status === "pending" || item.status === "late" ? (
                          <div className="flex flex-col gap-2">
                            {isSelected && selectedFile && (
                              <span className="text-xs text-green-600">
                                Fichier: {selectedFile.name}
                              </span>
                            )}
                            <div className="flex flex-wrap items-center gap-2">
                              <label className={`
                                px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition
                                ${isSelected ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'}
                              `}>
                                <span className="flex items-center gap-2">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                                  </svg>
                                  {isSelected ? "Fichier sélectionné" : "Choisir un fichier"}
                                </span>
                                <input
                                  type="file"
                                  accept=".pdf,.doc,.docx"
                                  onChange={(e) => handleFileSelect(item.id, e.target.files[0])}
                                  className="hidden"
                                />
                              </label>
                              {isSelected && selectedFile && (
                                <button
                                  onClick={handleUpload}
                                  disabled={isUploading}
                                  className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition flex items-center gap-2"
                                >
                                  {isUploading ? (
                                    <>
                                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                      </svg>
                                      Envoi...
                                    </>
                                  ) : (
                                    <>
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                      </svg>
                                      Envoyer
                                    </>
                                  )}
                                </button>
                              )}
                            </div>
                          </div>
                        ) : (
                          <span className="text-gray-500">{statusConfig.action}</span>
                        )}
                       </td>
                     </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* FOOTER */}
          <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Affichage de {assignments.length} devoirs
            </p>
            <div className="flex gap-2">
              <button className="w-9 h-9 rounded-lg border border-gray-200 hover:bg-white transition">
                ←
              </button>
              <button className="w-9 h-9 rounded-lg border border-gray-200 hover:bg-white transition">
                →
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* HELP BUTTON */}
      <button className="fixed bottom-6 right-6 w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-xl hover:scale-105 transition">
        
      </button>

      {/* FOOTER */}
      <footer className="mt-16 border-t border-gray-100 py-8 bg-white">
        <div className="max-w-[1600px] mx-auto px-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <span className="font-bold text-blue-900 uppercase tracking-widest text-sm">LW Academy</span>
            <span className="text-xs text-gray-400">© 2024 Excellence in Education.</span>
          </div>
          <div className="flex gap-6 text-xs text-gray-500">
            <a href="#" className="hover:text-blue-700">Privacy Policy</a>
            <a href="#" className="hover:text-blue-700">Academic Integrity</a>
            <a href="#" className="hover:text-blue-700">System Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}