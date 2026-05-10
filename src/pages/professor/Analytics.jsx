// src/pages/professor/Analytics.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getAnalytics, getCourseAnalytics } from "../../api/professorApi";

export default function Analytics() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("Last 7 Days");
  const [stats, setStats] = useState({
    totalStudents: 0,
    avgDailyActive: 0,
    completionRate: 0,
    quizPerformance: 0
  });
  const [courses, setCourses] = useState([]);
  const [heatmapData, setHeatmapData] = useState([]);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await getAnalytics();
      setStats({
        totalStudents: data.totalStudents || 24892,
        avgDailyActive: data.avgDailyActive || 1402,
        completionRate: data.completionRate || 76.4,
        quizPerformance: data.quizPerformance || 89
      });
      setCourses(data.topCourses || [
        {
          title: "Advanced Academic French IV",
          enrolled: "1,240 Enrolled",
          rating: "4.9 Rating",
          completion: "92%",
          image: "https://lh3.googleusercontent.com/aida/ADBb0uh-gORIA9_i2XBTfcBGNH7GvGK61nvpvmamftY8UYejNeuJ-2gn1laSL1vEXhF7sdvLuNjY6Ao8oUTl9IRE6MhxfYT2pJH4XYXbSfGEsrOug-CNxULYOog7_nWuCzv64tq-a6oa4MgiBYoPMBgiwf2DlOau_PG8OJajScH80sbddx4qabkfJEDRk2dHvVy5ZE20y7duE3gTvaK9WrkaJUfQwjkusg1lP4OD2T-LWZjynbzUqBPF8VoDkQ5CmN3iGB6gv7Vt-3sIyA"
        },
        {
          title: "Arabic for Professional Contexts",
          enrolled: "892 Enrolled",
          rating: "4.8 Rating",
          completion: "88%",
          icon: "translate",
          color: "bg-blue-100 text-blue-800"
        },
        {
          title: "Research Methodologies in Humanities",
          enrolled: "540 Enrolled",
          rating: "4.7 Rating",
          completion: "74%",
          icon: "architecture",
          color: "bg-slate-100 text-slate-800"
        }
      ]);
      setHeatmapData(data.heatmap || [
        "bg-blue-50", "bg-blue-100", "bg-blue-200", "bg-blue-500", "bg-blue-400", "bg-blue-100", "bg-blue-50",
        "bg-blue-100", "bg-blue-200", "bg-blue-600", "bg-blue-800", "bg-blue-600", "bg-blue-300", "bg-blue-100",
        "bg-blue-50", "bg-blue-400", "bg-blue-800", "bg-blue-900", "bg-blue-700", "bg-blue-500", "bg-blue-200",
        "bg-blue-50", "bg-blue-100", "bg-blue-300", "bg-blue-500", "bg-blue-400", "bg-blue-200", "bg-blue-50",
        "bg-blue-50", "bg-blue-50", "bg-blue-100", "bg-blue-200", "bg-blue-100", "bg-blue-50", "bg-blue-50"
      ]);
    } catch (error) {
      console.error("Error loading analytics:", error);
      // Données par défaut
      setStats({
        totalStudents: 24892,
        avgDailyActive: 1402,
        completionRate: 76.4,
        quizPerformance: 89
      });
    } finally {
      setLoading(false);
    }
  };

  const cards = [
    { title: "Total Students", value: stats.totalStudents.toLocaleString(), growth: "+12.4%", icon: "groups", bg: "bg-blue-50 text-blue-800", trend: "up" },
    { title: "Avg. Daily Active", value: stats.avgDailyActive.toLocaleString(), growth: "+8.1%", icon: "bolt", bg: "bg-green-50 text-green-800", trend: "up" },
    { title: "Completion Rate", value: `${stats.completionRate}%`, growth: "-2.3%", icon: "verified", bg: "bg-orange-50 text-orange-800", trend: "down" },
    { title: "Quiz Performance", value: `${stats.quizPerformance}%`, growth: "+15.7%", icon: "insights", bg: "bg-purple-50 text-purple-800", trend: "up" }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f9f9ff] p-6 lg:p-10">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10">
        <div>
          <nav className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-widest font-bold mb-2">
            <span>Professor</span>
            <span className="material-symbols-outlined text-xs">chevron_right</span>
            <span className="text-blue-800">Analytics</span>
          </nav>
          <h1 className="text-4xl font-black text-blue-900 font-serif">Course Analytics</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-sm border border-gray-100">
            <span className="material-symbols-outlined text-gray-400 mr-2">search</span>
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent outline-none text-sm w-44"
            />
          </div>
          <button className="p-2 rounded-full hover:bg-white transition">
            <span className="material-symbols-outlined text-gray-500">notifications</span>
          </button>
          <button className="p-2 rounded-full hover:bg-white transition">
            <span className="material-symbols-outlined text-gray-500">settings</span>
          </button>
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-800 font-bold">
            {user?.prenom?.[0]}{user?.nom?.[0]}
          </div>
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-12 gap-6">
        {/* KPI CARDS */}
        {cards.map((card, index) => (
          <div key={index} className="col-span-12 md:col-span-6 xl:col-span-3 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${card.bg}`}>
                <span className="material-symbols-outlined">{card.icon}</span>
              </div>
              <span className={`text-xs font-bold flex items-center ${card.trend === "up" ? "text-green-600" : "text-red-500"}`}>
                {card.growth}
                <span className="material-symbols-outlined text-sm ml-1">
                  {card.trend === "up" ? "trending_up" : "trending_down"}
                </span>
              </span>
            </div>
            <p className="text-sm text-gray-500">{card.title}</p>
            <h3 className="text-4xl font-black text-blue-900 mt-2">{card.value}</h3>
          </div>
        ))}

        {/* CHART */}
        <div className="col-span-12 xl:col-span-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 h-[420px] flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-bold text-blue-900 font-serif">Student Growth & Activity</h3>
            <div className="flex gap-2">
              <button className="px-4 py-1 rounded-full text-xs bg-blue-50 text-blue-800 border border-blue-100">
                Monthly
              </button>
              <button className="px-4 py-1 rounded-full text-xs text-gray-500 hover:bg-gray-50">
                Weekly
              </button>
            </div>
          </div>
          <div className="flex-1 relative">
            <svg className="w-full h-full" viewBox="0 0 800 200">
              <path d="M0 180 Q 100 160, 200 140 T 400 100 T 600 60 T 800 40" fill="none" stroke="#00288e" strokeWidth="3" />
              <path d="M0 180 Q 100 160, 200 140 T 400 100 T 600 60 T 800 40 V 200 H 0 Z" fill="url(#grad1)" opacity="0.1" />
              <defs>
                <linearGradient id="grad1" x1="0%" x2="0%" y1="0%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#00288e", stopOpacity: 1 }} />
                  <stop offset="100%" style={{ stopColor: "#00288e", stopOpacity: 0 }} />
                </linearGradient>
              </defs>
              {[40, 80, 120, 160].map((y) => (
                <line key={y} x1="0" x2="800" y1={y} y2={y} stroke="#f1f3ff" strokeWidth="1" />
              ))}
            </svg>
            <div className="flex justify-between mt-4 text-xs text-gray-400">
              {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"].map((month) => (
                <span key={month}>{month}</span>
              ))}
            </div>
          </div>
        </div>

        {/* DISTRIBUTION */}
        <div className="col-span-12 xl:col-span-4 bg-blue-900 text-white rounded-2xl p-6 shadow-xl flex flex-col">
          <h3 className="text-2xl font-bold font-serif mb-2">Student Distribution</h3>
          <p className="text-xs uppercase tracking-widest text-blue-200 mb-8">Top engagement regions</p>
          <div className="space-y-6 flex-1">
            {[
              { name: "Europe", value: "85%", width: "85%" },
              { name: "Middle East", value: "62%", width: "62%" },
              { name: "North America", value: "44%", width: "44%" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between gap-4">
                <span className="text-sm w-28">{item.name}</span>
                <div className="flex-1 bg-blue-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-white h-full rounded-full" style={{ width: item.width }} />
                </div>
                <span className="text-sm font-bold">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-blue-800 mt-8 pt-4">
            <p className="italic text-sm text-blue-200">"Academic excellence is measurable."</p>
          </div>
        </div>

        {/* TOP COURSES */}
        <div className="col-span-12 xl:col-span-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-blue-900 font-serif">Top Courses</h3>
            <span className="material-symbols-outlined text-gray-400 cursor-pointer">more_horiz</span>
          </div>
          <div className="space-y-4">
            {courses.map((course, index) => (
              <div key={index} className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition border border-transparent hover:border-gray-100">
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
                  {course.image ? (
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full flex items-center justify-center ${course.color}`}>
                      <span className="material-symbols-outlined">{course.icon}</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{course.title}</h4>
                  <p className="text-xs text-gray-500">{course.enrolled} • {course.rating}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-blue-900">{course.completion}</p>
                  <span className="text-xs text-gray-400">Completion</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* HEATMAP */}
        <div className="col-span-12 xl:col-span-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-blue-900 font-serif">Engagement Heatmap</h3>
            <select 
              className="bg-gray-50 px-3 py-2 rounded-lg text-sm outline-none"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <div className="grid grid-cols-7 gap-2 flex-1">
            {heatmapData.map((color, index) => (
              <div key={index} className={`aspect-square rounded-md ${color}`} />
            ))}
          </div>
          <div className="flex justify-between items-center mt-6">
            <div className="flex gap-4 text-xs text-gray-400">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-400">Less</span>
              <div className="w-3 h-3 bg-blue-50 rounded-sm"></div>
              <div className="w-3 h-3 bg-blue-400 rounded-sm"></div>
              <div className="w-3 h-3 bg-blue-800 rounded-sm"></div>
              <span className="text-xs text-gray-400">More</span>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="mt-16 border-t border-gray-200 pt-6 flex flex-col lg:flex-row justify-between gap-6 text-xs text-gray-400">
        <div className="flex flex-wrap gap-4">
          <span>© 2026 LW Academy - Professor Analytics Portal</span>
          <a href="#" className="hover:text-blue-800 transition">Privacy Policy</a>
          <a href="#" className="hover:text-blue-800 transition">Data Governance</a>
        </div>
        <div className="flex items-center gap-4">
          <span className="font-semibold text-gray-700">Switch Language</span>
          <div className="flex bg-gray-100 rounded-full p-1">
            <button className="px-3 py-1 bg-white rounded-full text-blue-900 shadow-sm">EN/FR</button>
            <button className="px-3 py-1 text-gray-500">AR</button>
          </div>
        </div>
      </footer>
    </div>
  );
}