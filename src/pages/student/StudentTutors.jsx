// src/pages/student/StudentTutors.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getAvailableTutors, requestTutorSession } from "../../api/studentApi";

export default function StudentTutors() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [tutorsByChapter, setTutorsByChapter] = useState({});
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingData, setBookingData] = useState({
    date: "",
    time: "",
    message: ""
  });
  const [submitting, setSubmitting] = useState(false);

  const [globalSearchTerm, setGlobalSearchTerm] = useState("");

  useEffect(() => {
    const handleSearch = (event) => {
      setGlobalSearchTerm(event.detail);
    };
    window.addEventListener("searchTermChange", handleSearch);
    return () => window.removeEventListener("searchTermChange", handleSearch);
  }, []);

  useEffect(() => {
    fetchTutors();
  }, []);

  const fetchTutors = async () => {
  try {
    setLoading(true);
    // Force l'utilisation des mock data pour tester l'affichage
    const mockData = getMockData();
    setTutorsByChapter(mockData);
  } catch (error) {
    console.error("Error loading tutors:", error);
    setTutorsByChapter(getMockData());
  } finally {
    setLoading(false);
  }
};

  const getMockData = () => ({
    "Chapter 04: Quantum Mechanics": [
      {
        id: 1,
        name: "Dr. Julian Vane",
        role: "Senior Fellow, Physics",
        rating: 4.9,
        price: 120,
        description: "Specializing in the mathematical foundations of non-linear dynamics and quantum field theory.",
        skills: ["Theoretical Physics", "Calculus"],
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
        available: true
      },
      {
        id: 2,
        name: "Prof. Elena Moretti",
        role: "Director of Research",
        rating: 5.0,
        price: 145,
        description: "Focused on interactive learning models and multi-dimensional analysis within Chapter 04.",
        skills: ["Quantum Dynamics", "Linear Algebra"],
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
        available: true
      }
    ],
    "Chapter 08: Comparative Linguistics": [
      {
        id: 3,
        name: "Sarah Jenkins",
        role: "Language Specialist",
        rating: 4.8,
        description: "Master of Arts in Comparative Literature, Sorbonne.",
        skills: ["French", "Arabic"],
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956",
        price: 95,
        available: true
      },
      {
        id: 4,
        name: "Marc Dubois",
        role: "Linguistics Expert",
        rating: 4.9,
        description: "PhD in Phonetics. Specialist in Semitic and Romance language evolution.",
        skills: ["Phonology", "Linguistics"],
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
        price: 110,
        available: true
      },
      {
        id: 5,
        name: "Leila Mansour",
        role: "Senior Lecturer",
        rating: 5.0,
        description: "Expert in Arabic dialectology and classical French poetry.",
        skills: ["Poetry", "Dialects", "Arabic Literature"],
        image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce",
        price: 130,
        available: true
      }
    ]
  });

  const handleBookNow = (tutor) => {
    setSelectedTutor(tutor);
    setShowBookingModal(true);
  };

  const handleBookingChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitBooking = async () => {
    if (!bookingData.date || !bookingData.time) {
      alert("Veuillez selectionner une date et une heure");
      return;
    }
    setSubmitting(true);
    try {
      await requestTutorSession(selectedTutor.id, {
        date: bookingData.date,
        time: bookingData.time,
        message: bookingData.message
      });
      alert("Demande de session envoyee avec succes !");
      setShowBookingModal(false);
      setBookingData({ date: "", time: "", message: "" });
    } catch (error) {
      console.error("Error booking session:", error);
      alert("Erreur lors de la reservation");
    } finally {
      setSubmitting(false);
    }
  };

  const tutorMatchesSearch = (tutor, term) => {
    if (!term) return true;
    const lowerTerm = term.toLowerCase();
    return (
      tutor.name.toLowerCase().includes(lowerTerm) ||
      (tutor.role && tutor.role.toLowerCase().includes(lowerTerm)) ||
      (tutor.description && tutor.description.toLowerCase().includes(lowerTerm)) ||
      (tutor.skills && tutor.skills.some(skill => skill.toLowerCase().includes(lowerTerm))) ||
      tutor.price?.toString().includes(lowerTerm)
    );
  };

  const filteredChapters = Object.entries(tutorsByChapter).reduce((acc, [chapterName, tutors]) => {
    const tutorsArray = Array.isArray(tutors) ? tutors : [];
    const filteredTutors = tutorsArray.filter(tutor => tutorMatchesSearch(tutor, globalSearchTerm));
    if (filteredTutors.length > 0) {
      acc[chapterName] = filteredTutors;
    }
    return acc;
  }, {});

  const hasSearch = globalSearchTerm.trim() !== "";
  const chapterEntries = Object.entries(filteredChapters);
  const noResults = chapterEntries.length === 0 && hasSearch;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f7ff] p-8">
      <section className="mb-16">
        <p className="text-sm text-gray-500 mb-4">
          Dashboard -Tutors
        </p>
        <h1 className="text-5xl font-bold text-blue-900 mb-6">
          Academic Tutors
        </h1>
        <p className="max-w-3xl text-lg text-gray-600 leading-relaxed">
          Connect with distinguished faculty and subject matter experts specialized in our core chapters.
        </p>
        {hasSearch && (
          <div className="mt-4 inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm">
            <span className="material-symbols-outlined text-sm">search</span>
            Showing tutors matching: <strong>{globalSearchTerm}</strong>
            <button
              onClick={() => setGlobalSearchTerm("")}
              className="ml-1 hover:bg-blue-100 rounded-full p-0.5"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        )}
      </section>

      {chapterEntries.map(([chapterName, tutors]) => (
        <section key={chapterName} className="mb-20">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-4xl font-bold text-slate-900">
                {chapterName}
              </h2>
              <p className="text-gray-500 mt-2">
                {tutors.length} Expert Tutor{tutors.length > 1 ? 's' : ''} Available
              </p>
            </div>
            <button className="text-blue-700 font-semibold text-lg">
              View All →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {tutors.map((tutor) => (
              <div
                key={tutor.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300"
              >
                <div className="relative">
                  {tutor.image ? (
                    <img
                      src={tutor.image}
                      alt={tutor.name}
                      className="w-full h-72 object-cover"
                    />
                  ) : (
                    <div className="w-full h-72 bg-gradient-to-br from-blue-200 to-indigo-200 flex items-center justify-center">
                      <span className="text-6xl">👨‍🏫</span>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full shadow text-sm font-semibold flex items-center gap-1">
                    ⭐ {tutor.rating}
                  </div>
                </div>

                <div className="p-7">
                  <h3 className="text-2xl font-bold text-blue-900">
                    {tutor.name}
                  </h3>
                  {tutor.role && (
                    <p className="uppercase tracking-wider text-xs text-gray-500 mt-1">
                      {tutor.role}
                    </p>
                  )}
                  <p className="text-gray-600 leading-relaxed mt-5">
                    {tutor.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mt-5">
                    {tutor.skills?.map((skill, i) => (
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
                      ${tutor.price}/hr
                    </span>
                    <button
                      onClick={() => handleBookNow(tutor)}
                      className="bg-blue-700 text-white px-5 py-2 rounded-xl hover:bg-blue-800 transition"
                    >
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {chapterName === "Chapter 04: Quantum Mechanics" && (
              <div className="bg-blue-700 rounded-3xl p-10 text-white flex flex-col justify-center">
                <div className="text-5xl mb-6">✨</div>
                <h3 className="text-3xl font-bold mb-5">
                  Need a personalized learning path?
                </h3>
                <p className="text-blue-100 leading-relaxed mb-8">
                  Our advisors can match you with the ideal tutor according to your goals and learning style.
                </p>
                <button className="bg-white text-blue-700 px-6 py-3 rounded-2xl font-semibold w-fit">
                  Request Match
                </button>
              </div>
            )}
          </div>
        </section>
      ))}

      {noResults && (
        <div className="text-center py-16">
          <span className="material-symbols-outlined text-6xl text-gray-300">search_off</span>
          <p className="text-gray-500 mt-4">No tutors match your search criteria.</p>
          <button
            onClick={() => setGlobalSearchTerm("")}
            className="mt-4 text-blue-700 font-semibold hover:underline"
          >
            Clear search
          </button>
        </div>
      )}

      {showBookingModal && selectedTutor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setShowBookingModal(false)}
          />
          <div className="relative bg-white max-w-md w-full p-8 rounded-3xl shadow-2xl">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">
              Book a Session with {selectedTutor.name}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Date</label>
                <input
                  type="date"
                  name="date"
                  value={bookingData.date}
                  onChange={handleBookingChange}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Time</label>
                <input
                  type="time"
                  name="time"
                  value={bookingData.time}
                  onChange={handleBookingChange}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message (optional)</label>
                <textarea
                  name="message"
                  rows="3"
                  value={bookingData.message}
                  onChange={handleBookingChange}
                  placeholder="Tell the tutor about your learning goals..."
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                />
              </div>
              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitBooking}
                  disabled={submitting}
                  className="flex-1 py-3 bg-blue-800 text-white rounded-xl hover:bg-blue-900 transition disabled:opacity-50"
                >
                  {submitting ? "Booking..." : "Confirm Booking"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}