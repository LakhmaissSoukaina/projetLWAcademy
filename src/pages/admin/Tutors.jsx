// src/pages/admin/Tutors.jsx
import { useState, useEffect } from "react";
import { getTutors, updateTutorStatus, deleteTutor } from "../../api/adminApi";

export default function Tutors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("Chapter 04: Advanced Linguistics");
  const [showFilters, setShowFilters] = useState(false);
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔍 Recherche globale (depuis la Navbar)
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");

  useEffect(() => {
    const handleSearch = (event) => {
      setGlobalSearchTerm(event.detail);
    };
    window.addEventListener("searchTermChange", handleSearch);
    return () => window.removeEventListener("searchTermChange", handleSearch);
  }, []);

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
    try {
      setLoading(true);
      const data = await getTutors();
      setTutors(data);
    } catch (error) {
      console.error("Error loading tutors:", error);
      setTutors([
        {
          id: 1,
          rank: 1,
          rankColor: "bg-blue-900 text-white",
          name: "Amira Ben Youssef",
          program: "Bilingual Philology",
          studentId: "8829",
          isOnline: true,
          score: 98.5,
          scoreTrend: "up",
          specialization: "Arabic Morphology",
          specializationColor: "bg-blue-50 text-blue-800",
          isTutor: true,
        },
        {
          id: 2,
          rank: 2,
          rankColor: "bg-blue-100 text-blue-900",
          name: "Cédric Lefebvre",
          program: "Classical Literature",
          studentId: "7741",
          isOnline: false,
          score: 96.2,
          scoreTrend: "up",
          specialization: "French Syntax",
          specializationColor: "bg-gray-100 text-gray-600",
          isTutor: false,
        },
        {
          id: 3,
          rank: 3,
          rankColor: "bg-blue-100 text-blue-900",
          name: "Fatima Al-Sayed",
          program: "Modern History",
          studentId: "9104",
          isOnline: false,
          score: 95.8,
          scoreTrend: "flat",
          specialization: "Dialectology",
          specializationColor: "bg-blue-50 text-blue-800",
          isTutor: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const sections = [
    { id: "stats", title: "Cartes statistiques", keywords: ["potential", "current", "avg", "score", "tutors", "statistiques"] },
    { id: "filterBar", title: "Barre de filtres", keywords: ["filter", "filtre", "search", "recherche", "chapter"] },
    { id: "tutorsTable", title: "Tableau des tuteurs", keywords: ["tableau", "tuteurs", "tutors", "ranking", "performance"] },
    { id: "guidance", title: "Section d'information", keywords: ["responsibility", "criteria", "guidance", "info"] },
  ];

  const isSectionVisible = (sectionKeywords) => {
    if (!globalSearchTerm.trim()) return true;
    const term = globalSearchTerm.toLowerCase();
    return sectionKeywords.some((keyword) => keyword.toLowerCase().includes(term));
  };

  const stats = {
    potential: tutors.filter((t) => !t.isTutor).length,
    current: tutors.filter((t) => t.isTutor).length,
    avgScore:
      tutors.length > 0 ? (tutors.reduce((acc, t) => acc + (t.score || 0), 0) / tutors.length).toFixed(1) : 0,
  };

  const chapters = [
    "Chapter 04: Advanced Linguistics",
    "Chapter 03: Literary Theory",
    "Chapter 02: Phonetics",
    "Chapter 01: Introduction to Syntax",
    "Chapter 05: Semantics & Pragmatics",
  ];

  const toggleTutorStatus = async (id) => {
    const student = tutors.find((t) => t.id === id);
    const newStatus = !student.isTutor;
    try {
      await updateTutorStatus(id, newStatus);
      await fetchTutors();
    } catch (error) {
      console.error("Error updating tutor status:", error);
    }
  };

  const removeTutor = async (id) => {
    if (confirm("Voulez-vous retirer ce tutor ?")) {
      try {
        await deleteTutor(id);
        await fetchTutors();
      } catch (error) {
        console.error("Error removing tutor:", error);
      }
    }
  };

  const getScoreTrendIcon = (trend) => {
    if (trend === "up") return <span className="material-symbols-outlined text-green-500 text-sm">trending_up</span>;
    if (trend === "down") return <span className="material-symbols-outlined text-red-500 text-sm">trending_down</span>;
    return <span className="material-symbols-outlined text-gray-400 text-sm">remove</span>;
  };

  const filteredTutors = tutors.filter(
    (tutor) =>
      tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) || tutor.studentId.includes(searchTerm)
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-full">
      {/* Header */}
      <div>
        <nav className="flex items-center gap-2 mb-4 text-xs text-gray-400">
          <span className="hover:text-blue-800 cursor-pointer font-medium">Admin</span>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-blue-900 font-bold">Tutors</span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <span className="text-blue-900 font-semibold uppercase tracking-widest text-xs">
              Academic Excellence
            </span>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2 font-serif">
              Peer Tutor Selection
            </h1>
            <p className="text-base text-gray-500 max-w-2xl mt-4">
              Identify and appoint top-performing students as Peer Tutors for the upcoming semester.
            </p>
            {globalSearchTerm && (
              <div className="mt-3 inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm">
                <span className="material-symbols-outlined text-sm">search</span>
                Showing only sections matching: <strong>{globalSearchTerm}</strong>
                <button
                  onClick={() => setGlobalSearchTerm("")}
                  className="ml-1 hover:bg-blue-100 rounded-full p-0.5"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-gray-200 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">filter_list</span>
              Filter
            </button>
            <button className="bg-blue-900 text-white px-5 py-2.5 rounded-full font-semibold text-sm shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">save</span>
              Save Assignments
            </button>
          </div>
        </div>
      </div>

      {/* Statistiques */}
      {isSectionVisible(sections.find((s) => s.id === "stats").keywords) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-800">
                <span className="material-symbols-outlined">school</span>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold">Potential Tutors</p>
                <p className="text-2xl font-bold text-gray-900 font-serif">{stats.potential} Candidates</p>
              </div>
            </div>
            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-900 rounded-full"
                style={{ width: `${(stats.potential / (stats.potential + stats.current)) * 100 || 0}%` }}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                <span className="material-symbols-outlined">verified</span>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold">Current Tutors</p>
                <p className="text-2xl font-bold text-gray-900 font-serif">{stats.current} Active</p>
              </div>
            </div>
            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-500 rounded-full"
                style={{ width: `${(stats.current / (stats.potential + stats.current)) * 100 || 0}%` }}
              />
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-all">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-800">
                <span className="material-symbols-outlined">analytics</span>
              </div>
              <div>
                <p className="text-xs text-gray-400 uppercase font-bold">Avg. Grade Mastery</p>
                <p className="text-2xl font-bold text-gray-900 font-serif">{stats.avgScore}%</p>
              </div>
            </div>
            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-700 rounded-full" style={{ width: `${stats.avgScore}%` }} />
            </div>
          </div>
        </div>
      )}

      {/* Filtres */}
      {isSectionVisible(sections.find((s) => s.id === "filterBar").keywords) && showFilters && (
        <section className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[280px] relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
              <span className="material-symbols-outlined text-lg">search</span>
            </span>
            <input
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-200 text-sm outline-none"
              placeholder="Search students by name or ID..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="bg-gray-50 rounded-lg py-3 pl-4 pr-10 text-sm font-semibold text-gray-700 cursor-pointer outline-none"
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(e.target.value)}
          >
            {chapters.map((chapter, idx) => (
              <option key={idx}>{chapter}</option>
            ))}
          </select>

          <button className="p-3 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-lg">
            <span className="material-symbols-outlined">tune</span>
          </button>
        </section>
      )}

      {/* Tableau principal */}
      {isSectionVisible(sections.find((s) => s.id === "tutorsTable").keywords) && (
        <>
          <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
            <div className="p-6 border-b border-gray-50 flex justify-between items-center">
              <h2 className="text-xl font-bold text-blue-900">Student Ranking by Performance</h2>
              <select className="bg-gray-50 rounded-lg py-2 px-4 text-xs font-semibold text-gray-700 cursor-pointer outline-none">
                {chapters.map((chapter, idx) => (
                  <option key={idx}>{chapter}</option>
                ))}
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[900px]">
                <thead className="bg-gray-50/50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Rank</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Student Profile</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Mastery Score</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Specialization</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Designate Peer Tutor</th>
                    <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredTutors.map((student) => (
                    <tr key={student.id} className="hover:bg-blue-50/30 transition-colors group">
                      <td className="px-6 py-6">
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs ${
                            student.rankColor || "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {student.rank}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-900 font-bold text-sm">
                              {student.name.charAt(0)}
                              {student.name.split(" ")[1]?.charAt(0) || ""}
                            </div>
                            {student.isOnline && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 text-sm">{student.name}</p>
                            <p className="text-xs text-gray-400">
                              {student.program} • ID: {student.studentId}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-blue-900 text-sm">{student.score}%</span>
                          {getScoreTrendIcon(student.scoreTrend)}
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <span
                          className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase ${student.specializationColor}`}
                        >
                          {student.specialization}
                        </span>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={student.isTutor}
                            onChange={() => toggleTutorStatus(student.id)}
                            className="w-5 h-5 rounded border-gray-300 text-blue-900 focus:ring-blue-900 cursor-pointer"
                          />
                          <span
                            className={`text-xs font-semibold ${
                              student.isTutor ? "text-blue-900" : "text-gray-400"
                            }`}
                          >
                            {student.isTutor ? "Tutor Assigned" : "Eligible"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6 text-right">
                        {student.isTutor && (
                          <button
                            onClick={() => removeTutor(student.id)}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                          >
                            <span className="material-symbols-outlined">person_remove</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
              <p className="text-xs text-gray-400">
                Showing top <span className="font-bold text-gray-900">{filteredTutors.length}</span> performance
                leaders
              </p>
              <div className="flex gap-2">
                <button className="p-2 border rounded-lg hover:bg-white">
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <button className="p-2 border rounded-lg hover:bg-white">
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Section d'information */}
      {isSectionVisible(sections.find((s) => s.id === "guidance").keywords) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-900 text-white p-8 rounded-xl shadow-lg">
            <div className="flex items-start gap-6">
              <span className="material-symbols-outlined text-4xl text-blue-300">verified_user</span>
              <div>
                <h3 className="text-xl font-bold mb-2">Tutor Responsibility</h3>
                <p className="text-sm text-blue-100">
                  Designated Peer Tutors will be granted 'Academic Assistant' privileges in their respective
                  chapters.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-dashed border-gray-300 p-8 rounded-xl">
            <div className="flex items-start gap-6">
              <span className="material-symbols-outlined text-4xl text-blue-800">info</span>
              <div>
                <h3 className="text-xl font-bold text-blue-900 mb-2">Selection Criteria</h3>
                <p className="text-sm text-gray-500">
                  A minimum score of 95% in chapter-specific quizzes and 90% attendance is required for tutor
                  eligibility.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}