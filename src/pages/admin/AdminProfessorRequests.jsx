// src/pages/admin/AdminProfessorRequests.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api/axios";

export default function AdminProfessorRequests() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [filter, setFilter] = useState("pending");
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });

  useEffect(() => {
    fetchApplications();
    fetchStats();
  }, [filter]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      if (filter === "pending") {
        const response = await api.get("/admin/professor-applications");
        setApplications(response.data);
      } else {
        const response = await api.get("/admin/professor-applications/all");
        setApplications(response.data[filter] || []);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get("/admin/professor-applications/all");
      setStats({
        pending: response.data.pending?.length || 0,
        approved: response.data.approved?.length || 0,
        rejected: response.data.rejected?.length || 0
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleApprove = async (id) => {
    setActionLoading(true);
    try {
      const response = await api.post(`/admin/professor-applications/${id}/approve`, { adminNotes });
      alert(`Professeur approuvé ! Mot de passe temporaire: ${response.data.temp_password}`);
      setShowModal(false);
      setAdminNotes("");
      fetchApplications();
      fetchStats();
    } catch (error) {
      console.error("Error approving:", error);
      alert(error.response?.data?.error || "Erreur lors de l'approbation");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    if (!rejectionReason.trim()) {
      alert("Veuillez indiquer une raison pour le rejet");
      return;
    }
    setActionLoading(true);
    try {
      await api.post(`/admin/professor-applications/${id}/reject`, { reason: rejectionReason });
      alert("Candidature rejetée");
      setShowRejectModal(false);
      setRejectionReason("");
      fetchApplications();
      fetchStats();
    } catch (error) {
      console.error("Error rejecting:", error);
      alert(error.response?.data?.error || "Erreur lors du rejet");
    } finally {
      setActionLoading(false);
    }
  };

  const openDetailsModal = async (id) => {
    try {
      const response = await api.get(`/admin/professor-applications/${id}`);
      setSelectedApp(response.data);
      setAdminNotes("");
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching details:", error);
    }
  };

  const openRejectModal = (app) => {
    setSelectedApp(app);
    setRejectionReason("");
    setShowRejectModal(true);
  };

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800"
  };

  const statusLabels = {
    pending: "En attente",
    approved: "Approuvé",
    rejected: "Rejeté"
  };

  const statsCards = [
    { label: "En attente", value: stats.pending, color: "bg-yellow-50 text-yellow-800", border: "border-yellow-200", icon: "pending" },
    { label: "Approuvés", value: stats.approved, color: "bg-green-50 text-green-800", border: "border-green-200", icon: "check_circle" },
    { label: "Rejetés", value: stats.rejected, color: "bg-red-50 text-red-800", border: "border-red-200", icon: "cancel" }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    <div className="pt-6 px-8 pb-12 bg-[#f9f9ff] min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-blue-900">Demandes professeurs</h1>
        <p className="text-gray-500 text-sm mt-1">
          Gérez les candidatures des nouveaux professeurs
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {statsCards.map((stat, idx) => (
          <div key={idx} className={`bg-white rounded-xl p-5 border-l-4 ${stat.border} shadow-sm hover:shadow-md transition`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color} inline-block px-3 py-1 rounded-full mt-2`}>
                  {stat.value}
                </p>
              </div>
              <span className={`material-symbols-outlined text-4xl ${stat.color}`}>
                {stat.icon}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setFilter("pending")}
          className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-2 ${
            filter === "pending" 
              ? "bg-blue-900 text-white shadow-md" 
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          <span className="material-symbols-outlined text-sm">pending</span>
          En attente ({stats.pending})
        </button>
        <button
          onClick={() => setFilter("approved")}
          className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-2 ${
            filter === "approved" 
              ? "bg-blue-900 text-white shadow-md" 
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          <span className="material-symbols-outlined text-sm">check_circle</span>
          Approuvés ({stats.approved})
        </button>
        <button
          onClick={() => setFilter("rejected")}
          className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-2 ${
            filter === "rejected" 
              ? "bg-blue-900 text-white shadow-md" 
              : "bg-white text-gray-600 hover:bg-gray-100 border border-gray-200"
          }`}
        >
          <span className="material-symbols-outlined text-sm">cancel</span>
          Rejetés ({stats.rejected})
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Candidat</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {applications.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                    <span className="material-symbols-outlined text-4xl mb-2">inbox</span>
                    <p>Aucune demande {filter === "pending" ? "en attente" : filter === "approved" ? "approuvée" : "rejetée"}</p>
                  </td>
                </tr>
              ) : (
                applications.map((app) => (
                  <tr key={app.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold">
                          {app.nomComplet?.charAt(0) || app.prenom?.charAt(0)}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{app.nomComplet || `${app.prenom} ${app.nom}`}</p>
                          {app.phone && <p className="text-xs text-gray-400">{app.phone}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{app.email}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{app.createdAt || app.createdAtFormatted}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[app.status]}`}>
                        {statusLabels[app.status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {app.status === "pending" && (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openDetailsModal(app.id)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Voir détails"
                          >
                            <span className="material-symbols-outlined text-sm">visibility</span>
                          </button>
                          <button
                            onClick={() => openDetailsModal(app.id)}
                            className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition"
                          >
                            Approuver
                          </button>
                          <button
                            onClick={() => openRejectModal(app)}
                            className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition"
                          >
                            Rejeter
                          </button>
                        </div>
                      )}
                      {(app.status === "approved" || app.status === "rejected") && (
                        <button
                          onClick={() => openDetailsModal(app.id)}
                          className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition"
                          title="Voir détails"
                        >
                          <span className="material-symbols-outlined text-sm">visibility</span>
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Détails / Approbation */}
      {showModal && selectedApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
                <span className="material-symbols-outlined">person</span>
                Détails de la candidature
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-400 uppercase font-semibold">Nom complet</label>
                  <p className="font-semibold text-gray-900">{selectedApp.nomComplet || `${selectedApp.prenom} ${selectedApp.nom}`}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase font-semibold">Email</label>
                  <p className="text-gray-900">{selectedApp.email}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase font-semibold">Téléphone</label>
                  <p className="text-gray-900">{selectedApp.phone || "Non renseigné"}</p>
                </div>
                <div>
                  <label className="text-xs text-gray-400 uppercase font-semibold">Date de candidature</label>
                  <p className="text-gray-900">{new Date(selectedApp.createdAt).toLocaleString()}</p>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 uppercase font-semibold">Diplômes</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedApp.diploma || "Non renseigné"}</p>
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-400 uppercase font-semibold">Expérience</label>
                <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-700 whitespace-pre-wrap">{selectedApp.experience || "Non renseigné"}</p>
                </div>
              </div>

              {selectedApp.status === "pending" && (
                <>
                  <div>
                    <label className="text-xs text-gray-400 uppercase font-semibold">Note interne (optionnel)</label>
                    <textarea
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      rows="3"
                      className="mt-1 w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="Ajoutez une note interne..."
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => handleApprove(selectedApp.id)}
                      disabled={actionLoading}
                      className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition disabled:opacity-50"
                    >
                      {actionLoading ? "Traitement..." : " Approuver"}
                    </button>
                    <button
                      onClick={() => {
                        setShowModal(false);
                        openRejectModal(selectedApp);
                      }}
                      className="flex-1 bg-red-600 text-white py-3 rounded-xl font-semibold hover:bg-red-700 transition"
                    >
                       Rejeter
                    </button>
                  </div>
                </>
              )}

              {selectedApp.status !== "pending" && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm text-gray-500">
                    Traité le {selectedApp.processedAt ? new Date(selectedApp.processedAt).toLocaleString() : "-"}
                  </p>
                  {selectedApp.adminNotes && (
                    <p className="text-sm text-gray-600 mt-2">
                      <span className="font-semibold">Note :</span> {selectedApp.adminNotes}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Rejet */}
      {showRejectModal && selectedApp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-xl font-bold text-red-600 flex items-center gap-2">
                <span className="material-symbols-outlined">warning</span>
                Rejeter la candidature
              </h2>
            </div>
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                Vous allez rejeter la candidature de <strong>{selectedApp.nomComplet || `${selectedApp.prenom} ${selectedApp.nom}`}</strong>.
              </p>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Raison du rejet <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                  placeholder="Expliquez la raison du rejet..."
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Annuler
                </button>
                <button
                  onClick={() => handleReject(selectedApp.id)}
                  disabled={actionLoading}
                  className="flex-1 bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
                >
                  {actionLoading ? "Traitement..." : "Confirmer le rejet"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}