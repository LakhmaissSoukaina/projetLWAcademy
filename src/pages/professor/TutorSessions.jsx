import { useState } from "react";
import { Link } from "react-router-dom";

function TutorSessions() {
  const [selectedChapter, setSelectedChapter] = useState("Chapter 04: Advanced Linguistics");
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  // Données des statistiques
  const stats = [
    {
      title: "Potential Tutors",
      value: "24 Candidates",
      icon: "school",
      color: "bg-blue-100 text-blue-800",
      progress: 75,
      progressColor: "bg-blue-900"
    },
    {
      title: "Current Tutors",
      value: "12 Active",
      icon: "verified",
      color: "bg-gray-100 text-gray-600",
      progress: 50,
      progressColor: "bg-gray-500"
    },
    {
      title: "Avg. Grade Mastery",
      value: "94.2%",
      icon: "analytics",
      color: "bg-blue-50 text-blue-800",
      progress: 94,
      progressColor: "bg-blue-700"
    }
  ];

  // Données des étudiants
  const [students, setStudents] = useState([
    {
      id: 1,
      rank: 1,
      rankColor: "bg-blue-900 text-white",
      name: "Amira Ben Youssef",
      program: "Bilingual Philology",
      studentId: "8829",
      avatar: "https://lh3.googleusercontent.com/aida/ADBb0uh-gORIA9_i2XBTfcBGNH7GvGK61nvpvmamftY8UYejNeuJ-2gn1laSL1vEXhF7sdvLuNjY6Ao8oUTl9IRE6MhxfYT2pJH4XYXbSfGEsrOug-CNxULYOog7_nWuCzv64tq-a6oa4MgiBYoPMBgiwf2DlOau_PG8OJajScH80sbddx4qabkfJEDRk2dHvVy5ZE20y7duE3gTvaK9WrkaJUfQwjkusg1lP4OD2T-LWZjynbzUqBPF8VoDkQ5CmN3iGB6gv7Vt-3sIyA",
      hasImage: true,
      isOnline: true,
      score: 98.5,
      scoreTrend: "up",
      specialization: "Arabic Morphology",
      specializationColor: "bg-blue-50 text-blue-800",
      isTutor: true
    },
    {
      id: 2,
      rank: 2,
      rankColor: "bg-blue-100 text-blue-900",
      name: "Cédric Lefebvre",
      program: "Classical Literature",
      studentId: "7741",
      initials: "CL",
      hasImage: false,
      isOnline: false,
      score: 96.2,
      scoreTrend: "up",
      specialization: "French Syntax",
      specializationColor: "bg-gray-100 text-gray-600",
      isTutor: false
    },
    {
      id: 3,
      rank: 3,
      rankColor: "bg-blue-100 text-blue-900",
      name: "Fatima Al-Sayed",
      program: "Modern History",
      studentId: "9104",
      initials: "FA",
      hasImage: false,
      isOnline: false,
      score: 95.8,
      scoreTrend: "flat",
      specialization: "Dialectology",
      specializationColor: "bg-blue-50 text-blue-800",
      isTutor: true
    },
    {
      id: 4,
      rank: 4,
      rankColor: "bg-gray-100 text-gray-500",
      name: "Marc Antoine",
      program: "Applied Mathematics",
      studentId: "5521",
      initials: "MA",
      hasImage: false,
      isOnline: true,
      score: 94.1,
      scoreTrend: "up",
      specialization: "Calculus II",
      specializationColor: "bg-gray-100 text-gray-600",
      isTutor: false
    },
    {
      id: 5,
      rank: 5,
      rankColor: "bg-gray-100 text-gray-500",
      name: "Layla Al-Farsi",
      program: "Computer Science",
      studentId: "6678",
      initials: "LA",
      hasImage: false,
      isOnline: true,
      score: 93.7,
      scoreTrend: "down",
      specialization: "Data Structures",
      specializationColor: "bg-gray-100 text-gray-600",
      isTutor: false
    }
  ]);

  // Chapitres disponibles
  const chapters = [
    "Chapter 04: Advanced Linguistics",
    "Chapter 03: Literary Theory",
    "Chapter 02: Phonetics",
    "Chapter 01: Introduction to Syntax",
    "Chapter 05: Semantics & Pragmatics"
  ];

  // Toggle tutor status
  const toggleTutorStatus = (id) => {
    setStudents(prev => prev.map(student => 
      student.id === id ? { ...student, isTutor: !student.isTutor } : student
    ));
  };

  // Remove tutor
  const removeTutor = (id) => {
    setStudents(prev => prev.map(student => 
      student.id === id ? { ...student, isTutor: false } : student
    ));
  };

  return (
    <div className="w-full max-w-full">
      {/* CORRECTION : Même structure que MyCourses - max-w-7xl mx-auto px-6 py-12 mb-32 */}
      <main className="max-w-7xl mx-auto px-6 py-12 mb-32">
        
        {/* Breadcrumb & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <nav className="flex items-center gap-2 text-xs text-gray-400 mb-2">
              <Link to="/professor" className="hover:text-blue-900 cursor-pointer transition-colors font-medium">Dashboard</Link>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
              <span className="text-blue-900 font-bold">Tutors</span>
            </nav>
            <span className="text-blue-900 font-semibold uppercase tracking-widest text-xs block mb-2">Academic Excellence</span>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 font-serif">Peer Tutor Selection</h1>
            <p className="text-base text-gray-500 max-w-2xl mt-4">
              Identify and appoint top-performing students as Peer Tutors for the upcoming semester. Recognition is based on cumulative grades and chapter-specific mastery.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
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

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-[0_4px_20px_rgba(30,64,175,0.05)] border border-gray-100 hover:shadow-lg transition-all">
              <div className="flex items-center gap-4 mb-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.color}`}>
                  <span className="material-symbols-outlined">{stat.icon}</span>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 font-serif">{stat.value}</p>
                </div>
              </div>
              <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full transition-all duration-1000 ${stat.progressColor}`}
                  style={{ width: `${stat.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        {/* Filter Bar (conditional) */}
        {showFilters && (
          <section className="bg-white p-6 rounded-xl shadow-[0_4px_20px_rgba(30,64,175,0.05)] border border-gray-100 flex flex-wrap gap-4 items-center mb-8 animate-in slide-in-from-top-2">
            <div className="flex-1 min-w-[280px] relative">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <span className="material-symbols-outlined text-lg">search</span>
              </span>
              <input 
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-blue-200 text-sm transition-all outline-none placeholder-gray-400"
                placeholder="Search students by name or ID..." 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-3 flex-wrap">
              <div className="relative">
                <select 
                  className="appearance-none bg-gray-50 border-none rounded-lg py-3 pl-4 pr-10 text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-blue-200 transition-all cursor-pointer outline-none"
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                >
                  {chapters.map((chapter, idx) => (
                    <option key={idx} value={chapter}>{chapter}</option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none material-symbols-outlined text-gray-400 text-sm">expand_more</span>
              </div>
              
              <button className="p-3 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors">
                <span className="material-symbols-outlined">tune</span>
              </button>
            </div>
          </section>
        )}

        {/* Main Table */}
        <div className="bg-white rounded-xl shadow-[0_12px_40px_rgba(30,64,175,0.08)] overflow-hidden border border-gray-100 mb-8">
          <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-blue-900 font-serif">Student Ranking by Performance</h2>
            <div className="relative">
              <select 
                className="appearance-none bg-gray-50 border-none rounded-lg py-2.5 pl-4 pr-10 text-xs font-semibold text-gray-700 focus:ring-2 focus:ring-blue-200 transition-all cursor-pointer outline-none"
                value={selectedChapter}
                onChange={(e) => setSelectedChapter(e.target.value)}
              >
                {chapters.map((chapter, idx) => (
                  <option key={idx} value={chapter}>{chapter}</option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none material-symbols-outlined text-gray-400 text-sm">expand_more</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[900px]">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Rank</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Student Profile</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Mastery Score</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Specialization</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Designate Peer Tutor</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-blue-50/30 transition-colors group">
                    {/* Rank */}
                    <td className="px-6 py-6">
                      <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs ${student.rankColor}`}>
                        {student.rank}
                      </div>
                    </td>

                    {/* Profile */}
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-4">
                        <div className="relative flex-shrink-0">
                          <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                            {student.hasImage ? (
                              <img 
                                alt={student.name} 
                                className="w-full h-full object-cover" 
                                src={student.avatar}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-blue-100 text-blue-900 font-bold text-sm">
                                {student.initials}
                              </div>
                            )}
                          </div>
                          {student.isOnline && (
                            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 text-sm">{student.name}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{student.program} • ID: {student.studentId}</p>
                        </div>
                      </div>
                    </td>

                    {/* Score */}
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-900 text-sm">{student.score}%</span>
                        {student.scoreTrend === "up" && (
                          <span className="material-symbols-outlined text-green-500 text-sm">trending_up</span>
                        )}
                        {student.scoreTrend === "down" && (
                          <span className="material-symbols-outlined text-red-500 text-sm">trending_down</span>
                        )}
                        {student.scoreTrend === "flat" && (
                          <span className="material-symbols-outlined text-gray-400 text-sm">remove</span>
                        )}
                      </div>
                    </td>

                    {/* Specialization */}
                    <td className="px-6 py-6">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${student.specializationColor}`}>
                        {student.specialization}
                      </span>
                    </td>

                    {/* Tutor Toggle */}
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-3">
                        <input 
                          type="checkbox"
                          checked={student.isTutor}
                          onChange={() => toggleTutorStatus(student.id)}
                          className="w-5 h-5 rounded border-gray-300 text-blue-900 focus:ring-blue-900 cursor-pointer"
                        />
                        <span className={`text-xs font-semibold ${student.isTutor ? "text-blue-900" : "text-gray-400"}`}>
                          {student.isTutor ? "Tutor Assigned" : "Eligible"}
                        </span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-6 text-right">
                      {student.isTutor ? (
                        <button 
                          onClick={() => removeTutor(student.id)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                          title="Remove Tutor"
                        >
                          <span className="material-symbols-outlined">person_remove</span>
                        </button>
                      ) : (
                        <button 
                          className="p-2 text-gray-300 cursor-not-allowed"
                          disabled
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

          {/* Pagination */}
          <div className="p-6 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-400">
              Showing top <span className="font-bold text-gray-900">5</span> performance leaders for selected chapter.
            </p>
            <div className="flex gap-2">
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-white transition-colors text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-white transition-colors text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* Guidance Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Tutor Responsibility */}
          <div className="bg-blue-900 text-white p-8 rounded-xl flex items-start gap-6 shadow-lg shadow-blue-900/20">
            <span className="material-symbols-outlined text-4xl text-blue-300 flex-shrink-0">verified_user</span>
            <div>
              <h3 className="text-xl font-bold font-serif mb-2">Tutor Responsibility</h3>
              <p className="text-sm text-blue-100 opacity-90 leading-relaxed">
                Designated Peer Tutors will be granted 'Academic Assistant' privileges in their respective chapters, allowing them to host live sessions and grade peer workshops.
              </p>
              <button className="mt-6 text-xs font-bold border-b border-white pb-1 hover:text-blue-200 transition-colors uppercase tracking-widest">
                Read Academic Charter
              </button>
            </div>
          </div>

          {/* Selection Criteria */}
          <div className="bg-white border border-dashed border-gray-300 p-8 rounded-xl flex items-start gap-6">
            <span className="material-symbols-outlined text-4xl text-blue-800 flex-shrink-0">info</span>
            <div>
              <h3 className="text-xl font-bold text-blue-900 font-serif mb-2">Selection Criteria</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Rankings are updated every 24 hours. A minimum score of 95% in chapter-specific quizzes and 90% attendance in live lectures is required for tutor eligibility.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-6">
          <div className="text-center md:text-left">
            <div className="font-serif font-bold text-blue-900 text-lg mb-2">W. Centre Academy</div>
            <p className="font-serif text-xs leading-relaxed text-gray-500">
              © 2024 W. Centre Academy. Excellence in Bilingual Education.
            </p>
          </div>
          <div className="flex gap-8">
            <a href="#" className="font-serif text-xs text-gray-500 hover:text-blue-800 transition-opacity">Privacy Policy</a>
            <a href="#" className="font-serif text-xs text-gray-500 hover:text-blue-800 transition-opacity">Terms of Service</a>
            <a href="#" className="font-serif text-xs text-gray-500 hover:text-blue-800 transition-opacity">Faculty Portal</a>
            <a href="#" className="font-serif text-xs text-gray-500 hover:text-blue-800 transition-opacity">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default TutorSessions;