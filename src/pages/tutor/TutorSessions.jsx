// src/pages/tutor/TutorSessions.jsx
import { useState, useEffect, useCallback, useMemo } from "react";
import api from "../../api/axios";
 
export default function TutorSessions() {
  const [sessions, setSessions] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("month");
 
  const currentMonth = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
 
  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get("/tutor/sessions");
      const allSessions = response.data;
      setSessions(allSessions);
      setUpcomingSessions(allSessions.filter(s => s.status !== 'completed'));
    } catch (error) {
      console.error("Error loading sessions:", error);
      const mockSessions = [
        {
          id: 1,
          date: "2024-10-08T10:00:00",
          duration: 1.5,
          status: "ongoing",
          subject: "Advanced Macroeconomics: Fiscal Policy Analysis",
          student: { id: 1, name: "Marc-Antoine Dubois", avatar: null },
        },
        {
          id: 2,
          date: "2024-10-08T14:00:00",
          duration: 1,
          status: "upcoming",
          subject: "Calculus II: Taylor Series Seminar",
          student: { id: 2, name: "Sarah Mansour", avatar: null },
        },
        {
          id: 3,
          date: "2024-10-08T16:30:00",
          duration: 1,
          status: "upcoming",
          subject: "Linguistics: Morphological Theory",
          student: { id: 3, name: "Julien Haddad", avatar: null },
        },
        {
          id: 4,
          date: "2024-10-03T09:00:00",
          duration: 2,
          status: "completed",
          subject: "Advanced Physics",
          student: { id: 4, name: "Thomas Bernard", avatar: null },
        },
      ];
      setSessions(mockSessions);
      setUpcomingSessions(mockSessions.filter(s => s.status !== 'completed'));
    } finally {
      setLoading(false);
    }
  }, []);
 
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const startDay = firstDayOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
 
    for (let i = 0; i < startDay; i++) {
      days.push({ date: null, sessions: [] });
    }
 
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      const daySessions = sessions.filter(session => {
        const sessionDate = new Date(session.date);
        return (
          sessionDate.getDate() === i &&
          sessionDate.getMonth() === month &&
          sessionDate.getFullYear() === year
        );
      });
      days.push({
        date,
        day: i,
        isToday: date.toDateString() === new Date().toDateString(),
        sessions: daySessions,
      });
    }
 
    return days;
  }, [currentDate, sessions]);
 
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      if (!cancelled) await fetchSessions();
    };
    load();
    return () => { cancelled = true; };
  }, [fetchSessions]);
 
  const changeMonth = (delta) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1));
  };
 
  const goToToday = () => {
    setCurrentDate(new Date());
  };
 
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' });
  };
 
  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
 
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-800 mx-auto"></div>
          <p className="mt-3 text-gray-600 text-sm">Chargement des sessions...</p>
        </div>
      </div>
    );
  }
 
  const ongoingSession = sessions.find(s => s.status === 'ongoing');
 
  return (
    <main className="pt-5 px-6 pb-10 min-h-screen bg-gray-50">
      <div className="max-w-full mx-auto">
 
        {/* Header — tighter than before */}
        <div className="mb-5">
          <h1 className="text-3xl font-bold text-blue-900 font-['Noto_Serif']">Mes Sessions</h1>
          <p className="text-gray-500 mt-1 text-sm">Gérez vos sessions de tutorat et votre calendrier</p>
        </div>
 
        {/* Two-column layout: calendar 8/12, sidebar 4/12 */}
        <div className="grid grid-cols-12 gap-5">
 
          {/* ── Calendar ── */}
          <div className="col-span-12 lg:col-span-8">
            <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
 
              {/* Calendar header */}
              <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => changeMonth(-1)}
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">chevron_left</span>
                  </button>
                  <h2 className="text-lg font-bold text-gray-800 min-w-[160px] text-center capitalize">
                    {currentMonth}
                  </h2>
                  <button
                    onClick={() => changeMonth(1)}
                    className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl">chevron_right</span>
                  </button>
                  <button
                    onClick={goToToday}
                    className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    Aujourd'hui
                  </button>
                </div>
 
                {/* View mode switcher */}
                <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                  {["month", "week", "day"].map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setViewMode(mode)}
                      className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all capitalize ${
                        viewMode === mode
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
 
              {/* Calendar grid */}
              <div className="p-4">
                {/* Week-day labels */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekDays.map((day) => (
                    <div key={day} className="text-center">
                      <span className="text-[11px] font-semibold text-gray-400">{day}</span>
                    </div>
                  ))}
                </div>
 
                {/* Day cells — reduced min-height so full month fits */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => (
                    <div
                      key={index}
                      className={`min-h-[90px] p-1.5 rounded-lg transition-all ${
                        day.isToday
                          ? "bg-blue-50 ring-2 ring-blue-500"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {day.date && (
                        <>
                          <div className="flex justify-between items-start">
                            <span
                              className={`text-xs font-semibold ${
                                day.isToday
                                  ? "w-6 h-6 flex items-center justify-center bg-blue-600 text-white rounded-full"
                                  : "text-gray-700"
                              }`}
                            >
                              {day.day}
                            </span>
                            {day.sessions.length > 0 && (
                              <span className="text-[10px] bg-blue-100 text-blue-600 px-1 py-0.5 rounded-full leading-none">
                                {day.sessions.length}
                              </span>
                            )}
                          </div>
                          <div className="mt-1 space-y-0.5">
                            {day.sessions.slice(0, 2).map((session, idx) => (
                              <div
                                key={idx}
                                className={`text-[10px] px-1 py-1 rounded cursor-pointer truncate ${
                                  session.status === "ongoing"
                                    ? "bg-green-100 text-green-700 border-l-2 border-green-500"
                                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                                title={session.subject}
                              >
                                {session.subject?.substring(0, 20)}
                              </div>
                            ))}
                            {day.sessions.length > 2 && (
                              <div className="text-[9px] text-gray-400 text-center">
                                +{day.sessions.length - 2}
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
 
          {/* ── Today's Queue ── */}
          <div className="col-span-12 lg:col-span-4">
            <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden sticky top-5">
 
              {/* Panel header */}
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-800">Aujourd'hui</h3>
                <span className="text-xs text-gray-500">
                  {new Date().toLocaleDateString('fr', { weekday: 'long', day: 'numeric', month: 'short' })}
                </span>
              </div>
 
              <div className="px-4 py-4 space-y-3 max-h-[520px] overflow-y-auto">
 
                {/* Live Session */}
                {ongoingSession && (
                  <div className="relative bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 border-l-4 border-red-500 shadow">
                    <div className="absolute top-2.5 right-2.5">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">
                        <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                        LIVE
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-red-600 mb-1.5">
                      {formatTime(ongoingSession.date)} –{" "}
                      {formatTime(
                        new Date(new Date(ongoingSession.date).getTime() + ongoingSession.duration * 3600000)
                      )}
                    </p>
                    <h4 className="text-sm font-bold text-gray-800 mb-2 leading-snug">{ongoingSession.subject}</h4>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0">
                        {ongoingSession.student?.name?.charAt(0) || "S"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{ongoingSession.student?.name || "Étudiant"}</p>
                        <p className="text-[10px] text-gray-400">En session</p>
                      </div>
                    </div>
                    <button className="w-full bg-red-500 text-white py-2 rounded-lg flex items-center justify-center gap-1.5 text-sm font-semibold hover:bg-red-600 transition">
                      <span className="material-symbols-outlined text-sm">videocam</span>
                      Rejoindre la session
                    </button>
                  </div>
                )}
 
                {/* Upcoming */}
                <div className="space-y-2">
                  <h4 className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">À venir</h4>
                  {upcomingSessions.filter(s => s.status === 'upcoming').length > 0 ? (
                    upcomingSessions.filter(s => s.status === 'upcoming').map((session) => (
                      <div
                        key={session.id}
                        className="bg-gray-50 rounded-xl p-3 hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="flex justify-between items-start mb-1">
                          <span className="text-xs font-semibold text-blue-600">
                            {formatTime(session.date)}
                          </span>
                          <span className="material-symbols-outlined text-gray-400 text-base leading-none">more_horiz</span>
                        </div>
                        <h5 className="text-sm font-bold text-gray-800 mb-1.5 leading-snug">{session.subject}</h5>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold text-[10px] flex-shrink-0">
                            {session.student?.name?.charAt(0) || "S"}
                          </div>
                          <span className="text-xs text-gray-600">{session.student?.name || "Étudiant"}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-6 text-gray-400">
                      <span className="material-symbols-outlined text-3xl">event_busy</span>
                      <p className="mt-1 text-sm">Aucune session planifiée</p>
                    </div>
                  )}
                </div>
 
                {upcomingSessions.filter(s => s.status === 'upcoming').length > 0 && (
                  <button className="w-full py-2.5 text-sm text-blue-600 font-semibold hover:bg-blue-50 rounded-xl transition">
                    Voir toutes les sessions ({upcomingSessions.filter(s => s.status === 'upcoming').length})
                  </button>
                )}
              </div>
 
              {/* Next availability card */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 m-3 rounded-xl shadow-lg">
                <h4 className="text-[11px] font-semibold uppercase tracking-wider text-blue-200 mb-1">
                  Prochaine disponibilité
                </h4>
                <p className="text-2xl font-bold mb-3">Demain, 09:00</p>
                <div className="flex items-center gap-1.5 mb-3">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse flex-shrink-0"></span>
                  <span className="text-xs text-blue-100">Accepte les demandes urgentes</span>
                </div>
                <button className="w-full bg-white/10 hover:bg-white/20 text-white border border-white/30 py-1.5 rounded-lg text-sm font-medium transition">
                  Modifier mon planning
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
 
      {/* Progress bar for ongoing session */}
      {ongoingSession && (
        <div className="fixed bottom-0 left-0 right-0 h-1 bg-gray-200">
          <div className="h-full bg-gradient-to-r from-blue-500 to-green-500" style={{ width: '65%' }}></div>
        </div>
      )}
    </main>
  );
}