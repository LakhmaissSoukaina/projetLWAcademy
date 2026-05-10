// src/pages/student/StudentReport.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getStudentReports, getReportDetails } from "../../api/studentApi";
import { generateMyReport, generateStudyPlanAI, getAISuggestions } from "../../api/studentApi";
import { useParams, useNavigate } from "react-router-dom";

export default function StudentReport() {
  const { user } = useAuth();
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [questions, setQuestions] = useState([]);
  
  // États pour l'IA
  const [generatingReport, setGeneratingReport] = useState(false);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [currentAiReport, setCurrentAiReport] = useState(null);
  const [currentAiPlan, setCurrentAiPlan] = useState(null);
  const [showAiReportModal, setShowAiReportModal] = useState(false);
  const [showAiPlanModal, setShowAiPlanModal] = useState(false);
  const [previousReports, setPreviousReports] = useState([]);
  const [previousPlans, setPreviousPlans] = useState([]);

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
    fetchReport();
    fetchAIData();
  }, [reportId]);

  const fetchReport = async () => {
    try {
      setLoading(true);
      const data = await getReportDetails(reportId);
      setReport(data.report);
      setQuestions(data.questions || []);
    } catch (error) {
      console.error("Error loading report:", error);
      // Données mockées
      setReport({
        id: 1,
        title: "Advanced Phonetics Quiz",
        score: 85,
        grade: "Excellent",
        aiInsight: "Your understanding of nasal vowels is exceptional, though there's a slight confusion between the 'un' and 'in' sounds in academic contexts.",
        strengths: ["Vowel Consistency", "Liaison Rules"],
        weaknesses: ["Dialectal Variations", "Nasal Vowels"],
        badges: ["Phonetics Beginner", "Vowel Master"],
        nextBadge: "Phonetic Master",
        nextBadgeProgress: 66
      });
      setQuestions([
        {
          id: 1,
          text: "How does the 'liaison' affect the pronunciation of the phrase 'les amis'?",
          userAnswer: "The final 's' is pronounced as a 'z' sound linking to 'amis'.",
          correctAnswer: "The 's' becomes a voiced alveolar sound /z/ before the vowel.",
          isCorrect: true,
          feedback: "Perfect application of the liaison rule. Your terminology was concise and accurate."
        },
        {
          id: 2,
          text: "Identify the IPA symbol for the 'u' sound in the word 'tu'.",
          userAnswer: "/u/",
          correctAnswer: "/y/ — The high front rounded vowel.",
          isCorrect: false,
          feedback: "You confused the English /u/ sound with the French /y/ sound."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const fetchAIData = async () => {
    try {
      const suggestions = await getAISuggestions();
      const reports = suggestions.filter(s => s.type === 'student_self_report');
      const plans = suggestions.filter(s => s.type === 'study_plan_ai');
      setPreviousReports(reports.slice(0, 3));
      setPreviousPlans(plans.slice(0, 3));
    } catch (error) {
      console.error("Error fetching AI data:", error);
    }
  };

  const handleGenerateReport = async () => {
    setGeneratingReport(true);
    setShowAiReportModal(true);
    try {
      const result = await generateMyReport();
      setCurrentAiReport(result);
      await fetchAIData();
    } catch (error) {
      console.error("Error generating report:", error);
      setCurrentAiReport({ report: "Erreur lors de la génération du rapport", success: false });
    } finally {
      setGeneratingReport(false);
    }
  };

  const handleGenerateStudyPlan = async () => {
    setGeneratingPlan(true);
    setShowAiPlanModal(true);
    try {
      const result = await generateStudyPlanAI();
      setCurrentAiPlan(result);
      await fetchAIData();
    } catch (error) {
      console.error("Error generating study plan:", error);
      setCurrentAiPlan({ study_plan: "Erreur lors de la génération du plan", success: false });
    } finally {
      setGeneratingPlan(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600";
    if (score >= 75) return "text-blue-800";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return "Excellent";
    if (score >= 75) return "Good";
    if (score >= 60) return "Average";
    return "Need Improvement";
  };

  const getProgressColor = (score) => {
    if (score >= 90) return "#22c55e";
    if (score >= 75) return "#1d4ed8";
    if (score >= 60) return "#eab308";
    return "#ef4444";
  };

  // === DÉFINITION DES SECTIONS AVEC MOTS‑CLÉS ===
  const sections = [
    { id: "hero", title: "Section Score, AI Insight, Badges", keywords: ["score", "insight", "badges", "résultat"] },
    { id: "questions", title: "Question Breakdown", keywords: ["question", "breakdown", "réponses"] },
    { id: "recommendations", title: "Revision Recommendations", keywords: ["recommandations", "recommendations", "revision"] },
    { id: "history", title: "Historique IA", keywords: ["historique", "history", "ia", "rapports", "plans"] },
    { id: "actions", title: "Actions (Retake Quiz, Next Lesson)", keywords: ["actions", "retake", "next", "quiz", "lesson"] }
  ];

  const isSectionVisible = (keywords) => {
    if (!globalSearchTerm.trim()) return true;
    const term = globalSearchTerm.toLowerCase();
    return keywords.some(kw => kw.toLowerCase().includes(term));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500">Rapport non trouvé</p>
      </div>
    );
  }

  const score = report.score || 0;
  const scoreMessage = getScoreMessage(score);
  const scoreColor = getScoreColor(score);
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#141b2b]">
      <main className="max-w-[1440px] mx-auto px-6 py-8">
        {/* BREADCRUMB */}
        <nav className="flex items-center gap-2 mb-6 text-sm text-gray-500">
          <span>Dashboard</span>
          <span>›</span>
          <span>Courses</span>
          <span>›</span>
          <span className="text-blue-800 font-semibold">Quiz Result</span>
        </nav>

        {/* BOUTONS IA EN HAUT (toujours visibles) */}
        <div className="flex justify-end gap-3 mb-6">
          <button 
            onClick={handleGenerateReport}
            disabled={generatingReport}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition disabled:opacity-50"
          >
            <span className="material-symbols-outlined">psychology</span>
            {generatingReport ? "Génération..." : "Mon Rapport Complet IA"}
          </button>
          <button 
            onClick={handleGenerateStudyPlan}
            disabled={generatingPlan}
            className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition disabled:opacity-50"
          >
            <span className="material-symbols-outlined">menu_book</span>
            {generatingPlan ? "Génération..." : "Plan d'étude IA"}
          </button>
        </div>

        {/* Badge de recherche (affiché si recherche active) */}
        {globalSearchTerm && (
          <div className="mb-6 flex justify-end">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm">
              <span className="material-symbols-outlined text-sm">search</span>
              Showing only sections matching: <strong>{globalSearchTerm}</strong>
              <button
                onClick={() => setGlobalSearchTerm("")}
                className="ml-1 hover:bg-blue-100 rounded-full p-0.5"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          </div>
        )}

        {/* HERO SECTION (Score, AI Insight, Badges) */}
        {isSectionVisible(sections.find(s => s.id === "hero").keywords) && (
          <section className="grid grid-cols-12 gap-8 mb-14">
            {/* SCORE CARD */}
            <div className="col-span-12 lg:col-span-4 bg-white rounded-3xl shadow-sm p-10 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_50%_-20%,#1e40af,transparent)]" />
              <div className="relative w-52 h-52 mb-6">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 220 220">
                  <circle cx="110" cy="110" r="90" stroke="#e5e7eb" strokeWidth="12" fill="none" />
                  <circle
                    cx="110"
                    cy="110"
                    r="90"
                    stroke={getProgressColor(score)}
                    strokeWidth="12"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <h1 className={`text-5xl font-bold ${scoreColor}`}>{score}%</h1>
                  <p className="uppercase tracking-widest text-gray-500 text-sm mt-2">{scoreMessage}</p>
                </div>
              </div>
              <p className="text-center text-gray-600">
                You passed the<br />
                <span className="font-bold text-[#141b2b]">{report.title}</span>
              </p>
            </div>

            {/* AI INSIGHT */}
            <div className="col-span-12 lg:col-span-5 bg-white rounded-3xl shadow-sm p-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-2xl">✨</div>
                <h2 className="text-2xl font-bold text-blue-900">AI Insight</h2>
              </div>
              <p className="text-lg italic text-gray-700 leading-relaxed mb-8">
                "{report.aiInsight}"
              </p>
              <div className="space-y-5">
                {report.strengths?.map((strength, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-green-600 text-xl">✓</span>
                    <div>
                      <p className="uppercase text-xs tracking-widest text-gray-400">Strength</p>
                      <p className="font-semibold">{strength}</p>
                    </div>
                  </div>
                ))}
                {report.weaknesses?.map((weakness, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="text-red-500 text-xl">!</span>
                    <div>
                      <p className="uppercase text-xs tracking-widest text-gray-400">Growth Area</p>
                      <p className="font-semibold">{weakness}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BADGES */}
            <div className="col-span-12 lg:col-span-3 bg-blue-800 rounded-3xl shadow-sm p-8 text-white flex flex-col justify-between">
              <div>
                <p className="uppercase tracking-widest text-sm opacity-80 mb-6">Badges Earned</p>
                <div className="flex gap-4">
                  {report.badges?.map((badge, i) => (
                    <div key={i} className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-2xl">
                      🎖️
                    </div>
                  ))}
                </div>
              </div>
              <div className="mt-10">
                <p className="text-sm opacity-80 mb-3">Next Badge: {report.nextBadge}</p>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-white rounded-full" style={{ width: `${report.nextBadgeProgress}%` }} />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* QUESTION BREAKDOWN */}
        {isSectionVisible(sections.find(s => s.id === "questions").keywords) && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-blue-900 mb-8">Question Breakdown</h2>
            <div className="space-y-8">
              {questions.map((question, index) => (
                <div key={question.id} className={`bg-white rounded-3xl shadow-sm p-8 border-l-4 ${question.isCorrect ? 'border-blue-700' : 'border-red-500'}`}>
                  <div className="flex items-center gap-4 mb-5">
                    <span className="bg-blue-50 text-blue-800 px-4 py-1 rounded-full text-sm font-bold">
                      Question {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className={question.isCorrect ? "text-green-600 font-semibold" : "text-red-500 font-semibold"}>
                      {question.isCorrect ? "✓ Correct" : "✕ Incorrect"}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold mb-8">{question.text}</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className={question.isCorrect ? "bg-blue-50 rounded-2xl p-6" : "bg-red-50 rounded-2xl p-6"}>
                      <p className="text-sm uppercase tracking-widest text-gray-400 mb-2">Your Answer</p>
                      <p className={`font-semibold italic ${question.isCorrect ? "text-blue-800" : "text-red-500"}`}>
                        "{question.userAnswer}"
                      </p>
                    </div>
                    <div className="bg-gray-50 rounded-2xl p-6">
                      <p className="text-sm uppercase tracking-widest text-gray-400 mb-2">Model Solution</p>
                      <p className="font-semibold">{question.correctAnswer}</p>
                    </div>
                  </div>

                  <div className="mt-6 pt-6 border-t">
                    <p className="italic text-gray-600">🤖 AI Feedback: {question.feedback}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* RECOMMENDATIONS */}
        {isSectionVisible(sections.find(s => s.id === "recommendations").keywords) && (
          <section className="bg-blue-50/40 rounded-3xl p-10 mb-16">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-10">
              <div>
                <h2 className="text-3xl font-bold text-blue-900">Revision Recommendations</h2>
                <p className="text-gray-600 mt-2">Focus on these modules to improve your weak areas.</p>
              </div>
              <button className="bg-blue-800 text-white px-8 py-4 rounded-2xl hover:bg-blue-900 transition">
                Study All
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {report.weaknesses?.map((weakness, i) => (
                <div key={i} className="bg-white rounded-2xl p-6 shadow-sm hover:translate-x-1 transition">
                  <div className="flex items-center gap-5">
                    <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center text-3xl">
                      {i === 0 ? "▶" : "📄"}
                    </div>
                    <div>
                      <p className="text-sm uppercase tracking-widest text-blue-800 font-semibold">Module {i + 4}.{i + 2}</p>
                      <h4 className="text-xl font-bold">Review: {weakness}</h4>
                      <p className="text-sm text-gray-500">12 min video • Interactive practice</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* HISTORIQUE DES RAPPORTS IA */}
        {isSectionVisible(sections.find(s => s.id === "history").keywords) && (previousReports.length > 0 || previousPlans.length > 0) && (
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-blue-900 mb-6">📋 Historique IA</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {previousReports.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-purple-600 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined">history</span>
                    Rapports précédents
                  </h3>
                  <div className="space-y-3">
                    {previousReports.map((r, i) => (
                      <div key={i} className="p-3 bg-purple-50 rounded-xl">
                        <p className="text-sm text-gray-700 line-clamp-2">{r.content.substring(0, 100)}...</p>
                        <p className="text-xs text-gray-400 mt-2">{new Date(r.generatedAt).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {previousPlans.length > 0 && (
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <h3 className="font-bold text-green-600 mb-4 flex items-center gap-2">
                    <span className="material-symbols-outlined">history</span>
                    Plans d'étude précédents
                  </h3>
                  <div className="space-y-3">
                    {previousPlans.map((p, i) => (
                      <div key={i} className="p-3 bg-green-50 rounded-xl">
                        <p className="text-sm text-gray-700 line-clamp-2">{p.content.substring(0, 100)}...</p>
                        <p className="text-xs text-gray-400 mt-2">{new Date(p.generatedAt).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* ACTIONS (Retake Quiz, Next Lesson) */}
        {isSectionVisible(sections.find(s => s.id === "actions").keywords) && (
          <div className="flex flex-col md:flex-row justify-center gap-6 pb-10">
            <button className="px-10 py-4 border-2 border-blue-800 text-blue-800 rounded-2xl hover:bg-blue-50 transition">
              Retake Quiz
            </button>
            <button 
              onClick={() => navigate("/student/courses")}
              className="px-10 py-4 bg-blue-800 text-white rounded-2xl hover:bg-blue-900 shadow-lg transition"
            >
              Next Lesson
            </button>
          </div>
        )}
      </main>

      {/* MODAL RAPPORT IA */}
      {showAiReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-purple-600 flex items-center gap-2">
                <span className="material-symbols-outlined">psychology</span>
                Mon Rapport Personnalisé
              </h2>
              <button onClick={() => setShowAiReportModal(false)} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6">
              {generatingReport ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Génération de votre rapport personnalisé...</p>
                </div>
              ) : currentAiReport ? (
                <div>
                  <div className="bg-purple-50 rounded-xl p-4 mb-6">
                    <p className="text-sm text-purple-600">Progression actuelle: {report.score || 0}%</p>
                    <div className="w-full h-2 bg-purple-200 rounded-full mt-2">
                      <div className="h-full bg-purple-600 rounded-full" style={{ width: `${report.score || 0}%` }}></div>
                    </div>
                  </div>
                  <div className="prose max-w-none">
                    <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                      {currentAiReport.report}
                    </div>
                  </div>
                  <p className="text-xs text-gray-400 mt-6 text-right">
                    Généré le {new Date(currentAiReport.generated_at || new Date()).toLocaleString()}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Erreur lors de la génération du rapport</p>
              )}
            </div>
            <div className="sticky bottom-0 bg-gray-50 p-4 border-t border-gray-100 flex justify-end">
              <button onClick={() => setShowAiReportModal(false)} className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PLAN D'ÉTUDE IA */}
      {showAiPlanModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="sticky top-0 bg-white p-6 border-b border-gray-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-green-600 flex items-center gap-2">
                <span className="material-symbols-outlined">menu_book</span>
                Plan d'étude Personnalisé
              </h2>
              <button onClick={() => setShowAiPlanModal(false)} className="text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="p-6">
              {generatingPlan ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Génération de votre plan d'étude personnalisé...</p>
                </div>
              ) : currentAiPlan ? (
                <div>
                  <div className="bg-green-50 rounded-xl p-4 mb-6">
                    <p className="text-sm text-green-600">Plan basé sur vos résultats actuels</p>
                  </div>
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {currentAiPlan.study_plan}
                  </div>
                  <p className="text-xs text-gray-400 mt-6 text-right">
                    Généré le {new Date(currentAiPlan.generated_at || new Date()).toLocaleString()}
                  </p>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">Erreur lors de la génération du plan d'étude</p>
              )}
            </div>
            <div className="sticky bottom-0 bg-gray-50 p-4 border-t border-gray-100 flex justify-end">
              <button onClick={() => setShowAiPlanModal(false)} className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition">
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}