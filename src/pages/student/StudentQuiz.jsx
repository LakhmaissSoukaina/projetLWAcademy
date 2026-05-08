// src/pages/student/StudentQuiz.jsx

import { useState } from "react";

export default function StudentQuiz() {
  const [showModal, setShowModal] = useState(false);

  const questions = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#141b2b]">
      

      <main className="max-w-[1440px] mx-auto px-6 py-8">
        {/* BREADCRUMB */}
        <nav className="flex items-center gap-2 mb-12 text-sm text-gray-500">
          <span>Dashboard</span>
          <span>›</span>
          <span>Courses</span>
          <span>›</span>
          <span>Advanced Economics 402</span>
          <span>›</span>

          <span className="text-blue-800 font-semibold">
            Mid-Term Assessment
          </span>
        </nav>

        <div className="grid grid-cols-12 gap-8 items-start">
          {/* SIDEBAR */}
          <aside className="col-span-12 lg:col-span-3 space-y-6 sticky top-24">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-xl font-bold text-blue-900 mb-6">
                Assessment Navigator
              </h3>

              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, index) => (
                  <button
                    key={q}
                    className={`w-10 h-10 rounded-lg font-bold text-sm transition ${
                      index === 0
                        ? "bg-blue-800 text-white"
                        : "border border-gray-300 hover:border-blue-700"
                    }`}
                  >
                    {String(q).padStart(2, "0")}
                  </button>
                ))}
              </div>

              <div className="mt-10">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>10% Complete</span>
                </div>

                <div className="h-[3px] bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-800 w-[10%]" />
                </div>
              </div>
            </div>

            {/* PROCTORING */}
            <div className="bg-blue-800 p-6 rounded-2xl text-white">
              <div className="flex items-center gap-2 mb-4">
                <span>🎥</span>

                <span className="uppercase tracking-widest text-sm font-semibold">
                  Exam Proctoring
                </span>
              </div>

              <img
                src="https://lh3.googleusercontent.com/aida/ADBb0ugN82B1x3CmEb_bs037GZqR9bkWVTkox0p4MnGP6223WAP1uoWvI_thYgvmS2Ik9RGj96qwECtPC_PQ4dKBKKof9hxMXTyO4v6rMp0qseA7chO7lWbitOuD3BEK8hoVxADTivkGSFQWYIwTbtK10R4O2LslgYXm_TKBTJ9H1GNkfyNcEPe5Ensrd0oHzl9h1YJdJvbyF_ctQ995iT0pKJVGXxZo3NSAJa8twx1hEHJdPexAZ_MMZCQQMj7p9AI-DjpuhzU6oU2K8w"
                alt="Proctoring"
                className="w-full aspect-square object-cover rounded-xl mb-4"
              />

              <p className="text-sm text-blue-100 italic">
                Proctoring is active. Ensure your face remains within the frame.
              </p>
            </div>
          </aside>

          {/* QUIZ CONTENT */}
          <div className="col-span-12 lg:col-span-9 space-y-8">
            {/* TIMER */}
            <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h1 className="text-4xl font-bold text-blue-900">
                  Mid-Term Assessment
                </h1>

                <p className="text-gray-500 mt-2">
                  Section A: Macroeconomic Principles
                </p>
              </div>

              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-sm uppercase text-gray-400">
                    Time Remaining
                  </p>

                  <p className="text-5xl font-bold text-red-600">
                    42:18
                  </p>
                </div>

                <div className="w-16 h-16 rounded-full border-4 border-red-200 flex items-center justify-center text-3xl">
                  ⏱
                </div>
              </div>
            </div>

            {/* QUESTION 1 */}
            <section className="bg-white rounded-2xl shadow-sm p-10">
              <div className="flex justify-between items-start mb-6">
                <span className="uppercase tracking-widest text-blue-800 font-semibold text-sm">
                  Question 01
                </span>

                <span className="bg-blue-50 text-blue-800 px-4 py-1 rounded-full text-sm font-bold">
                  5 Points
                </span>
              </div>

              <h2 className="text-2xl font-bold mb-8">
                According to the Solow Growth Model, what is the
                primary long-run determinant of the steady-state
                growth rate of output per worker?
              </h2>

              <div className="space-y-4">
                {[
                  "A) The rate of capital accumulation",
                  "B) The rate of technological progress",
                  "C) The savings rate of the population",
                  "D) The population growth rate",
                ].map((option, i) => (
                  <label
                    key={i}
                    className={`flex items-center p-5 border rounded-xl cursor-pointer transition ${
                      i === 1
                        ? "border-blue-700 bg-blue-50"
                        : "border-gray-200 hover:border-blue-700"
                    }`}
                  >
                    <input
                      type="radio"
                      name="q1"
                      defaultChecked={i === 1}
                      className="w-5 h-5"
                    />

                    <span
                      className={`ml-4 ${
                        i === 1
                          ? "text-blue-800 font-semibold"
                          : ""
                      }`}
                    >
                      {option}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            {/* QUESTION 2 */}
            <section className="bg-white rounded-2xl shadow-sm p-10">
              <div className="flex justify-between items-start mb-6">
                <span className="uppercase tracking-widest text-blue-800 font-semibold text-sm">
                  Question 02
                </span>

                <span className="bg-blue-50 text-blue-800 px-4 py-1 rounded-full text-sm font-bold">
                  2 Points
                </span>
              </div>

              <h2 className="text-2xl font-bold mb-8">
                The Phillips Curve illustrates a permanent,
                long-run trade-off between inflation and
                unemployment.
              </h2>

              <div className="flex gap-6">
                {["TRUE", "FALSE"].map((item, i) => (
                  <label
                    key={i}
                    className="flex-1 flex items-center justify-center p-5 border border-gray-200 rounded-xl hover:border-blue-700 cursor-pointer"
                  >
                    <input type="radio" name="q2" />

                    <span className="ml-4 font-bold">{item}</span>
                  </label>
                ))}
              </div>
            </section>

            {/* QUESTION 3 */}
            <section className="bg-white rounded-2xl shadow-sm p-10">
              <div className="flex justify-between items-start mb-6">
                <span className="uppercase tracking-widest text-blue-800 font-semibold text-sm">
                  Question 03
                </span>

                <span className="bg-blue-50 text-blue-800 px-4 py-1 rounded-full text-sm font-bold">
                  15 Points
                </span>
              </div>

              <h2 className="text-2xl font-bold mb-8">
                Discuss the implications of a liquidity trap on
                monetary policy effectiveness. Provide examples
                from modern economic history.
              </h2>

              <textarea
                rows={8}
                placeholder="Type your response here..."
                className="w-full bg-blue-50/30 border-b-2 border-gray-200 focus:border-blue-700 focus:outline-none p-5 rounded-xl"
              />

              <div className="flex justify-end mt-3">
                <span className="text-sm text-gray-400">
                  Word Count: 0 / 500
                </span>
              </div>
            </section>

            {/* FOOTER ACTIONS */}
            <div className="flex justify-between items-center pt-6">
              <button className="flex items-center gap-2 px-8 py-4 border border-gray-300 rounded-xl hover:bg-gray-50">
                ← Previous
              </button>

              <div className="flex gap-4">
                <button className="px-8 py-4 border border-blue-700 text-blue-700 rounded-xl hover:bg-blue-50">
                  Save Draft
                </button>

                <button
                  onClick={() => setShowModal(true)}
                  className="px-8 py-4 bg-blue-800 text-white rounded-xl hover:bg-blue-900 shadow-lg"
                >
                  Submit Assessment →
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />

          <div className="relative bg-white max-w-md w-full p-10 rounded-3xl shadow-2xl text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl">
              ✅
            </div>

            <h3 className="text-3xl font-bold text-blue-900 mb-4">
              Ready to submit?
            </h3>

            <p className="text-gray-500 mb-8">
              You have 9 unanswered questions. Once submitted,
              you will not be able to modify your answers.
            </p>

            <div className="flex flex-col gap-3">
              <button className="w-full py-4 bg-blue-800 text-white rounded-xl hover:bg-blue-900">
                Yes, Submit Now
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="w-full py-4 hover:bg-gray-50 rounded-xl"
              >
                Go Back to Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* HELP BUTTON */}
      <button className="fixed bottom-6 right-6 w-14 h-14 bg-white rounded-full shadow-xl flex items-center justify-center text-2xl hover:scale-105 transition">
        🎧
      </button>

      {/* FOOTER */}
      <footer className="mt-20 border-t border-gray-100 py-10 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <span className="font-bold text-blue-900 uppercase tracking-widest">
              LW Academy
            </span>

            <span className="text-sm text-gray-400">
              © 2024 Excellence in Education.
            </span>
          </div>

          <div className="flex gap-8 text-sm text-gray-500">
            <a href="#" className="hover:text-blue-700">
              Privacy Policy
            </a>

            <a href="#" className="hover:text-blue-700">
              Academic Integrity
            </a>

            <a href="#" className="hover:text-blue-700">
              System Support
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}