function ProfessorAIReports() {
  return (
    <div className="w-full bg-[#f9f9ff] min-h-screen">

        <main className="w-full px-6 lg:px-10 py-10">

          {/* HEADER */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">

            <div>
              <div className="flex items-center gap-2 text-blue-700 mb-2">
                <span className="material-symbols-outlined text-sm">
                  auto_awesome
                </span>

                <span className="text-xs font-semibold tracking-[0.2em] uppercase">
                  AI Powered Analysis
                </span>
              </div>

              <h1 className="text-3xl lg:text-5xl font-bold text-blue-900 font-serif leading-tight">
                Advanced Quiz Reports
              </h1>

              <p className="text-base text-gray-500 mt-3 italic">
                Final Assessment: Introduction to Bilingual Semantics (Section B-24)
              </p>
            </div>

            <button className="bg-blue-900 text-white px-8 py-4 rounded-2xl font-semibold text-sm shadow-[0_4px_24px_rgba(30,64,175,0.08)] hover:bg-blue-800 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 self-start md:self-auto">
              <span className="material-symbols-outlined">
                download
              </span>

              <span>Export Reports</span>
            </button>

          </div>

          {/* METRICS */}
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

            {/* CARD */}
            <div className="bg-white p-8 rounded-2xl shadow-[0_4px_24px_rgba(30,64,175,0.08)] hover:-translate-y-1 transition-all duration-300">

              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Average Score
              </p>

              <h2 className="text-4xl font-bold text-blue-900">
                84.2%
              </h2>

              <div className="mt-5 flex items-center gap-2 text-green-600">
                <span className="material-symbols-outlined text-sm">
                  trending_up
                </span>

                <span className="text-sm">
                  +4.2% from mid-term
                </span>
              </div>

            </div>

            {/* CARD */}
            <div className="bg-white p-8 rounded-2xl shadow-[0_4px_24px_rgba(30,64,175,0.08)] hover:-translate-y-1 transition-all duration-300">

              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Success Rate
              </p>

              <h2 className="text-4xl font-bold text-gray-900">
                92%
              </h2>

              <div className="mt-5 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <div className="bg-blue-900 h-2 rounded-full w-[92%]"></div>
              </div>

            </div>

            {/* CARD */}
            <div className="bg-white p-8 rounded-2xl shadow-[0_4px_24px_rgba(30,64,175,0.08)] hover:-translate-y-1 transition-all duration-300">

              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Avg. Completion
              </p>

              <h2 className="text-4xl font-bold text-gray-900">
                42m
              </h2>

              <p className="text-sm text-gray-500 mt-5 italic">
                Standard deviation: 8.5m
              </p>

            </div>

            {/* CARD */}
            <div className="bg-white p-8 rounded-2xl shadow-[0_4px_24px_rgba(30,64,175,0.08)] hover:-translate-y-1 transition-all duration-300">

              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                Difficult Items
              </p>

              <h2 className="text-4xl font-bold text-red-600">
                3
              </h2>

              <p className="text-sm text-gray-500 mt-5">
                Required immediate review
              </p>

            </div>

          </section>

          {/* CHART + AI */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">

            {/* HEATMAP */}
            <div className="xl:col-span-2 bg-white p-8 rounded-2xl shadow-[0_4px_24px_rgba(30,64,175,0.08)]">

              <div className="flex justify-between items-start mb-8">

                <div>
                  <h3 className="text-2xl font-bold text-blue-900 mb-1 font-serif">
                    Difficulty Heatmap
                  </h3>

                  <p className="text-gray-500 italic">
                    Performance distribution across quiz sections
                  </p>
                </div>

                <button className="text-blue-900 font-semibold flex items-center gap-2 hover:underline">
                  <span className="material-symbols-outlined">
                    download
                  </span>

                  Export
                </button>

              </div>

              {/* CHART */}
              <div className="h-[320px] flex items-end gap-4 border-b border-l border-gray-100 p-4 rounded-xl bg-gray-50">

                {[
                  { label: "Grammar", height: "60%", color: "bg-blue-200" },
                  { label: "Vocab", height: "85%", color: "bg-blue-500" },
                  { label: "Semantics", height: "35%", color: "bg-red-300" },
                  { label: "Phonetics", height: "70%", color: "bg-blue-400" },
                  { label: "History", height: "55%", color: "bg-blue-300" },
                  { label: "Syntax", height: "95%", color: "bg-blue-900" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex-1 flex flex-col justify-end items-center"
                  >

                    <div
                      className={`${item.color} w-full rounded-t-xl hover:opacity-80 transition-all duration-300`}
                      style={{ height: item.height }}
                    ></div>

                    <span className="text-xs text-gray-500 rotate-45 mt-4">
                      {item.label}
                    </span>

                  </div>
                ))}

              </div>

            </div>

            {/* AI INSIGHT */}
            <div className="bg-blue-900 text-white p-8 rounded-2xl shadow-[0_12px_40px_rgba(30,64,175,0.18)] flex flex-col justify-between">

              <div>

                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined">
                    bolt
                  </span>

                  <h3 className="uppercase tracking-widest text-sm font-bold">
                    AI Strategic Insight
                  </h3>
                </div>

                <p className="leading-relaxed text-blue-100 mb-6">
                  Most students are struggling with{" "}
                  <span className="font-bold text-white">
                    Abstract Bilingual Mapping
                  </span>.
                  AI suggests a remedial lecture on Semantic Transference
                  before the next module.
                </p>

                <img
                  src="https://images.unsplash.com/photo-1677442136019-21780ecad995"
                  alt="AI"
                  className="rounded-2xl h-44 w-full object-cover mb-6"
                />

              </div>

              <button className="w-full bg-white text-blue-900 font-semibold py-3 rounded-xl hover:bg-blue-50 transition-all duration-300">
                Apply Teaching Plan
              </button>

            </div>

          </div>

          {/* STUDENTS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* HIGH PERFORMERS */}
            <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(30,64,175,0.08)] overflow-hidden">

              <div className="p-5 border-b bg-gray-50 flex justify-between items-center">

                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-green-600">
                    workspace_premium
                  </span>

                  <h4 className="font-bold text-gray-900">
                    High Performers (14)
                  </h4>
                </div>

                <span className="text-sm text-gray-400">
                  Score &gt; 90%
                </span>

              </div>

              <div className="p-5 space-y-5">

                {[
                  { initials: "EL", name: "Elena Laurent", score: "98%" },
                  { initials: "MK", name: "Marc Khalil", score: "96%" },
                ].map((student) => (
                  <div
                    key={student.name}
                    className="flex items-center justify-between hover:bg-gray-50 p-3 rounded-xl transition-all"
                  >

                    <div className="flex items-center gap-3">

                      <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">
                        {student.initials}
                      </div>

                      <div>
                        <p className="font-semibold text-gray-900">
                          {student.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {student.score} Correct
                        </p>
                      </div>

                    </div>

                    <span className="material-symbols-outlined text-gray-400 cursor-pointer">
                      more_vert
                    </span>

                  </div>
                ))}

              </div>

            </div>

            {/* AT RISK */}
            <div className="bg-white rounded-2xl shadow-[0_4px_24px_rgba(30,64,175,0.08)] overflow-hidden">

              <div className="p-5 border-b bg-gray-50 flex justify-between items-center">

                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-red-600">
                    warning
                  </span>

                  <h4 className="font-bold text-gray-900">
                    At-Risk Focus (5)
                  </h4>
                </div>

                <span className="text-sm text-gray-400">
                  Score &lt; 65%
                </span>

              </div>

              <div className="p-5 space-y-5">

                {[
                  {
                    initials: "JB",
                    name: "Julien Bernard",
                    info: "58% • 4 failed topics",
                  },
                  {
                    initials: "SA",
                    name: "Sarah Al-Farsi",
                    info: "62% • Low engagement",
                  },
                ].map((student) => (
                  <div
                    key={student.name}
                    className="flex items-center justify-between hover:bg-gray-50 p-3 rounded-xl transition-all"
                  >

                    <div className="flex items-center gap-3">

                      <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center font-bold text-red-600">
                        {student.initials}
                      </div>

                      <div>
                        <p className="font-semibold text-gray-900">
                          {student.name}
                        </p>

                        <p className="text-sm text-gray-500">
                          {student.info}
                        </p>
                      </div>

                    </div>

                    <button className="border border-red-500 text-red-500 text-xs font-bold px-4 py-2 rounded-full hover:bg-red-500 hover:text-white transition-all duration-300">
                      Schedule
                    </button>

                  </div>
                ))}

              </div>

            </div>

          </div>

        </main>

      </div>
  );
}

export default ProfessorAIReports;