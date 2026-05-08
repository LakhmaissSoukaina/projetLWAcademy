//import { useState } from "react";

function ProfessorDashboard() {
  // Données des cours
  const courses = [
    {
      id: 1,
      title: "Structural Integrity III",
      level: "Undergraduate",
      department: "Applied Sciences",
      subject: "Mechanics",
      icon: "architecture",
      chapters: [
        { name: "Chapter 4: Stress Distribution in Beams", modules: 14 },
        { name: "Chapter 5: Shear Force Analysis", modules: 9 }
      ]
    },
    {
      id: 2,
      title: "Advanced Differential Equations",
      level: "Master",
      department: "Mathematics",
      subject: "Calculus",
      icon: "calculate",
      chapters: []
    }
  ];

  const accessCodes = [
    { id: 1, course: "Structural Integrity III", code: "LW-2024-STR", uses: "156/200", expiry: "Dec 12, 2024", status: "Active" },
    { id: 2, course: "Diff Equations II", code: "LW-MATH-EXP", uses: "42/100", expiry: "Oct 20, 2024", status: "Active" }
  ];

  const aiInsights = [
    { title: "Top Difficulty", content: "72% of students struggled with 'Stress-Strain Tensors' in Quiz 4." },
    { title: "Engagement Trend", content: "Course interaction peaked at 9:00 PM Thursday." }
  ];

  const studentTutors = [
    { id: 1, name: "Sarah Chen", rank: 1, score: "98%", initials: "SC" },
    { id: 2, name: "Mark Kovacs", rank: 2, score: "96%", initials: "MK" },
    { id: 3, name: "Leila Janson", rank: 3, score: "95%", initials: "LJ" }
  ];

  const upcomingSessions = [
    { day: "Monday, Oct 14", time: "14:00", title: "Office Hours: Engineering Calculus", color: "border-blue-900" },
    { day: "Wednesday, Oct 16", time: "10:30", title: "Group Seminar: AI Ethics", color: "border-gray-500" },
    { day: "Friday, Oct 18", time: "16:00", title: "Exam Review: Applied Physics", color: "border-red-600" }
  ];

  return (
    <div className="space-y-6 w-full max-w-full">
      {/* Dashboard Header */}
      <div className="mb-12">
        <h1 className="text-3xl lg:text-4xl font-bold text-blue-900 mb-2 font-serif">
          Professor Dashboard
        </h1>
        <p className="text-gray-500 text-base lg:text-lg">
          Welcome back, Dr. Julian. Here is your academic performance overview.
        </p>
      </div>

      {/* KPI Bento Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white p-6 rounded-xl shadow-[0_4px_20px_rgba(30,64,175,0.05)] flex flex-col">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Total Students</span>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-blue-900 font-serif">1,284</span>
            <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1 font-bold">
              <span className="material-symbols-outlined text-sm">trending_up</span> +12%
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-[0_4px_20px_rgba(30,64,175,0.05)] flex flex-col">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Published Courses</span>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-blue-900 font-serif">24</span>
            <span className="material-symbols-outlined text-gray-500">library_books</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-[0_4px_20px_rgba(30,64,175,0.05)] flex flex-col">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Live Sessions</span>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-blue-900 font-serif">8</span>
            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-bold">This Week</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-[0_4px_20px_rgba(30,64,175,0.05)] flex flex-col">
          <span className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Success Rate</span>
          <div className="flex items-end justify-between">
            <span className="text-3xl font-bold text-blue-900 font-serif">94.2%</span>
            <div className="w-16 h-1 bg-gray-100 rounded-full mb-2 overflow-hidden">
              <div className="bg-blue-900 h-full w-[94%]"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Course Portfolio */}
          <section className="bg-white rounded-xl shadow-[0_4px_20px_rgba(30,64,175,0.05)] p-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-blue-900 font-serif">Course Portfolio</h2>
              <button className="bg-blue-900 text-white px-4 py-2 rounded-lg font-semibold text-sm flex items-center gap-2 hover:bg-blue-800 transition-all shadow-sm">
                <span className="material-symbols-outlined text-sm">add</span> New Course
              </button>
            </div>
            
            <div className="space-y-4">
              {courses.map((course) => (
                <div key={course.id} className="border border-gray-100 rounded-lg p-4 hover:border-blue-200 transition-all bg-gray-50/30">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex gap-4">
                      <div className="h-16 w-16 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-blue-900 text-3xl">{course.icon}</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
                          <span>{course.level}</span> • <span>{course.department}</span> • <span>{course.subject}</span>
                        </div>
                        <h3 className="font-bold text-blue-900 text-lg">{course.title}</h3>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="text-blue-900 hover:bg-blue-50 p-2 rounded-full transition-all" title="Add Chapter">
                        <span className="material-symbols-outlined">library_add</span>
                      </button>
                      <button className="text-blue-900 hover:bg-blue-50 p-2 rounded-full transition-all" title="Generate Access Code">
                        <span className="material-symbols-outlined">vpn_key</span>
                      </button>
                    </div>
                  </div>
                  
                  {course.chapters.length > 0 && (
                    <div className="ml-20 space-y-2 border-l-2 border-gray-100 pl-4">
                      {course.chapters.map((chapter, idx) => (
                        <div key={idx} className="flex justify-between items-center py-2 text-sm border-b border-gray-50 last:border-0">
                          <span className="text-gray-700">{chapter.name}</span>
                          <span className="text-xs text-gray-400">{chapter.modules} Modules</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Access Code Management */}
          <section className="bg-white rounded-xl shadow-[0_4px_20px_rgba(30,64,175,0.05)] p-8 border border-gray-100">
            <h2 className="text-xl font-bold text-blue-900 mb-6 font-serif">Access Code Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead className="border-b border-gray-100">
                  <tr className="text-xs text-gray-500 uppercase tracking-wider">
                    <th className="pb-4 font-bold">Course Name</th>
                    <th className="pb-4 font-bold">Active Code</th>
                    <th className="pb-4 font-bold">Uses</th>
                    <th className="pb-4 font-bold">Expiry</th>
                    <th className="pb-4 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {accessCodes.map((code) => (
                    <tr key={code.id} className="text-sm hover:bg-gray-50 transition-colors">
                      <td className="py-4 text-gray-700">{code.course}</td>
                      <td className="py-4 font-mono text-blue-900 font-bold text-sm">{code.code}</td>
                      <td className="py-4 text-gray-600">{code.uses}</td>
                      <td className="py-4 text-gray-600">{code.expiry}</td>
                      <td className="py-4">
                        <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-green-100">
                          {code.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Quiz Creation */}
          <section className="bg-white rounded-xl shadow-[0_4px_20px_rgba(30,64,175,0.05)] p-8 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-blue-900 font-serif">Quiz Creation Interface</h2>
              <div className="flex gap-2">
                <button className="text-gray-600 border border-gray-200 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-all">
                  Drafts
                </button>
                <button className="bg-blue-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-800 transition-all shadow-sm">
                  New Quiz
                </button>
              </div>
            </div>
            
            <div className="bg-blue-50/30 p-6 rounded-lg border border-blue-100 relative overflow-hidden">
              <div className="relative z-10">
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                    Question 1: Multiple Choice
                  </label>
                  <input 
                    className="w-full border-0 border-b-2 border-gray-200 bg-transparent focus:ring-0 focus:border-blue-900 text-lg py-2 outline-none placeholder-gray-400"
                    placeholder="Enter your question here..." 
                    type="text"
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border-2 border-blue-900"></div>
                    <div className="flex-1 bg-white p-3 rounded border border-gray-100 text-sm text-gray-500">
                      Answer Option A...
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                    <div className="flex-1 bg-white p-3 rounded border border-gray-100 text-sm text-gray-500">
                      Answer Option B...
                    </div>
                  </div>
                </div>
                
                <div className="mt-8 flex justify-end gap-4 border-t border-gray-200 pt-6">
                  <button className="flex items-center gap-2 text-blue-900 font-semibold text-sm hover:bg-blue-50 px-3 py-2 rounded-lg transition-all">
                    <span className="material-symbols-outlined text-lg">auto_awesome</span> AI Suggestion
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* AI Insights */}
          <section className="bg-blue-900 text-white rounded-xl p-8 shadow-lg shadow-blue-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <span className="material-symbols-outlined text-6xl">psychology</span>
            </div>
            <h2 className="text-xl font-bold mb-4 font-serif flex items-center gap-2">
              <span className="material-symbols-outlined">smart_toy</span> AI Insights
            </h2>
            <div className="space-y-4">
              {aiInsights.map((insight, idx) => (
                <div key={idx} className="bg-white/10 p-4 rounded-lg backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-widest font-bold mb-1 text-blue-200">{insight.title}</p>
                  <p className="text-sm text-blue-100 leading-relaxed">{insight.content}</p>
                </div>
              ))}
              <button className="w-full bg-white text-blue-900 font-semibold py-3 rounded-lg hover:bg-gray-100 transition-all mt-4 text-sm">
                View Detailed Report
              </button>
            </div>
          </section>

          {/* Student Tutors */}
          <section className="bg-white rounded-xl shadow-[0_4px_20px_rgba(30,64,175,0.05)] p-8 border border-gray-100">
            <h2 className="text-xl font-bold text-blue-900 mb-6 font-serif">Student Tutors</h2>
            <div className="space-y-6">
              {studentTutors.map((tutor) => (
                <div key={tutor.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-blue-900 text-sm">
                      {tutor.initials}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-900">{tutor.name}</p>
                      <p className="text-xs text-gray-500">Rank #{tutor.rank} • {tutor.score} Score</p>
                    </div>
                  </div>
                  <button className="text-blue-900 text-sm font-semibold hover:underline">
                    Assign
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Upcoming Sessions */}
          <section className="bg-white rounded-xl shadow-[0_4px_20px_rgba(30,64,175,0.05)] p-8 border border-gray-100">
            <h2 className="text-xl font-bold text-blue-900 mb-6 font-serif">Upcoming Sessions</h2>
            <div className="space-y-4">
              {upcomingSessions.map((session, idx) => (
                <div key={idx} className={`border-l-4 ${session.color} pl-4 py-2`}>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {session.day} • {session.time}
                  </p>
                  <p className="text-sm font-bold text-gray-900 mt-1">{session.title}</p>
                </div>
              ))}
            </div>
            <button className="w-full text-center text-blue-900 font-semibold mt-6 hover:underline text-sm">
              Open Full Calendar
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}

export default ProfessorDashboard;