// src/pages/student/StudentTutors.jsx

const tutorsPhysics = [
  {
    name: "Dr. Julian Vane",
    role: "Senior Fellow, Physics",
    rating: "4.9",
    price: "$120/hr",
    description:
      "Specializing in the mathematical foundations of non-linear dynamics and quantum field theory.",
    skills: ["Theoretical Physics", "Calculus"],
    image:
      "https://lh3.googleusercontent.com/aida/ADBb0ugN82B1x3CmEb_bs037GZqR9bkWVTkox0p4MnGP6223WAP1uoWvI_thYgvmS2Ik9RGj96qwECtPC_PQ4dKBKKof9hxMXTyO4v6rMp0qseA7chO7lWbitOuD3BEK8hoVxADTivkGSFQWYIwTbtK10R4O2LslgYXm_TKBTJ9H1GNkfyNcEPe5Ensrd0oHzl9h1YJdJvbyF_ctQ995iT0pKJVGXxZo3NSAJa8twx1hEHJdPexAZ_MMZCQQMj7p9AI-DjpuhzU6oU2K8w",
  },
  {
    name: "Prof. Elena Moretti",
    role: "Director of Research",
    rating: "5.0",
    price: "$145/hr",
    description:
      "Focused on interactive learning models and multi-dimensional analysis within Chapter 04.",
    skills: ["Quantum Dynamics", "Linear Algebra"],
    image:
      "https://lh3.googleusercontent.com/aida/ADBb0uh-gORIA9_i2XBTfcBGNH7GvGK61nvpvmamftY8UYejNeuJ-2gn1laSL1vEXhF7sdvLuNjY6Ao8oUTl9IRE6MhxfYT2pJH4XYXbSfGEsrOug-CNxULYOog7_nWuCzv64tq-a6oa4MgiBYoPMBgiwf2DlOau_PG8OJajScH80sbddx4qabkfJEDRk2dHvVy5ZE20y7duE3gTvaK9WrkaJUfQwjkusg1lP4OD2T-LWZjynbzUqBPF8VoDkQ5CmN3iGB6gv7Vt-3sIyA",
  },
];

