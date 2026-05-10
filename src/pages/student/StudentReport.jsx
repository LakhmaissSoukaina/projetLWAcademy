// src/pages/student/StudentReport.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getStudentReports, getReportDetails } from "../../api/studentApi";
import { useParams, useNavigate } from "react-router-dom";

export default function StudentReport() {
  const { user } = useAuth();
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    fetchReport();
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
        <nav className="flex items-center gap-2 mb-10 text-sm text-gray-500">
          <span>Dashboard</span>
          <span>›</span>
          <span>Courses</span>
          <span>›</span>
          <span className="text-blue-800 font-semibold">Quiz Result</span>
        </nav>

        {/* HERO SECTION */}
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

        {/* QUESTION BREAKDOWN */}
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

        {/* RECOMMENDATIONS */}
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

        {/* ACTIONS */}
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
      </main>
    </div>
  );
}