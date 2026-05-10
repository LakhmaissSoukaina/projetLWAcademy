// src/pages/student/StudentDashboard.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getStudentStats, getStudentCourses, getStudentQuizzes, getUpcomingSessions, getActiveTutors } from "../../api/studentApi";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCourses: 0,
    quizCompletion: { completed: 0, total: 0 },
    overallProgress: 0,
    nextSession: null
  });
  const [courses, setCourses] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [tutors, setTutors] = useState([]);

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
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, coursesData, quizzesData, sessionsData, tutorsData] = await Promise.all([
        getStudentStats(),
        getStudentCourses(),
        getStudentQuizzes(),
        getUpcomingSessions(),
        getActiveTutors()
      ]);
      setStats(statsData);
      setCourses(coursesData.slice(0, 2));
      setQuizzes(quizzesData);
      setUpcomingSessions(sessionsData);
      setTutors(tutorsData);
    } catch (error) {
      console.error("Error loading dashboard:", error);
      // Données mockées (images conservées)
      setStats({
        totalCourses: 12,
        quizCompletion: { completed: 24, total: 28 },
        overallProgress: 82,
        nextSession: { date: "2024-10-14", time: "10:30 AM", subject: "Advanced Linguistics" }
      });
      setCourses([
        { id: 1, title: "Advanced French Philology", category: "Linguistics", professor: "Dr. Jean-Pierre", progress: 75, image: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f" },
        { id: 2, title: "Political Systems of the Middle East", category: "Modern History", professor: "Prof. Malika", progress: 32, image: null }
      ]);
      setTutors([
        { id: 1, name: "Emmanuelle L.", subject: "French Literature", online: true, initials: "EL" },
        { id: 2, name: "Ahmed M.", subject: "Arabic Philosophy", online: true, initials: "AM" }
      ]);
      setUpcomingSessions([
        { id: 1, date: "2024-10-14", title: "Ethics in Translation", time: "2:00 PM", type: "Live Seminar" },
        { id: 2, date: "2024-10-16", title: "Grammar Workshop", time: "10:00 AM", type: "Q&A Session" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      month: date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      day: date.getDate()
    };
  };

  // === DÉFINITION DES SECTIONS AVEC MOTS-CLÉS ===
  const sections = [
    { id: "welcome", title: "Message de bienvenue", keywords: ["bienvenue", "welcome", "bonjour", "hello"] },
    { id: "stats", title: "Cartes statistiques", keywords: ["statistiques", "courses", "quiz", "progress", "session", "cartes"] },
    { id: "myCourses", title: "Mes cours", keywords: ["cours", "courses", "matières", "my courses"] },
    { id: "tasks", title: "Quiz et tâches", keywords: ["quiz", "tasks", "tâches", "grade", "status"] },
    { id: "sessions", title: "Sessions à venir", keywords: ["sessions", "upcoming", "agenda", "planning"] },
    { id: "tutors", title: "Tuteurs actifs", keywords: ["tuteurs", "tutors", "active", "chat"] }
  ];

  const isSectionVisible = (keywords) => {
    if (!globalSearchTerm.trim()) return true;
    const term = globalSearchTerm.toLowerCase();
    return keywords.some(kw => kw.toLowerCase().includes(term));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      {isSectionVisible(sections.find(s => s.id === "welcome").keywords) && (
        <section>
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-black text-blue-800 mb-2">
                Bienvenue, {user?.prenom || "Alexandre"} {user?.nom || ""}
              </h1>
              <p className="text-gray-500">
                Your academic journey is {stats.overallProgress}% complete for this semester. Keep going!
              </p>
            </div>
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
        </section>
      )}

      {/* Statistics Cards */}
      {isSectionVisible(sections.find(s => s.id === "stats").keywords) && (
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
                <span className="material-symbols-outlined">book</span>
              </div>
              <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-full">Active</span>
            </div>
            <h2 className="text-3xl font-black text-gray-800">{stats.totalCourses}</h2>
            <p className="text-sm text-gray-500 mt-1">Current Courses</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700">
                <span className="material-symbols-outlined">quiz</span>
              </div>
              <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                {Math.round((stats.quizCompletion.completed / stats.quizCompletion.total) * 100)}%
              </span>
            </div>
            <h2 className="text-3xl font-black text-gray-800">{stats.quizCompletion.completed}/{stats.quizCompletion.total}</h2>
            <p className="text-sm text-gray-500 mt-1">Quiz Completion</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-700">
                <span className="material-symbols-outlined">trending_up</span>
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-green-600">
                <span className="material-symbols-outlined text-sm">arrow_upward</span>
                4.2%
              </span>
            </div>
            <h2 className="text-3xl font-black text-gray-800">{stats.overallProgress}%</h2>
            <p className="text-sm text-gray-500 mt-1">Overall Progress</p>
          </div>

          <div className="bg-blue-700 rounded-2xl p-6 shadow-xl text-white hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
                <span className="material-symbols-outlined">calendar_today</span>
              </div>
              <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">
                {stats.nextSession ? new Date(stats.nextSession.date).toLocaleDateString('en-US', { weekday: 'short' }) : "Tomorrow"}
              </span>
            </div>
            <h2 className="text-3xl font-black">{stats.nextSession?.time || "10:30 AM"}</h2>
            <p className="text-sm text-blue-100 mt-1">Next Session</p>
          </div>
        </section>
      )}

      {/* Main Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Side */}
        <div className="xl:col-span-2 space-y-8">
          {/* Courses */}
          {isSectionVisible(sections.find(s => s.id === "myCourses").keywords) && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">My Courses</h2>
                <button className="text-blue-700 font-semibold hover:underline">View All</button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map((course) => (
                  <div key={course.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
                    <div className="h-40 overflow-hidden relative">
                      {course.image ? (
                        <img src={course.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center">
                          <span className="material-symbols-outlined text-7xl text-blue-300">architecture</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <span className="absolute bottom-4 left-4 text-white text-xs font-bold uppercase tracking-wider">{course.category}</span>
                    </div>

                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-800 mb-5">{course.title}</h3>
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                          {course.professor?.charAt(0) || "P"}
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{course.professor}</p>
                          <p className="text-xs text-gray-500">University Professor</p>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-semibold">Progress</span>
                          <span className="font-bold text-blue-700">{course.progress}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-700" style={{ width: `${course.progress}%` }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Recent Tasks */}
          {isSectionVisible(sections.find(s => s.id === "tasks").keywords) && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Recent Quiz & Tasks</h2>
                <button className="text-sm font-semibold text-blue-700 hover:underline">Export Transcript</button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-6 py-4 text-xs uppercase text-gray-400">Topic</th>
                      <th className="text-left px-6 py-4 text-xs uppercase text-gray-400">Date</th>
                      <th className="text-left px-6 py-4 text-xs uppercase text-gray-400">Status</th>
                      <th className="text-right px-6 py-4 text-xs uppercase text-gray-400">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {quizzes.slice(0, 2).map((quiz) => (
                      <tr key={quiz.id} className="hover:bg-gray-50">
                        <td className="px-6 py-5">
                          <p className="font-semibold text-gray-800">{quiz.title}</p>
                          <p className="text-xs text-gray-500">{quiz.description}</p>
                        </td>
                        <td className="px-6 py-5 text-sm text-gray-600">{quiz.date}</td>
                        <td className="px-6 py-5">
                          <span className={`text-xs font-semibold px-3 py-1 rounded-full ${quiz.status === "Completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                            {quiz.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-right font-bold text-blue-700">{quiz.grade}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}
        </div>

        {/* Right Side */}
        <div className="space-y-8">
          {/* Upcoming Sessions */}
          {isSectionVisible(sections.find(s => s.id === "sessions").keywords) && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Upcoming Sessions</h2>
              <div className="space-y-4">
                {upcomingSessions.map((session) => {
                  const date = formatDate(session.date);
                  return (
                    <div key={session.id} className="flex gap-4 p-4 bg-blue-50 rounded-xl">
                      <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex flex-col items-center justify-center">
                        <span className="text-xs font-bold text-blue-700">{date.month}</span>
                        <span className="font-black text-lg">{date.day}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-800">{session.title}</h3>
                        <p className="text-sm text-gray-500">{session.type} • {session.time}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Tutors */}
          {isSectionVisible(sections.find(s => s.id === "tutors").keywords) && (
            <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Active Tutors</h2>
                <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
              </div>

              <div className="space-y-5">
                {tutors.map((tutor) => (
                  <div key={tutor.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">
                          {tutor.initials}
                        </div>
                        {tutor.online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{tutor.name}</p>
                        <p className="text-xs text-gray-500">{tutor.subject}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-blue-700">
                      <span className="material-symbols-outlined">videocam</span>
                    </button>
                  </div>
                ))}
              </div>

              <button className="w-full mt-6 border border-blue-700 text-blue-700 py-3 rounded-xl font-semibold hover:bg-blue-700 hover:text-white transition-all">
                Book Instant Session
              </button>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}