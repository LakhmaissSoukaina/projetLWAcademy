// src/pages/professor/TutorSessions.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getTutorSessions, updateTutorSession } from "../../api/professorApi";

export default function TutorSessions() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [sessions, setSessions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const data = await getTutorSessions();
      // L'API retourne un tableau de sessions
      setSessions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading sessions:", error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  const updateSessionStatus = async (id, newStatus) => {
    try {
      await updateTutorSession(id, { status: newStatus });
      setSessions(prev => prev.map(s => 
        s.id === id ? { ...s, status: newStatus } : s
      ));
    } catch (error) {
      console.error("Error updating session:", error);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800';
      case 'ongoing': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-gray-100 text-gray-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'scheduled': return 'Planifiée';
      case 'ongoing': return 'En cours';
      case 'completed': return 'Terminée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredSessions = sessions.filter(session => {
    const matchesSearch = session.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          session.student?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || session.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalSessions = sessions.length;
  const scheduledSessions = sessions.filter(s => s.status === 'scheduled').length;
  const completedSessions = sessions.filter(s => s.status === 'completed').length;
  const totalStudents = [...new Set(sessions.map(s => s.student?.id))].length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full">
      <main className="max-w-7xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
          <div>
            <nav className="flex items-center gap-2 text-xs text-gray-400 mb-2">
              <Link to="/professor" className="hover:text-blue-900">Dashboard</Link>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
              <span className="text-blue-900 font-bold">Tutor Sessions</span>
            </nav>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">Sessions de Tutorat</h1>
            <p className="text-base text-gray-500 max-w-2xl mt-4">
              Gérez vos sessions de tutorat avec les étudiants.
            </p>
          </div>
          <button className="bg-blue-900 text-white px-5 py-2.5 rounded-full font-semibold text-sm shadow-lg hover:bg-blue-800 transition-all flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">add</span>
            Nouvelle Session
          </button>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-800">
                <span className="material-symbols-outlined">event</span>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">Total Sessions</p>
                <p className="text-2xl font-bold text-gray-900">{totalSessions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-800">
                <span className="material-symbols-outlined">schedule</span>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">Planifiées</p>
                <p className="text-2xl font-bold text-gray-900">{scheduledSessions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                <span className="material-symbols-outlined">check_circle</span>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">Terminées</p>
                <p className="text-2xl font-bold text-gray-900">{completedSessions}</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-800">
                <span className="material-symbols-outlined">groups</span>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase">Étudiants</p>
                <p className="text-2xl font-bold text-gray-900">{totalStudents}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 mb-8">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-[280px] relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                <span className="material-symbols-outlined text-lg">search</span>
              </span>
              <input 
                className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-200 text-sm outline-none"
                placeholder="Rechercher par titre ou étudiant..." 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <select 
              className="bg-gray-50 rounded-lg py-3 px-4 text-sm font-semibold text-gray-700 cursor-pointer outline-none"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="all">Tous les statuts</option>
              <option value="scheduled">Planifiées</option>
              <option value="ongoing">En cours</option>
              <option value="completed">Terminées</option>
              <option value="cancelled">Annulées</option>
            </select>
            
            <button 
              onClick={fetchSessions}
              className="p-3 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-lg"
            >
              <span className="material-symbols-outlined">refresh</span>
            </button>
          </div>
        </div>

        {/* Sessions Table */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Titre</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Étudiant</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Cours</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Durée</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Statut</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredSessions.map((session) => (
                  <tr key={session.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{session.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{formatDate(session.date)}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold text-xs">
                          {session.student?.name?.charAt(0) || '?'}
                        </div>
                        <span className="text-sm font-medium">{session.student?.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                        {session.course}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">{session.duration} min</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(session.status)}`}>
                        {getStatusText(session.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {session.status === 'scheduled' && (
                          <button 
                            onClick={() => updateSessionStatus(session.id, 'ongoing')}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition"
                            title="Démarrer"
                          >
                            <span className="material-symbols-outlined text-sm">play_arrow</span>
                          </button>
                        )}
                        {session.status === 'ongoing' && (
                          <button 
                            onClick={() => updateSessionStatus(session.id, 'completed')}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Terminer"
                          >
                            <span className="material-symbols-outlined text-sm">check</span>
                          </button>
                        )}
                        {session.meetingLink && (
                          <a 
                            href={session.meetingLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition"
                            title="Rejoindre"
                          >
                            <span className="material-symbols-outlined text-sm">videocam</span>
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredSessions.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              Aucune session trouvée
            </div>
          )}
        </div>
      </main>
    </div>
  );
}