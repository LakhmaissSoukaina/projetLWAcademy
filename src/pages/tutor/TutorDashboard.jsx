// src/pages/tutor/TutorDashboard.jsx

export default function TutorDashboard() {
  const stats = [
    {
      title: "Sessions Given",
      value: "148",
      extra: "+12% this month",
      icon: "menu_book",
    },
    {
      title: "Avg Rating",
      value: "4.96",
      extra: "Top 1%",
      icon: "star",
    },
    {
      title: "Students Helped",
      value: "3,240",
      extra: "Global Reach",
      icon: "groups",
    },
    {
      title: "Assigned Chapters",
      value: "14",
      extra: "2 Pending",
      icon: "library_books",
    },
  ];

  return (
    <div className="space-y-10">
      {/* HERO */}
      <section>
        <span className="uppercase tracking-[4px] text-sm font-bold text-blue-700">
          Welcome Back Professor
        </span>

        <h1 className="text-5xl font-black text-blue-950 mt-3">
          Hello, Dr. Julian Vance
        </h1>
      </section>

      {/* KPI */}
      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100"
          >
            <div className="flex items-start justify-between mb-5">
              <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-800 text-3xl">
                  {item.icon}
                </span>
              </div>

              <span className="text-sm text-blue-700 font-semibold">
                {item.extra}
              </span>
            </div>

            <p className="text-gray-500 font-medium">
              {item.title}
            </p>

            <h2 className="text-5xl font-black mt-3">
              {item.value}
            </h2>
          </div>
        ))}
      </section>

      {/* MAIN GRID */}
      <section className="grid grid-cols-12 gap-8">
        {/* LEFT */}
        <div className="col-span-12 xl:col-span-4 space-y-8">
          {/* PROFILE */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex flex-col items-center text-center">
              <img
                src="https://i.pravatar.cc/200?img=47"
                alt="Tutor"
                className="w-28 h-28 rounded-full object-cover border-4 border-blue-100"
              />

              <h3 className="text-3xl font-bold mt-5">
                Julian Vance
              </h3>

              <p className="text-blue-700 font-semibold mt-2">
                Senior Tutor | Econometrics
              </p>
            </div>

            <p className="text-gray-600 leading-relaxed mt-6">
              Specializing in graduate-level quantitative
              research and bilingual curriculum development.
            </p>

            <button className="w-full mt-8 py-4 bg-blue-800 text-white rounded-2xl font-bold hover:bg-blue-900 transition">
              Edit Public Profile
            </button>
          </div>

          {/* BOOKING REQUESTS */}
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-blue-900">
                Booking Requests
              </h3>

              <span className="px-3 py-1 rounded-full bg-red-500 text-white text-xs font-bold">
                3 NEW
              </span>
            </div>

            <div className="divide-y divide-gray-100">
              {["Marie Aubert", "Hassan Karim"].map(
                (student, i) => (
                  <div key={i} className="p-6">
                    <div className="flex justify-between mb-5">
                      <div>
                        <h4 className="font-bold text-lg">
                          {student}
                        </h4>

                        <p className="text-sm text-gray-500 mt-1">
                          Regression Analysis
                        </p>
                      </div>

                      <span className="text-sm text-blue-700">
                        2h ago
                      </span>
                    </div>

                    <div className="flex gap-3">
                      <button className="flex-1 py-3 bg-blue-800 text-white rounded-xl font-semibold">
                        Accept
                      </button>

                      <button className="flex-1 py-3 border border-gray-300 rounded-xl font-semibold">
                        Decline
                      </button>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-span-12 xl:col-span-8 space-y-8">
          {/* SCHEDULE */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
              <h3 className="text-3xl font-bold text-blue-900">
                My Scheduled Sessions
              </h3>

              <div className="flex items-center gap-3">
                <button className="w-11 h-11 rounded-xl border border-gray-200 flex items-center justify-center">
                  <span className="material-symbols-outlined">
                    chevron_left
                  </span>
                </button>

                <span className="font-semibold">
                  Oct 24 - Oct 30
                </span>

                <button className="w-11 h-11 rounded-xl border border-gray-200 flex items-center justify-center">
                  <span className="material-symbols-outlined">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>

            <div className="space-y-5">
              <div className="flex flex-col md:flex-row md:items-center gap-5 p-6 rounded-2xl bg-blue-50 border-l-4 border-blue-800">
                <div className="w-20 text-center">
                  <p className="text-sm font-bold text-gray-500">
                    MON
                  </p>

                  <h4 className="text-4xl font-black">
                    24
                  </h4>
                </div>

                <div className="flex-1">
                  <h4 className="text-2xl font-bold">
                    Macroeconomics Review
                  </h4>

                  <p className="text-gray-500 mt-1">
                    09:00 AM - 10:30 AM
                  </p>
                </div>

                <button className="px-6 py-3 bg-blue-800 text-white rounded-xl font-semibold">
                  Join Session
                </button>
              </div>

              <div className="flex flex-col md:flex-row md:items-center gap-5 p-6 rounded-2xl border border-gray-200">
                <div className="w-20 text-center">
                  <p className="text-sm font-bold text-gray-500">
                    WED
                  </p>

                  <h4 className="text-4xl font-black">
                    26
                  </h4>
                </div>

                <div className="flex-1">
                  <h4 className="text-2xl font-bold">
                    Stata Workshop
                  </h4>

                  <p className="text-gray-500 mt-1">
                    02:00 PM - 03:00 PM
                  </p>
                </div>

                <span className="px-4 py-2 rounded-full bg-gray-100 text-gray-600 font-semibold">
                  Upcoming
                </span>
              </div>
            </div>
          </div>

          {/* REVIEWS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-2xl font-bold text-blue-900 mb-8">
                Recent Reviews
              </h3>

              <div className="space-y-8">
                <div>
                  <div className="flex text-yellow-500 mb-3">
                    ★★★★★
                  </div>

                  <p className="italic text-gray-600">
                    "Dr. Vance explains complex math as if it
                    were a story."
                  </p>

                  <p className="text-sm text-gray-400 mt-3">
                    — Sophie L.
                  </p>
                </div>

                <div>
                  <div className="flex text-yellow-500 mb-3">
                    ★★★★☆
                  </div>

                  <p className="italic text-gray-600">
                    "Incredible depth of knowledge."
                  </p>

                  <p className="text-sm text-gray-400 mt-3">
                    — Marc D.
                  </p>
                </div>
              </div>
            </div>

            {/* NETWORK */}
            <div className="bg-blue-800 text-white rounded-3xl p-8 shadow-xl">
              <h3 className="uppercase tracking-[4px] text-sm opacity-70">
                Peer Network Activity
              </h3>

              <p className="text-2xl font-bold mt-6 leading-relaxed">
                You are among the top 5% of tutors in the
                Mediterranean region this week.
              </p>

              <div className="flex items-center gap-4 mt-12">
                <div className="flex -space-x-4">
                  <div className="w-12 h-12 rounded-full bg-white text-blue-800 flex items-center justify-center font-black border-4 border-blue-800">
                    JD
                  </div>

                  <div className="w-12 h-12 rounded-full bg-blue-200 text-blue-900 flex items-center justify-center font-black border-4 border-blue-800">
                    SL
                  </div>

                  <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-900 flex items-center justify-center font-black border-4 border-blue-800">
                    RK
                  </div>
                </div>

                <span className="text-sm opacity-80">
                  12 other faculty online
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}