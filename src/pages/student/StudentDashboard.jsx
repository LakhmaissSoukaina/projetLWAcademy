// src/pages/student/StudentDashboard.jsx



const StudentDashboard = () => {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <section>
        <h1 className="text-4xl font-black text-blue-800 mb-2">
          Bienvenue, Alexandre 
        </h1>

        <p className="text-gray-500">
          Your academic journey is 82% complete for this semester.
          Keep going!
        </p>
      </section>

      {/* Statistics Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {/* Card 1 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-blue-700">
              <span className="material-symbols-outlined">
                book
              </span>
            </div>

            <span className="text-xs font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded-full">
              Active
            </span>
          </div>

          <h2 className="text-3xl font-black text-gray-800">
            12
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Current Courses
          </p>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700">
              <span className="material-symbols-outlined">
                quiz
              </span>
            </div>

            <span className="text-xs font-bold text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
              88%
            </span>
          </div>

          <h2 className="text-3xl font-black text-gray-800">
            24/28
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Quiz Completion
          </p>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center text-green-700">
              <span className="material-symbols-outlined">
                trending_up
              </span>
            </div>

            <span className="flex items-center gap-1 text-xs font-bold text-green-600">
              <span className="material-symbols-outlined text-sm">
                arrow_upward
              </span>
              4.2%
            </span>
          </div>

          <h2 className="text-3xl font-black text-gray-800">
            82%
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Overall Progress
          </p>
        </div>

        {/* Card 4 */}
        <div className="bg-blue-700 rounded-2xl p-6 shadow-xl text-white hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center">
              <span className="material-symbols-outlined">
                calendar_today
              </span>
            </div>

            <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded-full">
              Tomorrow
            </span>
          </div>

          <h2 className="text-3xl font-black">
            10:30 AM
          </h2>

          <p className="text-sm text-blue-100 mt-1">
            Next Session
          </p>
        </div>
      </section>

      {/* Main Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Side */}
        <div className="xl:col-span-2 space-y-8">
          {/* Courses */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-800">
                My Courses
              </h2>

              <button className="text-blue-700 font-semibold hover:underline">
                View All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Course Card */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
                <div className="h-40 overflow-hidden relative">
                  <img
                    src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f"
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                  <span className="absolute bottom-4 left-4 text-white text-xs font-bold uppercase tracking-wider">
                    Linguistics
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-5">
                    Advanced French Philology
                  </h3>

                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">
                      JS
                    </div>

                    <div>
                      <p className="font-semibold text-sm">
                        Dr. Jean-Pierre
                      </p>

                      <p className="text-xs text-gray-500">
                        Sorbonne University
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold">
                        Progress
                      </span>

                      <span className="font-bold text-blue-700">
                        75%
                      </span>
                    </div>

                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="w-3/4 h-full bg-blue-700"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Course Card 2 */}
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group">
                <div className="h-40 bg-gradient-to-br from-blue-100 to-indigo-200 flex items-center justify-center relative">
                  <span className="material-symbols-outlined text-7xl text-blue-300">
                    architecture
                  </span>

                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>

                  <span className="absolute bottom-4 left-4 text-white text-xs font-bold uppercase tracking-wider">
                    Modern History
                  </span>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-5">
                    Political Systems of the Middle East
                  </h3>

                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                      MK
                    </div>

                    <div>
                      <p className="font-semibold text-sm">
                        Prof. Malika
                      </p>

                      <p className="text-xs text-gray-500">
                        American University of Beirut
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-semibold">
                        Progress
                      </span>

                      <span className="font-bold text-blue-700">
                        32%
                      </span>
                    </div>

                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="w-1/3 h-full bg-blue-700"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Recent Tasks */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-800">
                Recent Quiz & Tasks
              </h2>

              <button className="text-sm font-semibold text-blue-700 hover:underline">
                Export Transcript
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-4 text-xs uppercase text-gray-400">
                      Topic
                    </th>

                    <th className="text-left px-6 py-4 text-xs uppercase text-gray-400">
                      Date
                    </th>

                    <th className="text-left px-6 py-4 text-xs uppercase text-gray-400">
                      Status
                    </th>

                    <th className="text-right px-6 py-4 text-xs uppercase text-gray-400">
                      Grade
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-5">
                      <p className="font-semibold text-gray-800">
                        Arabic Syntax Level II
                      </p>

                      <p className="text-xs text-gray-500">
                        Linguistics Mastery
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-600">
                      Oct 12, 2023
                    </td>

                    <td className="px-6 py-5">
                      <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                        Completed
                      </span>
                    </td>

                    <td className="px-6 py-5 text-right font-bold text-blue-700">
                      A+ (98/100)
                    </td>
                  </tr>

                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-5">
                      <p className="font-semibold text-gray-800">
                        French Romanticism Intro
                      </p>

                      <p className="text-xs text-gray-500">
                        Literature Seminar
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm text-gray-600">
                      Oct 09, 2023
                    </td>

                    <td className="px-6 py-5">
                      <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
                        Completed
                      </span>
                    </td>

                    <td className="px-6 py-5 text-right font-bold text-blue-700">
                      A- (91/100)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* Right Side */}
        <div className="space-y-8">
          {/* Upcoming Sessions */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Upcoming Sessions
            </h2>

            <div className="space-y-4">
              <div className="flex gap-4 p-4 bg-blue-50 rounded-xl">
                <div className="w-14 h-14 bg-white rounded-xl shadow-sm flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-blue-700">
                    OCT
                  </span>

                  <span className="font-black text-lg">
                    14
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800">
                    Ethics in Translation
                  </h3>

                  <p className="text-sm text-gray-500">
                    Live Seminar • 2:00 PM
                  </p>
                </div>
              </div>

              <div className="flex gap-4 p-4 rounded-xl border border-gray-100">
                <div className="w-14 h-14 bg-gray-50 rounded-xl flex flex-col items-center justify-center">
                  <span className="text-xs font-bold text-gray-400">
                    OCT
                  </span>

                  <span className="font-black text-lg text-gray-500">
                    16
                  </span>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800">
                    Grammar Workshop
                  </h3>

                  <p className="text-sm text-gray-500">
                    Q&A Session • 10:00 AM
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Tutors */}
          <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                Active Tutors
              </h2>

              <span className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
            </div>

            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">
                      EL
                    </div>

                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800">
                      Emmanuelle L.
                    </p>

                    <p className="text-xs text-gray-500">
                      French Literature
                    </p>
                  </div>
                </div>

                <button className="text-gray-400 hover:text-blue-700">
                  <span className="material-symbols-outlined">
                    videocam
                  </span>
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center font-bold text-indigo-700">
                      AM
                    </div>

                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800">
                      Ahmed M.
                    </p>

                    <p className="text-xs text-gray-500">
                      Arabic Philosophy
                    </p>
                  </div>
                </div>

                <button className="text-gray-400 hover:text-blue-700">
                  <span className="material-symbols-outlined">
                    videocam
                  </span>
                </button>
              </div>
            </div>

            <button className="w-full mt-6 border border-blue-700 text-blue-700 py-3 rounded-xl font-semibold hover:bg-blue-700 hover:text-white transition-all">
              Book Instant Session
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;