// src/pages/student/StudentReport.jsx

import { useState } from "react";

export default function StudentReport() {
  const [score] = useState(85);

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#141b2b]">
      <main className="max-w-[1440px] mx-auto px-6 py-8">
        {/* BREADCRUMB */}
        <nav className="flex items-center gap-2 mb-10 text-sm text-gray-500">
          <span>Dashboard</span>
          <span>›</span>
          <span>Courses</span>
          <span>›</span>

          <span className="text-blue-800 font-semibold">
            Quiz Result
          </span>
        </nav>

        {/* HERO SECTION */}
        <section className="grid grid-cols-12 gap-8 mb-14">
          {/* SCORE CARD */}
          <div className="col-span-12 lg:col-span-4 bg-white rounded-3xl shadow-sm p-10 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_50%_-20%,#1e40af,transparent)]" />

            <div className="relative w-52 h-52 mb-6">
              <svg
                className="w-full h-full -rotate-90"
                viewBox="0 0 220 220"
              >
                <circle
                  cx="110"
                  cy="110"
                  r="90"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  fill="none"
                />

                <circle
                  cx="110"
                  cy="110"
                  r="90"
                  stroke="#1d4ed8"
                  strokeWidth="12"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={565}
                  strokeDashoffset={565 - (565 * score) / 100}
                />
              </svg>

              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <h1 className="text-5xl font-bold text-blue-800">
                  {score}%
                </h1>

                <p className="uppercase tracking-widest text-gray-500 text-sm mt-2">
                  Excellent
                </p>
              </div>
            </div>

            <p className="text-center text-gray-600">
              You passed the
              <br />

              <span className="font-bold text-[#141b2b]">
                Advanced Phonetics Quiz
              </span>
            </p>
          </div>

          {/* AI INSIGHT */}
          <div className="col-span-12 lg:col-span-5 bg-white rounded-3xl shadow-sm p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl">
                ✨
              </div>

              <h2 className="text-2xl font-bold text-blue-900">
                AI Insight
              </h2>
            </div>

            <p className="text-lg italic text-gray-700 leading-relaxed mb-8">
              "Your understanding of nasal vowels is exceptional,
              though there’s a slight confusion between the 'un'
              and 'in' sounds in academic contexts."
            </p>

            <div className="space-y-5">
              <div className="flex items-start gap-3">
                <span className="text-green-600 text-xl">✓</span>

                <div>
                  <p className="uppercase text-xs tracking-widest text-gray-400">
                    Strength
                  </p>

                  <p className="font-semibold">
                    Vowel Consistency
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="text-red-500 text-xl">!</span>

                <div>
                  <p className="uppercase text-xs tracking-widest text-gray-400">
                    Growth Area
                  </p>

                  <p className="font-semibold">
                    Dialectal Variations
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* BADGES */}
          <div className="col-span-12 lg:col-span-3 bg-blue-800 rounded-3xl shadow-sm p-8 text-white flex flex-col justify-between">
            <div>
              <p className="uppercase tracking-widest text-sm opacity-80 mb-6">
                Badges Earned
              </p>

              <div className="flex gap-4">
                <img
                  src="https://i.imgur.com/2DhmtJ4.png"
                  alt="badge"
                  className="w-16 h-16 rounded-full border border-white/20 p-1"
                />

                <img
                  src="https://i.imgur.com/JQ9pRoD.png"
                  alt="badge"
                  className="w-16 h-16 rounded-full border border-white/20 p-1"
                />
              </div>
            </div>

            <div className="mt-10">
              <p className="text-sm opacity-80 mb-3">
                Next Badge: Phonetic Master
              </p>

              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div className="h-full bg-white w-2/3 rounded-full" />
              </div>
            </div>
          </div>
        </section>

        {/* QUESTION BREAKDOWN */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-blue-900 mb-8">
            Question Breakdown
          </h2>

          <div className="space-y-8">
            {/* QUESTION 1 */}
            <div className="bg-white rounded-3xl shadow-sm p-8 border-l-4 border-blue-700">
              <div className="flex items-center gap-4 mb-5">
                <span className="bg-blue-50 text-blue-800 px-4 py-1 rounded-full text-sm font-bold">
                  Question 01
                </span>

                <span className="text-green-600 font-semibold">
                  ✓ Correct
                </span>
              </div>

              <h3 className="text-2xl font-bold mb-8">
                How does the 'liaison' affect the pronunciation
                of the phrase "les amis"?
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-2xl p-6">
                  <p className="text-sm uppercase tracking-widest text-gray-400 mb-2">
                    Your Answer
                  </p>

                  <p className="font-semibold italic text-blue-800">
                    "The final 's' is pronounced as a 'z' sound
                    linking to 'amis'."
                  </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <p className="text-sm uppercase tracking-widest text-gray-400 mb-2">
                    Model Solution
                  </p>

                  <p className="font-semibold">
                    The 's' becomes a voiced alveolar sound /z/
                    before the vowel.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <p className="italic text-gray-600">
                  🤖 AI Feedback: Perfect application of the
                  liaison rule. Your terminology was concise and
                  accurate.
                </p>
              </div>
            </div>

            {/* QUESTION 2 */}
            <div className="bg-white rounded-3xl shadow-sm p-8 border-l-4 border-red-500">
              <div className="flex items-center gap-4 mb-5">
                <span className="bg-blue-50 text-blue-800 px-4 py-1 rounded-full text-sm font-bold">
                  Question 02
                </span>

                <span className="text-red-500 font-semibold">
                  ✕ Incorrect
                </span>
              </div>

              <h3 className="text-2xl font-bold mb-8">
                Identify the IPA symbol for the "u" sound in the
                word "tu".
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-red-50 rounded-2xl p-6">
                  <p className="text-sm uppercase tracking-widest text-gray-400 mb-2">
                    Your Answer
                  </p>

                  <p className="font-semibold italic text-red-500">
                    /u/
                  </p>
                </div>

                <div className="bg-gray-50 rounded-2xl p-6">
                  <p className="text-sm uppercase tracking-widest text-gray-400 mb-2">
                    Model Solution
                  </p>

                  <p className="font-semibold">
                    /y/ — The high front rounded vowel.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t">
                <p className="italic text-gray-600">
                  🤖 AI Feedback: You confused the English
                  /u/ sound with the French /y/ sound.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* RECOMMENDATIONS */}
        <section className="bg-blue-50/40 rounded-3xl p-10 mb-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
            <div>
              <h2 className="text-3xl font-bold text-blue-900">
                Revision Recommendations
              </h2>

              <p className="text-gray-600 mt-2">
                Focus on these modules to improve your weak
                areas.
              </p>
            </div>

            <button className="bg-blue-800 text-white px-8 py-4 rounded-2xl hover:bg-blue-900 transition">
              Study All
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm hover:translate-x-1 transition">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl">
                  ▶
                </div>

                <div>
                  <p className="text-sm uppercase tracking-widest text-blue-800 font-semibold">
                    Module 4.2
                  </p>

                  <h4 className="text-xl font-bold">
                    The High Front Rounded Vowel /y/
                  </h4>

                  <p className="text-sm text-gray-500">
                    12 min video • Interactive practice
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm hover:translate-x-1 transition">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl">
                  📄
                </div>

                <div>
                  <p className="text-sm uppercase tracking-widest text-blue-800 font-semibold">
                    Module 3.1
                  </p>

                  <h4 className="text-xl font-bold">
                    IPA Chart for French Dialects
                  </h4>

                  <p className="text-sm text-gray-500">
                    Readings • Downloadable PDF
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ACTIONS */}
        <div className="flex flex-col md:flex-row justify-center gap-6 pb-10">
          <button className="px-10 py-4 border-2 border-blue-800 text-blue-800 rounded-2xl hover:bg-blue-50 transition">
            Retake Quiz
          </button>

          <button className="px-10 py-4 bg-blue-800 text-white rounded-2xl hover:bg-blue-900 shadow-lg transition">
            Next Lesson
          </button>
        </div>
      </main>
    </div>
  );
}