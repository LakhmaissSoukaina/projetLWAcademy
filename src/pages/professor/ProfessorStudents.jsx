// src/pages/professor/ProfessorStudents.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getProfessorStudents, getStudentDetails, updateStudentGrade } from "../../api/professorApi";

export default function ProfessorStudents() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [performanceFilter, setPerformanceFilter] = useState("all");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [summaryStats, setSummaryStats] = useState({
    totalStudents: 0,
    activeThisMonth: 0,
    tutorsCount: 0,
    newThisWeek: 0
  });

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await getProfessorStudents();
      setStudents(data);
      
      // Calculer les stats
      const activeCount = data.filter(s => s.lastActivity && new Date(s.lastActivity) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length;
      const tutorsCount = data.filter(s => s.status === "tutor").length;
      const newCount = data.filter(s => s.createdAt && new Date(s.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length;
      
      setSummaryStats({
        totalStudents: data.length,
        activeThisMonth: activeCount,
        tutorsCount: tutorsCount,
        newThisWeek: newCount
      });
    } catch (error) {
      console.error("Error loading students:", error);
      // Données mockées
      setStudents([
        {
          id: 1,
          name: "Lina Mansouri",
          email: "l.mansouri@elite.edu",
          avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCm7kQQidToC0i8R9mY2ec46RxqG7qheOlFRRZdJkwFWnk7Y7eOxdJRonL4oBeBz8AXjB9laNLzwSum63MAOjAxfLJ3Lqi5tNNm_Oh7y-aiKqx0DnedUX5bMU9sZWgl-9A-j5Nxj1ymlmKBExtjq3TrODiOCh0Ckf9aUc2jeTPnMbEUT_YCgchpKgmogdNQ2DHF2FZ56hrG4aWx-iz4DHXgEf6nl6JDjOvCv0P_nKgx0FfZvw7v0BcXtSE7KdeaQdfIvVjS3b8cncQ",
          subjects: ["Maths", "Litt"],
          progress: 85,
          quizSubmitted: 14,
          quizTotal: 15,
          average: 17.5,
          status: "tutor",
          lastActivity: "Aujourd'hui, 09:45",
        },
        {
          id: 2,
          name: "Omar Al-Farsi",
          email: "o.farsi@elite.edu",
          avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAr1aHwpqUmYkeZrdaie8qP-pk8jci90czTjMoCBHJ2qUP-SyeXUN1nQb9DwJLtzNZYdWstQ68MdOxwAmZumUbcIv_EtnCR2tWZKX8IZc_8j3Dju4dBc-h7QbcUT71RArhTOLnfxb6tA-d4redM9YKoMrrE749etfzSuxxPoythAZ2PbxtUyUOkCj5R2ijXBA3-eP9aDwoDHYQZCXkwg7P-fq5erqZVUV6kSu_2Cj2Xxf4Yh6R7_w5qIcd405Req7wXjgPPGV1jEEQ",
          subjects: ["Physique"],
          progress: 42,
          quizSubmitted: 8,
          quizTotal: 15,
          average: 9.2,
          status: "student",
          lastActivity: "Hier, 16:30",
        },
        {
          id: 3,
          name: "Sarah Dubois",
          email: "s.dubois@elite.edu",
          avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuC0O2B0eWcmx9ZBdPHBl23p1Af9R2E3p7LrTjGRHD4k_ZXBoIjFK7RQF1ACV4ZA0BqeENQYfvALXQORvV-4n47R3ZlgDU9a1IBz1-oXtJXL8QWJjQEyBWk_DqyiwsQD8d4G_xFrfmCXNqpB70qCMVskd4VqPBmmNUsyPOFtNK0tvicWPHRucKDWyVQbwjkEp3-ojGEOUugqA0u-6cCcuERew2IzR8c0vUWYf8kpy58YF7MtqHLtXzhUzhqngGbNhZ9IIoO99TA0cUg",
          subjects: ["Maths", "Chimie"],
          progress: 78,
          quizSubmitted: 12,
          quizTotal: 15,
          average: 15.8,
          status: "student",
          lastActivity: "Il y a 2 jours",
        }
      ]);
      setSummaryStats({
        totalStudents: 1284,
        activeThisMonth: 942,
        tutorsCount: 42,
        newThisWeek: 15
      });
    } finally {
      setLoading(false);
    }
  };

  const summaryCards = [
    {
      title: "Total Étudiants",
      value: summaryStats.totalStudents.toLocaleString(),
      icon: "group",
      iconBg: "bg-blue-100 text-blue-700",
      borderColor: "border-blue-600",
      subtitle: "+12% ce mois",
    },
    {
      title: "Actifs ce mois",
      value: summaryStats.activeThisMonth.toLocaleString(),
      icon: "bolt",
      iconBg: "bg-green-100 text-green-600",
      borderColor: "border-green-500",
      subtitle: "Taux de présence: 84%",
    },
    {
      title: "Tuteurs Désignés",
      value: summaryStats.tutorsCount.toLocaleString(),
      icon: "stars",
      iconBg: "bg-yellow-100 text-yellow-600",
      borderColor: "border-yellow-500",
      subtitle: "Ratio 1:30",
    },
    {
      title: "Nouveaux (Semaine)",
      value: summaryStats.newThisWeek.toLocaleString(),
      icon: "person_add",
      iconBg: "bg-purple-100 text-purple-600",
      borderColor: "border-purple-500",
      subtitle: "3 dossiers en attente",
    },
  ];

  const generateAccessCode = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const createPart = (length) => {
      let result = "";
      for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };
    return `${createPart(3)}-${createPart(4)}-${createPart(3)}`;
  };

  const openStudentModal = async (student) => {
    try {
      const details = await getStudentDetails(student.id);
      setSelectedStudent(details);
    } catch (error) {
      setSelectedStudent(student);
    }
    setShowStudentModal(true);
  };

  const openCodeModal = (student) => {
    setSelectedStudent(student);
    setGeneratedCode(generateAccessCode());
    setShowCodeModal(true);
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = subjectFilter === "all" ||
                          student.subjects?.some(s => s.toLowerCase().includes(subjectFilter.toLowerCase()));
    const matchesStatus = statusFilter === "all" || student.status === statusFilter;
    const matchesPerformance = performanceFilter === "all" ||
                          (performanceFilter === "top" && student.average >= 16) ||
                          (performanceFilter === "risk" && student.average < 10);
    return matchesSearch && matchesSubject && matchesStatus && matchesPerformance;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-[#f8f9fc]">
      <main className="w-full px-6 lg:px-10 py-10">
        {/* TITLE */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-blue-700 mb-3">
            <span className="material-symbols-outlined text-sm">school</span>
            <span className="text-xs font-semibold tracking-[0.2em] uppercase">Student Management</span>
          </div>
          <h1 className="text-5xl xl:text-6xl font-bold text-blue-900 font-serif leading-[1.1]">
            Gestion des Étudiants
          </h1>
          <p className="text-lg text-gray-500 mt-4 max-w-3xl">
            Suivez les progrès, identifiez les talents et gérez vos tuteurs au sein de l'académie.
          </p>
        </div>

        {/* SEARCH */}
        <div className="mb-8">
          <div className="relative max-w-xl">
            <span className="material-symbols-outlined absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 text-[20px]">
              search
            </span>
            <input
              type="text"
              placeholder="Rechercher un étudiant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white rounded-2xl py-4 pl-14 pr-6 text-base outline-none focus:ring-2 focus:ring-blue-100 shadow-md border border-gray-100"
            />
          </div>
        </div>

        {/* STATS */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          {summaryCards.map((card, index) => (
            <div key={index} className={`bg-white rounded-3xl p-6 border-l-[4px] ${card.borderColor} shadow-md`}>
              <div className="flex justify-between items-start mb-5">
                <span className="text-sm text-gray-500 font-medium">{card.title}</span>
                <span className={`material-symbols-outlined ${card.iconBg} p-3 rounded-2xl text-[22px]`}>
                  {card.icon}
                </span>
              </div>
              <h3 className="text-[42px] font-bold text-gray-900 leading-none mb-2">{card.value}</h3>
              <p className="text-sm text-gray-500">{card.subtitle}</p>
            </div>
          ))}
        </section>

        {/* FILTERS */}
        <section className="flex flex-wrap items-center gap-3 mb-8">
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="appearance-none bg-white border border-gray-200 rounded-full px-5 py-3 pr-10 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
          >
            <option value="all">Sujets</option>
            <option value="maths">Mathématiques</option>
            <option value="litt">Littérature</option>
            <option value="sciences">Sciences</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="appearance-none bg-white border border-gray-200 rounded-full px-5 py-3 pr-10 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
          >
            <option value="all">Statut</option>
            <option value="student">Étudiant</option>
            <option value="tutor">Tuteur</option>
          </select>

          <select
            value={performanceFilter}
            onChange={(e) => setPerformanceFilter(e.target.value)}
            className="appearance-none bg-white border border-gray-200 rounded-full px-5 py-3 pr-10 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-blue-100 cursor-pointer"
          >
            <option value="all">Performance</option>
            <option value="top">Top Performers</option>
            <option value="risk">At Risk</option>
          </select>
        </section>

        {/* TABLE */}
        <section className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50">
                  <th className="px-6 py-5">Étudiant</th>
                  <th className="px-6 py-5">Sujets</th>
                  <th className="px-6 py-5">Progrès</th>
                  <th className="px-6 py-5 text-center">Quiz</th>
                  <th className="px-6 py-5 text-center">Moyenne</th>
                  <th className="px-6 py-5">Statut</th>
                  <th className="px-6 py-5">Activité</th>
                  <th className="px-6 py-5 text-center">Infos</th>
                  <th className="px-6 py-5 text-center">Code</th>
                  <th className="px-6 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <img src={student.avatar} alt={student.name} className="w-11 h-11 rounded-full object-cover" />
                        <div>
                          <h4 className="font-semibold text-gray-900 text-sm">{student.name}</h4>
                          <p className="text-xs text-gray-400">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex flex-wrap gap-1.5">
                        {student.subjects?.map((subject, i) => (
                          <span key={i} className="bg-blue-50 text-blue-700 text-[11px] px-2.5 py-1 rounded-md font-semibold">
                            {subject}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="w-28">
                        <div className="flex justify-between text-xs mb-1.5">
                          <span className="font-semibold text-gray-700">{student.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-500 ${student.progress >= 60 ? "bg-blue-700" : student.progress >= 40 ? "bg-orange-400" : "bg-red-500"}`} style={{ width: `${student.progress}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-center text-sm text-gray-700 font-medium">
                      {student.quizSubmitted}/{student.quizTotal}
                    </td>
                    <td className="px-6 py-5 text-center">
                      <span className={`px-3 py-1.5 rounded-xl font-semibold text-sm ${student.average >= 14 ? "bg-green-50 text-green-700" : student.average >= 10 ? "bg-orange-50 text-orange-600" : "bg-red-50 text-red-600"}`}>
                        {student.average?.toFixed(1)}/20
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${student.status === "tutor" ? "bg-amber-50 text-amber-700 border border-amber-200" : "bg-blue-50 text-blue-700"}`}>
                        {student.status === "tutor" && <span className="material-symbols-outlined text-[14px]">stars</span>}
                        {student.status === "tutor" ? "Tuteur" : "Étudiant"}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-xs text-gray-400 italic">{student.lastActivity}</td>
                    <td className="px-6 py-5 text-center">
                      <button onClick={() => openStudentModal(student)} className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-3 rounded-xl transition-all">
                        <span className="material-symbols-outlined text-[20px]">visibility</span>
                      </button>
                    </td>
                    <td className="px-6 py-5 text-center">
                      <button onClick={() => openCodeModal(student)} className="bg-green-50 hover:bg-green-100 text-green-700 p-3 rounded-xl transition-all">
                        <span className="material-symbols-outlined text-[20px]">vpn_key</span>
                      </button>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex justify-end gap-1">
                        <button className="p-2 text-gray-300 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all">
                          <span className="material-symbols-outlined text-[18px]">account_circle</span>
                        </button>
                        <button className="p-2 text-gray-300 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all">
                          <span className="material-symbols-outlined text-[18px]">mail</span>
                        </button>
                        <button className="p-2 text-gray-300 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all">
                          <span className="material-symbols-outlined text-[18px]">more_vert</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* STUDENT MODAL */}
      {showStudentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-3xl font-bold text-blue-900">Informations Étudiant</h2>
              <button onClick={() => setShowStudentModal(false)} className="text-gray-400 hover:text-red-500">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-6 mb-8">
                <img src={selectedStudent.avatar} alt={selectedStudent.name} className="w-28 h-28 rounded-full object-cover border-4 border-blue-100" />
                <div>
                  <h3 className="text-3xl font-bold text-gray-900">{selectedStudent.name}</h3>
                  <p className="text-gray-500 mt-1">{selectedStudent.email}</p>
                  <div className="mt-3">{/* Status badge */}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-2xl p-5">
                  <h4 className="text-sm text-gray-500 mb-2">Moyenne</h4>
                  <span className="px-3 py-1.5 rounded-xl font-semibold text-sm bg-green-50 text-green-700">{selectedStudent.average?.toFixed(1)}/20</span>
                </div>
                <div className="bg-gray-50 rounded-2xl p-5">
                  <h4 className="text-sm text-gray-500 mb-2">Quiz Complétés</h4>
                  <p className="font-bold text-2xl text-blue-900">{selectedStudent.quizSubmitted}/{selectedStudent.quizTotal}</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-5">
                  <h4 className="text-sm text-gray-500 mb-3">Progression</h4>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="bg-blue-700 h-full rounded-full" style={{ width: `${selectedStudent.progress}%` }} />
                  </div>
                </div>
                <div className="bg-gray-50 rounded-2xl p-5">
                  <h4 className="text-sm text-gray-500 mb-2">Dernière Activité</h4>
                  <p className="font-semibold text-gray-800">{selectedStudent.lastActivity}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ACCESS CODE MODAL */}
      {showCodeModal && selectedStudent && (
        <div className="fixed inset-0 bg-blue-900/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-8 border-b border-gray-100 flex justify-between items-center">
              <div>
                <h3 className="text-3xl font-bold text-blue-900">Nouveau Code d'Accès</h3>
                <p className="text-gray-500 mt-2">{selectedStudent.name}</p>
              </div>
              <button onClick={() => setShowCodeModal(false)} className="text-gray-400 hover:text-red-500">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
                <div className="bg-white rounded-xl p-5 border border-blue-100 flex justify-between items-center">
                  <span className="font-mono text-2xl font-bold text-blue-900 tracking-widest">{generatedCode}</span>
                  <button onClick={() => navigator.clipboard.writeText(generatedCode)} className="bg-blue-100 hover:bg-blue-200 text-blue-700 p-3 rounded-xl transition-all">
                    <span className="material-symbols-outlined">content_copy</span>
                  </button>
                </div>
              </div>
            </div>
            <div className="p-8 bg-gray-50 flex flex-wrap gap-4 justify-end">
              <button onClick={() => setGeneratedCode(generateAccessCode())} className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl shadow-lg transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">refresh</span>
                Régénérer
              </button>
              <button onClick={() => setShowCodeModal(false)} className="px-8 py-3 text-gray-600 font-semibold hover:text-blue-900 transition-colors">Annuler</button>
              <button onClick={() => { alert(`Code généré pour ${selectedStudent.name} : ${generatedCode}`); setShowCodeModal(false); }} className="px-10 py-3 bg-blue-800 text-white font-semibold rounded-xl shadow-lg hover:brightness-110 transition-all flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px]">check_circle</span>
                Valider
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}