// src/pages/student/StudentQuiz.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getStudentQuizzes, getQuizDetails, submitQuiz } from "../../api/studentApi";
import { useParams, useNavigate } from "react-router-dom";

export default function StudentQuiz() {
  const { user } = useAuth();
  const { quizId } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // 🔍 Recherche globale (depuis la StudentNavbar)
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");

  useEffect(() => {
    const handleSearch = (event) => {
      setGlobalSearchTerm(event.detail);
    };
    window.addEventListener("searchTermChange", handleSearch);
    return () => window.removeEventListener("searchTermChange", handleSearch);
  }, []);

  useEffect(() => {
    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && quiz) {
      handleAutoSubmit();
    }
  }, [timeLeft]);

  const fetchQuiz = async () => {
    try {
      setLoading(true);
      const data = await getQuizDetails(quizId);
      setQuiz(data);
      setTimeLeft(data.duration * 60);
      const initialAnswers = {};
      data.questions.forEach(q => {
        initialAnswers[q.id] = q.userAnswer || null;
      });
      setAnswers(initialAnswers);
    } catch (error) {
      console.error("Error loading quiz:", error);
      // Données mockées
      setQuiz({
        id: 1,
        title: "Mid-Term Assessment",
        section: "Macroeconomic Principles",
        duration: 60,
        questions: [
          {
            id: 1,
            text: "According to the Solow Growth Model, what is the primary long-run determinant of the steady-state growth rate of output per worker?",
            points: 5,
            type: "multiple_choice",
            options: [
              "The rate of capital accumulation",
              "The rate of technological progress",
              "The savings rate of the population",
              "The population growth rate"
            ],
            correctOption: 1
          },
          {
            id: 2,
            text: "The Phillips Curve illustrates a permanent, long-run trade-off between inflation and unemployment.",
            points: 2,
            type: "true_false",
            options: ["TRUE", "FALSE"],
            correctOption: 1
          },
          {
            id: 3,
            text: "Discuss the implications of a liquidity trap on monetary policy effectiveness. Provide examples from modern economic history.",
            points: 15,
            type: "essay"
          }
        ]
      });
      setTimeLeft(60 * 60);
    } finally {
      setLoading(false);
    }
  };

  const handleAutoSubmit = async () => {
    alert("Temps écoulé ! Soumission automatique...");
    await handleSubmit();
  };

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await submitQuiz(quizId, { answers });
      alert("Quiz soumis avec succès !");
      navigate("/student/courses");
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("Erreur lors de la soumission");
    } finally {
      setSubmitting(false);
      setShowModal(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 🔍 Filtrer les questions selon le terme global
  const filteredQuestions = quiz?.questions?.filter(q => 
    !globalSearchTerm.trim() || 
    q.text.toLowerCase().includes(globalSearchTerm.toLowerCase())
  ) || [];

  // Progression basée sur les réponses des questions filtrées (cohérent avec l’affichage)
  const getProgress = () => {
    if (!filteredQuestions.length) return 0;
    const answeredFiltered = filteredQuestions.filter(q => {
      const answer = answers[q.id];
      return answer !== null && answer !== "";
    }).length;
    return Math.round((answeredFiltered / filteredQuestions.length) * 100);
  };

  // Nombre total de réponses manquantes dans l'ensemble du quiz (pour la modale)
  const totalUnansweredCount = quiz?.questions?.length - Object.values(answers).filter(a => a !== null && a !== "").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Quiz non trouvé</p>
      </div>
    );
  }

  const progress = getProgress();

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#141b2b]">
      <main className="max-w-[1440px] mx-auto px-6 py-8">
        {/* BREADCRUMB + BADGE DE RECHERCHE */}
        <nav className="flex items-center gap-2 mb-12 text-sm text-gray-500">
          <span>Dashboard</span>
          <span>›</span>
          <span>Courses</span>
          <span>›</span>
          <span>{quiz.courseName || "Advanced Economics 402"}</span>
          <span>›</span>
          <span className="text-blue-800 font-semibold">{quiz.title}</span>
        </nav>

        {globalSearchTerm && (
          <div className="mb-6 inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm">
            <span className="material-symbols-outlined text-sm">search</span>
            Showing questions matching: <strong>{globalSearchTerm}</strong>
            <button
              onClick={() => setGlobalSearchTerm("")}
              className="ml-1 hover:bg-blue-100 rounded-full p-0.5"
            >
              <span className="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
        )}

        <div className="grid grid-cols-12 gap-8 items-start">
          {/* SIDEBAR - Navigateur de questions (uniquement pour les questions filtrées) */}
          <aside className="col-span-12 lg:col-span-3 space-y-6 sticky top-24">
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="text-xl font-bold text-blue-900 mb-6">Assessment Navigator</h3>
              <div className="grid grid-cols-5 gap-2">
                {filteredQuestions.map((q, idx) => {
                  const originalIndex = quiz.questions.findIndex(question => question.id === q.id);
                  const isAnswered = answers[q.id] !== null && answers[q.id] !== "";
                  return (
                    <button
                      key={q.id}
                      className={`w-10 h-10 rounded-lg font-bold text-sm transition ${
                        isAnswered
                          ? "bg-green-500 text-white"
                          : idx === 0
                          ? "bg-blue-800 text-white"
                          : "border border-gray-300 hover:border-blue-700"
                      }`}
                    >
                      {String(originalIndex + 1).padStart(2, "0")}
                    </button>
                  );
                })}
              </div>
              <div className="mt-10">
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress (filtered)</span>
                  <span>{progress}% Complete</span>
                </div>
                <div className="h-[3px] bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-800" style={{ width: `${progress}%` }} />
                </div>
              </div>
              {globalSearchTerm && (
                <p className="text-xs text-gray-400 mt-4">
                  Showing {filteredQuestions.length} of {quiz.questions.length} questions
                </p>
              )}
            </div>

            {/* PROCTORING (inchangé) */}
            <div className="bg-blue-800 p-6 rounded-2xl text-white">
              <div className="flex items-center gap-2 mb-4">
                <span>🎥</span>
                <span className="uppercase tracking-widest text-sm font-semibold">Exam Proctoring</span>
              </div>
              <div className="w-full aspect-square bg-blue-700 rounded-xl mb-4 flex items-center justify-center">
                <span className="text-4xl">🎓</span>
              </div>
              <p className="text-sm text-blue-100 italic">
                Proctoring is active. Ensure your face remains within the frame.
              </p>
            </div>
          </aside>

          {/* QUIZ CONTENT - affiche uniquement les questions filtrées */}
          <div className="col-span-12 lg:col-span-9 space-y-8">
            {/* TIMER (inchangé) */}
            <div className="bg-white rounded-2xl shadow-sm p-8 flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <h1 className="text-4xl font-bold text-blue-900">{quiz.title}</h1>
                <p className="text-gray-500 mt-2">{quiz.section}</p>
              </div>
              <div className="flex items-center gap-8">
                <div className="text-right">
                  <p className="text-sm uppercase text-gray-400">Time Remaining</p>
                  <p className={`text-5xl font-bold ${timeLeft < 300 ? "text-red-600" : "text-blue-900"}`}>
                    {formatTime(timeLeft)}
                  </p>
                </div>
                <div className="w-16 h-16 rounded-full border-4 border-red-200 flex items-center justify-center text-3xl">
                  ⏱
                </div>
              </div>
            </div>

            {/* AFFICHAGE DES QUESTIONS FILTRÉES */}
            {filteredQuestions.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center">
                <span className="material-symbols-outlined text-5xl text-gray-300">search_off</span>
                <p className="mt-4 text-gray-500">Aucune question ne correspond à votre recherche.</p>
                <button
                  onClick={() => setGlobalSearchTerm("")}
                  className="mt-4 text-blue-700 font-semibold hover:underline"
                >
                  Clear search
                </button>
              </div>
            ) : (
              filteredQuestions.map((question, qIndex) => {
                const originalIndex = quiz.questions.findIndex(q => q.id === question.id);
                return (
                  <section key={question.id} className="bg-white rounded-2xl shadow-sm p-10">
                    <div className="flex justify-between items-start mb-6">
                      <span className="uppercase tracking-widest text-blue-800 font-semibold text-sm">
                        Question {String(originalIndex + 1).padStart(2, "0")}
                      </span>
                      <span className="bg-blue-50 text-blue-800 px-4 py-1 rounded-full text-sm font-bold">
                        {question.points} Points
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold mb-8">{question.text}</h2>

                    {question.type === "multiple_choice" && (
                      <div className="space-y-4">
                        {question.options?.map((option, i) => (
                          <label
                            key={i}
                            className={`flex items-center p-5 border rounded-xl cursor-pointer transition ${
                              answers[question.id] === i
                                ? "border-blue-700 bg-blue-50"
                                : "border-gray-200 hover:border-blue-700"
                            }`}
                          >
                            <input
                              type="radio"
                              name={`q${question.id}`}
                              checked={answers[question.id] === i}
                              onChange={() => handleAnswerChange(question.id, i)}
                              className="w-5 h-5"
                            />
                            <span className={`ml-4 ${answers[question.id] === i ? "text-blue-800 font-semibold" : ""}`}>
                              {option}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}

                    {question.type === "true_false" && (
                      <div className="flex gap-6">
                        {question.options?.map((option, i) => (
                          <label
                            key={i}
                            className="flex-1 flex items-center justify-center p-5 border border-gray-200 rounded-xl hover:border-blue-700 cursor-pointer"
                          >
                            <input
                              type="radio"
                              name={`q${question.id}`}
                              checked={answers[question.id] === i}
                              onChange={() => handleAnswerChange(question.id, i)}
                              className="w-5 h-5"
                            />
                            <span className="ml-4 font-bold">{option}</span>
                          </label>
                        ))}
                      </div>
                    )}

                    {question.type === "essay" && (
                      <>
                        <textarea
                          rows={8}
                          value={answers[question.id] || ""}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          placeholder="Type your response here..."
                          className="w-full bg-blue-50/30 border-b-2 border-gray-200 focus:border-blue-700 focus:outline-none p-5 rounded-xl"
                        />
                        <div className="flex justify-end mt-3">
                          <span className="text-sm text-gray-400">
                            Word Count: {answers[question.id]?.split(/\s+/)?.filter(w => w.length > 0)?.length || 0} / 500
                          </span>
                        </div>
                      </>
                    )}
                  </section>
                );
              })
            )}

            {/* FOOTER ACTIONS (inchangé, mais désactive Previous/Next si nécessaire) */}
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
                  disabled={submitting}
                  className="px-8 py-4 bg-blue-800 text-white rounded-xl hover:bg-blue-900 shadow-lg disabled:opacity-50"
                >
                  Submit Assessment →
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* MODAL DE CONFIRMATION (message adapté) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-white max-w-md w-full p-10 rounded-3xl shadow-2xl text-center">
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl">
              ✅
            </div>
            <h3 className="text-3xl font-bold text-blue-900 mb-4">Ready to submit?</h3>
            <p className="text-gray-500 mb-8">
              You have {totalUnansweredCount} unanswered question(s) in the entire quiz.
              Once submitted, you will not be able to modify your answers.
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={handleSubmit} disabled={submitting} className="w-full py-4 bg-blue-800 text-white rounded-xl hover:bg-blue-900 disabled:opacity-50">
                {submitting ? "Submitting..." : "Yes, Submit Now"}
              </button>
              <button onClick={() => setShowModal(false)} className="w-full py-4 hover:bg-gray-50 rounded-xl">
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
    </div>
  );
}