// src/pages/tutor/TutorDashboard.jsx
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api/axios";
 
export default function TutorDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total_sessions: 0,
    avg_rating: 0,
    total_students: 0,
    total_hours: 0,
  });
  const [sessions, setSessions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statsData, setStatsData] = useState([
    { title: "Sessions Given",  value: "0", extra: "+0% this month", icon: "menu_book" },
    { title: "Avg Rating",      value: "0", extra: "Top 0%",         icon: "star" },
    { title: "Students Helped", value: "0", extra: "Global Reach",   icon: "groups" },
    { title: "Total Hours",     value: "0", extra: "0 Pending",      icon: "schedule" },
  ]);
 
  const fetchTutorData = useCallback(async () => {
    try {
      setLoading(true);
      const [statsResponse, sessionsResponse] = await Promise.all([
        api.get("/tutor/stats"),
        api.get("/tutor/sessions"),
      ]);
      const tutorStats   = statsResponse.data;
      const sessionsData = sessionsResponse.data;
 
      setSessions(sessionsData.slice(0, 3));
      setReviews(sessionsData.filter(s => s.rating && s.comment).slice(0, 2));
      setStats({
        total_sessions: sessionsData.length,
        avg_rating:     tutorStats.avg_rating     || 0,
        total_students: tutorStats.total_students || 0,
        total_hours:    tutorStats.total_hours    || 0,
      });
      setStatsData([
        { title: "Sessions Given",  value: sessionsData.length.toString(),              extra: `${tutorStats.total_hours || 0} hours total`, icon: "menu_book" },
        { title: "Avg Rating",      value: (tutorStats.avg_rating || 0).toFixed(2),     extra: "Top 10%",          icon: "star" },
        { title: "Students Helped", value: tutorStats.total_students?.toString() || "0", extra: "Active learners",  icon: "groups" },
        { title: "Total Hours",     value: (tutorStats.total_hours || 0).toFixed(1),    extra: "This semester",    icon: "schedule" },
      ]);
    } catch (error) {
      console.error("Erreur chargement données:", error);
    } finally {
      setLoading(false);
    }
  }, []);
 
  useEffect(() => {
    let cancelled = false;
    const load = async () => { if (!cancelled) await fetchTutorData(); };
    load();
    return () => { cancelled = true; };
  }, [fetchTutorData]);
 
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      day:   date.getDate(),
      month: date.toLocaleString("fr", { month: "short" }).toUpperCase(),
      time:  date.toLocaleTimeString("fr", { hour: "2-digit", minute: "2-digit" }),
    };
  };
 
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-800 mx-auto"></div>
          <p className="mt-3 text-gray-600 text-sm">Chargement du dashboard...</p>
        </div>
      </div>
    );
  }
 
  return (
    // pt-5 px-6 pb-10 — cohérent avec TutorSessions et TutorSessionHistory
    <div className="pt-5 px-6 pb-10 space-y-7 bg-gray-50 min-h-screen">
 
      {/* HERO */}
      <section>
        <span className="uppercase tracking-[4px] text-xs font-bold text-blue-700">
          Welcome Back Tutor
        </span>
        <h1 className="text-4xl font-black text-blue-950 mt-2">
          Hello, {user?.prenom || "Tutor"} {user?.nom || ""}
        </h1>
        <p className="text-gray-400 mt-1 text-sm">{user?.email}</p>
      </section>
 
      {/* KPI */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
        {statsData.map((item, index) => (
          <div key={index} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-800 text-2xl">{item.icon}</span>
              </div>
              <span className="text-xs text-blue-700 font-semibold">{item.extra}</span>
            </div>
            <p className="text-gray-500 text-sm font-medium">{item.title}</p>
            <h2 className="text-4xl font-black mt-2">{item.value}</h2>
          </div>
        ))}
      </section>
 
      {/* MAIN GRID */}
      <section className="grid grid-cols-12 gap-5">
 
        {/* LEFT */}
        <div className="col-span-12 xl:col-span-4 space-y-5">
 
          {/* PROFILE */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-3xl font-bold text-blue-800">
                {user?.prenom?.[0]}{user?.nom?.[0]}
              </div>
              <h3 className="text-2xl font-bold mt-4">{user?.prenom} {user?.nom}</h3>
              <p className="text-blue-700 font-semibold mt-1 text-sm">Senior Tutor | Academic Excellence</p>
            </div>
            <p className="text-gray-600 leading-relaxed mt-4 text-sm">
              Specializing in graduate-level quantitative research and bilingual curriculum development.
            </p>
            <button className="w-full mt-6 py-3 bg-blue-800 text-white rounded-xl font-bold hover:bg-blue-900 transition text-sm">
              Edit Public Profile
            </button>
          </div>
 
          {/* RECENT SESSIONS */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-base font-bold text-blue-900">Recent Sessions</h3>
              <span className="px-2.5 py-1 rounded-full bg-blue-500 text-white text-xs font-bold">
                {stats.total_sessions} TOTAL
              </span>
            </div>
            <div className="divide-y divide-gray-100">
              {sessions.length > 0 ? (
                sessions.map((session, i) => {
                  const date = formatDate(session.date);
                  return (
                    <div key={i} className="p-5">
                      <div className="flex justify-between mb-2">
                        <div>
                          <h4 className="font-bold">Session #{session.id}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">Student #{session.student_id}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold">{date.day}</p>
                          <p className="text-xs text-gray-500">{date.month}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">{date.time}</span>
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                          session.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                          {session.status || "Scheduled"}
                        </span>
                      </div>
                      {session.rating && (
                        <div className="flex text-yellow-500 mt-1 text-sm">
                          {"★".repeat(Math.floor(session.rating))}
                          {session.rating % 1 >= 0.5 && "½"}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="p-5 text-center text-gray-500 text-sm">Aucune session pour le moment</div>
              )}
            </div>
          </div>
        </div>
 
        {/* RIGHT */}
        <div className="col-span-12 xl:col-span-8 space-y-5">
 
          {/* UPCOMING SESSIONS */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-blue-900 mb-5">Upcoming Sessions</h3>
            <div className="space-y-4">
              {sessions.filter(s => s.status !== "completed").length > 0 ? (
                sessions.filter(s => s.status !== "completed").map((session, i) => {
                  const date = formatDate(session.date);
                  return (
                    <div key={i} className="flex flex-col md:flex-row md:items-center gap-4 p-5 rounded-xl bg-blue-50 border-l-4 border-blue-800">
                      <div className="w-16 text-center">
                        <p className="text-xs font-bold text-gray-500">{date.month}</p>
                        <h4 className="text-3xl font-black">{date.day}</h4>
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold">Session #{session.id}</h4>
                        <p className="text-gray-500 mt-0.5 text-sm">{date.time}</p>
                      </div>
                      <button className="px-5 py-2.5 bg-blue-800 text-white rounded-xl font-semibold text-sm">
                        Join Session
                      </button>
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-gray-500 py-6 text-sm">Aucune session planifiée</div>
              )}
            </div>
          </div>
 
          {/* REVIEWS + PERFORMANCE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-blue-900 mb-5">Recent Reviews</h3>
              <div className="space-y-5">
                {reviews.length > 0 ? (
                  reviews.map((review, i) => (
                    <div key={i}>
                      <div className="flex text-yellow-500 mb-2 text-sm">
                        {"★".repeat(Math.floor(review.rating))}
                      </div>
                      <p className="italic text-gray-600 text-sm">"{review.comment}"</p>
                      <p className="text-xs text-gray-400 mt-2">— Student #{review.student_id}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 italic text-sm">Aucun avis pour le moment</p>
                )}
              </div>
            </div>
 
            <div className="bg-blue-800 text-white rounded-2xl p-6 shadow-xl">
              <h3 className="uppercase tracking-[4px] text-xs opacity-70">Performance Summary</h3>
              <p className="text-xl font-bold mt-5 leading-relaxed">
                You have completed {stats.total_sessions} sessions with an average rating of{" "}
                {(stats.avg_rating || 0).toFixed(2)}/5
              </p>
              <div className="flex items-center gap-3 mt-8">
                <div className="w-11 h-11 rounded-full bg-white text-blue-800 flex items-center justify-center font-black border-4 border-blue-800 text-sm">
                  {user?.prenom?.[0]}{user?.nom?.[0]}
                </div>
                <span className="text-sm opacity-80">{stats.total_students} students helped</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
 