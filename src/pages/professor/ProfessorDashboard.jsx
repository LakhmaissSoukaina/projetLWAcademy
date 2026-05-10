// src/pages/professor/ProfessorDashboard.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getProfessorStats, getProfessorCourses, getAnalytics, getTutorSessions } from "../../api/professorApi";

export default function ProfessorDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalStudents: 0, publishedCourses: 0, liveSessions: 0, successRate: 0 });
  const [courses, setCourses] = useState([]);
  const [aiInsights, setAiInsights] = useState([]);
  const [studentTutors, setStudentTutors] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [accessCodes, setAccessCodes] = useState([]);

  useEffect(() => { fetchDashboardData(); }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, coursesData, analyticsData, sessionsData] = await Promise.all([
        getProfessorStats(), getProfessorCourses(), getAnalytics(), getTutorSessions()
      ]);
      setStats(statsData);
      setCourses(coursesData.slice(0, 2));
      setAiInsights(analyticsData.insights || []);
      setStudentTutors(analyticsData.topStudents || []);
      setUpcomingSessions(sessionsData.upcoming || []);
      setAccessCodes(coursesData.flatMap(c => c.accessCodes || []));
    } catch (error) {
      console.error("Error loading dashboard:", error);
      setStats({ totalStudents: 1284, publishedCourses: 24, liveSessions: 8, successRate: 94.2 });
      setCourses([
        {
          id: 1, title: "Structural Integrity III", level: "Undergraduate",
          department: "Applied Sciences", icon: "architecture",
          chapters: [
            { name: "Chapter 4: Stress Distribution in Beams", modules: 14 },
            { name: "Chapter 5: Shear Force Analysis", modules: 9 }
          ]
        },
        {
          id: 2, title: "Advanced Differential Equations", level: "Master",
          department: "Mathematics", icon: "calculate", chapters: []
        }
      ]);
      setAiInsights([
        { title: "Top Difficulty", content: "72% of students struggled with 'Stress-Strain Tensors' in Quiz 4." },
        { title: "Engagement Trend", content: "Course interaction peaked at 9:00 PM Thursday." }
      ]);
      setStudentTutors([
        { id: 1, name: "Sarah Chen",   rank: 1, score: "98%", initials: "SC" },
        { id: 2, name: "Mark Kovacs",  rank: 2, score: "96%", initials: "MK" },
        { id: 3, name: "Leila Janson", rank: 3, score: "95%", initials: "LJ" }
      ]);
      setUpcomingSessions([
        { day: "Monday, Oct 14",    time: "14:00", title: "Office Hours: Engineering Calculus", color: "border-blue-900" },
        { day: "Wednesday, Oct 16", time: "10:30", title: "Group Seminar: AI Ethics",           color: "border-gray-400" },
        { day: "Friday, Oct 18",    time: "16:00", title: "Exam Review: Applied Physics",       color: "border-red-500" }
      ]);
      setAccessCodes([
        { id: 1, course: "Structural Integrity III", code: "LW-2024-STR", uses: "156/200", expiry: "Dec 12, 2024", status: "Active" },
        { id: 2, course: "Diff Equations II",        code: "LW-MATH-EXP", uses: "42/100",  expiry: "Oct 20, 2024", status: "Active" }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    // Pas de ml-* — ProfessorLayout gère déjà ml-64
    // pt-5 px-6 pb-10 cohérent avec les autres pages du projet
    <div className="pt-6 px-8 pb-12 bg-[#f9f9ff] min-h-screen">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-blue-900 font-serif">Professor Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">
          Welcome back, {user?.prenom || "Dr."} {user?.nom || "Professor"}
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {[
          {
            label: "Total Students", value: stats.totalStudents.toLocaleString(),
            badge: <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">trending_up</span>+12%
            </span>
          },
          {
            label: "Published Courses", value: stats.publishedCourses,
            badge: <span className="material-symbols-outlined text-gray-400 text-sm">library_books</span>
          },
          {
            label: "Live Sessions", value: stats.liveSessions,
            badge: <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">This Week</span>
          },
          {
            label: "Success Rate", value: `${stats.successRate}%`,
            badge: (
              <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="bg-blue-900 h-full rounded-full" style={{ width: `${stats.successRate}%` }} />
              </div>
            )
          },
        ].map(({ label, value, badge }) => (
          <div key={label} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">{label}</span>
              {badge}
            </div>
            <span className="text-3xl font-bold text-blue-900">{value}</span>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left — 2 cols */}
        <div className="lg:col-span-2 space-y-6">

          {/* Course Portfolio */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-bold text-blue-900">Course Portfolio</h2>
              <button className="bg-blue-900 text-white px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-blue-800 transition">
                <span className="material-symbols-outlined text-sm">add</span> New Course
              </button>
            </div>
            <div className="space-y-3">
              {courses.map((course) => (
                <div key={course.id} className="border border-gray-100 rounded-lg p-3 hover:border-blue-200 transition bg-gray-50/30">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-3">
                      <div className="h-11 w-11 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-blue-900 text-xl">{course.icon}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400 mb-0.5">
                          <span>{course.level}</span> • <span>{course.department}</span>
                        </div>
                        <h3 className="font-bold text-blue-900 text-sm">{course.title}</h3>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button className="text-blue-900 hover:bg-blue-50 p-1 rounded-full transition">
                        <span className="material-symbols-outlined text-sm">library_add</span>
                      </button>
                      <button className="text-blue-900 hover:bg-blue-50 p-1 rounded-full transition">
                        <span className="material-symbols-outlined text-sm">vpn_key</span>
                      </button>
                    </div>
                  </div>
                  {course.chapters?.length > 0 && (
                    <div className="ml-14 mt-2 space-y-1 border-l-2 border-gray-100 pl-3">
                      {course.chapters.map((chapter, idx) => (
                        <div key={idx} className="flex justify-between items-center py-0.5 text-xs">
                          <span className="text-gray-600">{chapter.name}</span>
                          <span className="text-gray-400 ml-2 whitespace-nowrap">{chapter.modules} Modules</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Access Code Management — JSX corrigé */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-base font-bold text-blue-900 mb-4">Access Code Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b border-gray-100">
                  <tr className="text-xs text-gray-400">
                    <th className="pb-2 text-left font-semibold">Course</th>
                    <th className="pb-2 text-left font-semibold">Code</th>
                    <th className="pb-2 text-left font-semibold">Uses</th>
                    <th className="pb-2 text-left font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {accessCodes.map((code) => (
                    <tr key={code.id} className="border-b border-gray-50">
                      <td className="py-2 text-gray-700 text-xs">{code.course}</td>
                      <td className="py-2 font-mono text-blue-800 font-bold text-xs">{code.code}</td>
                      <td className="py-2 text-gray-500 text-xs">{code.uses}</td>
                      <td className="py-2">
                        <span className="bg-green-50 text-green-700 px-2 py-0.5 rounded-full text-[10px] font-semibold">
                          {code.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Sidebar — 1 col */}
        <div className="space-y-6">

          {/* AI Insights */}
          <div className="bg-blue-900 text-white rounded-xl p-5 shadow-lg">
            <h2 className="text-base font-bold mb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">smart_toy</span> AI Insights
            </h2>
            <div className="space-y-3">
              {aiInsights.map((insight, idx) => (
                <div key={idx} className="bg-white/10 p-3 rounded-lg">
                  <p className="text-[10px] uppercase font-bold mb-1 text-blue-200">{insight.title}</p>
                  <p className="text-xs text-blue-100">{insight.content}</p>
                </div>
              ))}
              <button className="w-full bg-white text-blue-900 font-semibold py-2 rounded-lg hover:bg-gray-100 transition text-xs mt-1">
                View Detailed Report
              </button>
            </div>
          </div>

          {/* Student Tutors */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-base font-bold text-blue-900 mb-3">Student Tutors</h2>
            <div className="space-y-3">
              {studentTutors.map((tutor) => (
                <div key={tutor.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center font-bold text-blue-800 text-xs flex-shrink-0">
                      {tutor.initials}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-800">{tutor.name}</p>
                      <p className="text-[10px] text-gray-400">Rank #{tutor.rank} • {tutor.score}</p>
                    </div>
                  </div>
                  <button className="text-blue-700 text-xs font-semibold hover:underline">Assign</button>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Sessions */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-base font-bold text-blue-900 mb-3">Upcoming Sessions</h2>
            <div className="space-y-3">
              {upcomingSessions.map((session, idx) => (
                <div key={idx} className={`border-l-2 ${session.color || 'border-blue-900'} pl-3 py-0.5`}>
                  <p className="text-[10px] font-bold text-gray-400 uppercase">
                    {session.day} • {session.time}
                  </p>
                  <p className="text-sm font-semibold text-gray-800 mt-0.5">{session.title}</p>
                </div>
              ))}
            </div>
            <button className="w-full text-center text-blue-700 text-xs font-semibold mt-4 hover:underline">
              Open Full Calendar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}