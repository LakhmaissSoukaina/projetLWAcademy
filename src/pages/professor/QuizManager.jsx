

const QuizManager = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-widest text-blue-700 font-semibold">
              Curriculum
            </p>
            <h1 className="text-3xl font-bold text-blue-900">
              Quiz: Phonological Awareness II
            </h1>
          </div>

          <div className="flex gap-3">
            <button className="px-5 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 transition">
              Save Draft
            </button>

            <button className="px-5 py-2 rounded-xl bg-blue-700 text-white hover:bg-blue-800 transition">
              Publish Quiz
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* LEFT SIDE */}
        <div className="xl:col-span-8 space-y-6">
          {/* QUIZ SETTINGS */}
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-slate-500 mb-2">
                  Quiz Title
                </label>

                <input
                  type="text"
                  defaultValue="Phonological Awareness II"
                  className="w-full border-b border-slate-300 bg-transparent py-3 text-2xl font-semibold focus:outline-none focus:border-blue-700"
                />
              </div>

              {/* AI ASSIST */}
              <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-blue-900 uppercase">
                    AI Assistance
                  </h3>

                  <p className="text-xs text-blue-600 mt-1">
                    Smart distractor generation
                  </p>
                </div>

                <div className="w-12 h-6 bg-blue-700 rounded-full relative">
                  <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-white"></div>
                </div>
              </div>
            </div>
          </div>

          {/* QUESTION 1 */}
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-blue-800 text-white flex items-center justify-center font-bold">
                  1
                </div>

                <span className="px-4 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase">
                  Multiple Choice
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500">Points</span>

                <input
                  type="number"
                  defaultValue={10}
                  className="w-16 text-center border-b border-slate-300 focus:outline-none focus:border-blue-700"
                />

                <button className="text-red-500 hover:text-red-700 transition">
                  ✕
                </button>
              </div>
            </div>

            <textarea
              className="w-full min-h-[80px] resize-none border border-slate-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-600 mb-6"
              defaultValue="Identify the minimal pair from the following set of words."
            />

            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="w-5 h-5 rounded-full border-2 border-blue-700 flex items-center justify-center">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-700"></div>
                </div>

                <input
                  type="text"
                  defaultValue="Bat / Pat"
                  className="flex-1 bg-slate-50 rounded-xl p-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>

                <input
                  type="text"
                  defaultValue="Sleep / Slept"
                  className="flex-1 bg-slate-50 rounded-xl p-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="w-5 h-5 rounded-full border-2 border-slate-300"></div>

                <input
                  type="text"
                  placeholder="Add option..."
                  className="flex-1 bg-slate-50 rounded-xl p-3 border border-dashed border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-600"
                />

                <button className="text-sm font-semibold text-blue-700 hover:text-blue-900">
                  Generate AI
                </button>
              </div>
            </div>
          </div>

          {/* QUESTION 2 */}
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold">
                  2
                </div>

                <span className="px-4 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase">
                  True / False
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-slate-500">Points</span>

                <input
                  type="number"
                  defaultValue={5}
                  className="w-16 text-center border-b border-slate-300 focus:outline-none focus:border-blue-700"
                />

                <button className="text-red-500 hover:text-red-700 transition">
                  ✕
                </button>
              </div>
            </div>

            <textarea
              className="w-full min-h-[80px] resize-none border border-slate-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-600 mb-6"
              defaultValue="The glottal stop is an essential phoneme in standard French pronunciation."
            />

            <div className="flex gap-4">
              <button className="flex-1 py-3 rounded-xl border border-slate-300 hover:border-blue-700 hover:text-blue-700 transition">
                True
              </button>

              <button className="flex-1 py-3 rounded-xl bg-blue-700 text-white border border-blue-700">
                False
              </button>
            </div>
          </div>

          {/* ADD QUESTION */}
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-100 flex flex-wrap justify-center gap-4">
            <button className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 transition font-medium">
              + Multiple Choice
            </button>

            <button className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 transition font-medium">
              + True / False
            </button>

            <button className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 transition font-medium">
              + Text Response
            </button>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="xl:col-span-4">
          <div className="sticky top-24 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="bg-blue-900 text-white p-6">
              <h2 className="text-xl font-bold">Quiz Preview</h2>

              <p className="text-sm text-blue-200 mt-1">
                Student Experience View
              </p>
            </div>

            <div className="p-6 space-y-6">
              {/* PREVIEW */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                <div className="flex justify-between items-center mb-6">
                  <div className="w-28 h-2 rounded-full bg-slate-200 overflow-hidden">
                    <div className="w-1/4 h-full bg-blue-700"></div>
                  </div>

                  <span className="text-xs text-slate-500 font-semibold">
                    14:59
                  </span>
                </div>

                <h3 className="font-semibold text-slate-800 mb-4">
                  Identify the minimal pair from the following set of words.
                </h3>

                <div className="space-y-3">
                  <div className="border border-blue-700 bg-blue-50 text-blue-700 rounded-xl p-3 text-sm font-medium">
                    ✓ Bat / Pat
                  </div>

                  <div className="border border-slate-200 bg-white rounded-xl p-3 text-sm">
                    Sleep / Slept
                  </div>

                  <div className="border border-slate-200 bg-white rounded-xl p-3 text-sm italic text-slate-400">
                    Option C
                  </div>
                </div>
              </div>

              {/* STATS */}
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-slate-500">Total Questions</span>
                  <span className="font-bold text-blue-900">2</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Total Points</span>
                  <span className="font-bold text-blue-900">15</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Est. Duration</span>
                  <span className="font-bold text-blue-900">10 mins</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default QuizManager;