const tutorsLanguages = [
  {
    name: "Sarah Jenkins",
    rating: "4.8",
    description:
      "Master of Arts in Comparative Literature, Sorbonne.",
    skills: ["French", "Arabic"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuC-CoSvUEclIotQwuwjaIWHUaKdKMybN5qJte5PgoAoYp4uIixbdnsqP4Oxixs539OCAKKJt5BsHWtjGsnq0DQ6jdFSEsSHqPImdUV6hJKY6kCHXz9Gfl8XskQ948q57IfIKFeFzUbUNrIXmDz8zBwqKeh0E8bgpB7UtMwm3WCxJqdj2fBr9nmLDn5KbkQlfenDKqAwpYSOSauryOS2L2GbGCfTalAk47AXERFvjOziBYF4zwjtsKyDX-fRod6oEPG8rO24xIRXOWs",
  },
  {
    name: "Marc Dubois",
    rating: "4.9",
    description:
      "PhD in Phonetics. Specialist in Semitic and Romance language evolution.",
    skills: ["Phonology"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDdLn4V8Lu_hakjmw6kEv1JWQ0lZ6bmEnK6pun_8ILUWwZTYC6E1unq2RtLEMymsc7TodQXbZsyk-pROIuA1e-GcDTRdFl2FA1dXeQCgUbaS7TRmmIypGolpypOeA4JqHG0JTbSBHNg1tR_e6aHL881kXMltp9P2Btw1F0uPjpRZf81iaqCbcBWpFPtnr6OzyUcyw41DJbfAxHe7fp5kj0RHuijSL4GCKb8MhzqEy0zv5eKAN2_NlVAFkrsIKR1mdNLfFoBBMTkNMQ",
  },
  {
    name: "Leila Mansour",
    rating: "5.0",
    description:
      "Expert in Arabic dialectology and classical French poetry.",
    skills: ["Poetry", "Dialects"],
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBBK5wN2xhSVcXpsSPDpwDLspnnKnS7wyw6UjvAqdfgkP7wVlA-yH85b0eW41ve-otl3AVRkXUZ-29TRmSq2uvvaV1rlGaJIECai881dT0fzEXcq7k68BRfqLRnA8feYUITrJE-KF8wlfu_WO5uj_LY8OKDUZU3ddypmAkOdYbidNX0ACTJ1Bugj7Fux1Bw2IRZhK26BM_wFWs91ZyD0MigVhWvdtml4ipF0ouPlJmX87yFIlw0WT129chroi2s0EmptdRwa-X0QQA",
  },
];

export default function StudentTutors() {
  return (
    <div className="min-h-screen bg-[#f5f7ff] p-8">
      {/* HERO */}
      <section className="mb-16">
        <p className="text-sm text-gray-500 mb-4">
          Dashboard → Tutors
        </p>

        <h1 className="text-5xl font-bold text-blue-900 mb-6">
          Academic Tutors
        </h1>

        <p className="max-w-3xl text-lg text-gray-600 leading-relaxed">
          Connect with distinguished faculty and subject matter experts
          specialized in our core chapters.
        </p>
      </section>

      {/* PHYSICS */}
      <section className="mb-20">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h2 className="text-4xl font-bold text-slate-900">
              Chapter 04: Quantum Mechanics
            </h2>

            <p className="text-gray-500 mt-2">
              4 Expert Tutors Available
            </p>
          </div>

          <button className="text-blue-700 font-semibold text-lg">
            View All →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {tutorsPhysics.map((tutor, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300"
            >
              <div className="relative">
                <img
                  src={tutor.image}
                  alt={tutor.name}
                  className="w-full h-72 object-cover"
                />

                <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow text-sm font-semibold">
                  ⭐ {tutor.rating}
                </div>
              </div>

              <div className="p-7">
                <h3 className="text-2xl font-bold text-blue-900">
                  {tutor.name}
                </h3>

                <p className="uppercase tracking-wider text-xs text-gray-500 mt-1">
                  {tutor.role}
                </p>

                <p className="text-gray-600 leading-relaxed mt-5">
                  {tutor.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-5">
                  {tutor.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between mt-8 pt-5 border-t">
                  <span className="font-bold text-lg">
                    {tutor.price}
                  </span>

                  <button className="bg-blue-700 text-white px-5 py-2 rounded-xl hover:bg-blue-800 transition">
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* FEATURE CARD */}
          <div className="bg-blue-700 rounded-3xl p-10 text-white flex flex-col justify-center">
            <div className="text-5xl mb-6">✨</div>

            <h3 className="text-3xl font-bold mb-5">
              Need a personalized learning path?
            </h3>

            <p className="text-blue-100 leading-relaxed mb-8">
              Our advisors can match you with the ideal tutor
              according to your goals and learning style.
            </p>

            <button className="bg-white text-blue-700 px-6 py-3 rounded-2xl font-semibold w-fit">
              Request Match
            </button>
          </div>
        </div>
      </section>

      {/* LANGUAGES */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">
              Chapter 08: Comparative Linguistics
            </h2>

            <p className="text-gray-500 mt-1">
              6 Expert Tutors Available
            </p>
          </div>

          <button className="text-blue-700 font-semibold">
            View All →
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {tutorsLanguages.map((tutor, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-6 shadow-sm hover:shadow-lg transition"
            >
              <div className="flex items-center gap-4">
                <img
                  src={tutor.image}
                  alt={tutor.name}
                  className="w-16 h-16 rounded-full object-cover"
                />

                <div>
                  <h4 className="font-bold text-blue-900">
                    {tutor.name}
                  </h4>

                  <p className="text-sm">
                    ⭐ {tutor.rating}
                  </p>
                </div>
              </div>

              <p className="text-gray-600 mt-5 leading-relaxed">
                {tutor.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-5">
                {tutor.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <button className="w-full mt-6 border border-blue-700 text-blue-700 py-3 rounded-xl hover:bg-blue-700 hover:text-white transition">
                Check Calendar
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}