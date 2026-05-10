// src/pages/professor/ProfessorAIReports.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getProfessorAIReports, generateAIReport } from "../../api/professorApi";

export default function ProfessorAIReports() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    averageScore: 0,
    successRate: 0,
    avgCompletionTime: 0,
    difficultItems: 0
  });
  const [heatmapData, setHeatmapData] = useState([
    { label: "Grammar", value: 60, color: "bg-blue-200" },
    { label: "Vocab", value: 85, color: "bg-blue-500" },
    { label: "Semantics", value: 35, color: "bg-red-300" },
    { label: "Phonetics", value: 70, color: "bg-blue-400" },
    { label: "History", value: 55, color: "bg-blue-300" },
    { label: "Syntax", value: 95, color: "bg-blue-900" }
  ]);
  const [aiInsight, setAiInsight] = useState({
    title: "AI Strategic Insight",
    content: "Most students are struggling with Abstract Bilingual Mapping. AI suggests a remedial lecture on Semantic Transference before the next module.",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995"
  });
  const [highPerformers, setHighPerformers] = useState([]);
  const [atRiskStudents, setAtRiskStudents] = useState([]);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchAIReports();
  }, []);

  const fetchAIReports = async () => {
    try {
      setLoading(true);
      const data = await getProfessorAIReports();
      setStats({
        averageScore: data.averageScore || 84.2,
        successRate: data.successRate || 92,
        avgCompletionTime: data.avgCompletionTime || 42,
        difficultItems: data.difficultItems || 3
      });
      setHeatmapData(data.heatmap || heatmapData);
      setAiInsight(data.aiInsight || aiInsight);
      setHighPerformers(data.highPerformers || [
        { initials: "EL", name: "Elena Laurent", score: "98%" },
        { initials: "MK", name: "Marc Khalil", score: "96%" }
      ]);
      setAtRiskStudents(data.atRiskStudents || [
        { initials: "JB", name: "Julien Bernard", info: "58% • 4 failed topics" },
        { initials: "SA", name: "Sarah Al-Farsi", info: "62% • Low engagement" }
      ]);
    } catch (error) {
      console.error("Error loading AI reports:", error);
      // Données par défaut
      setStats({
        averageScore: 84.2,
        successRate: 92,
        avgCompletionTime: 42,
        difficultItems: 3
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const report = await generateAIReport({ type: "quiz_report", format: "pdf" });
      // Créer un blob pour le téléchargement
      const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ai_report_${new Date().toISOString().split("T")[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting report:", error);
      alert("Erreur lors de l'export du rapport");
    } finally {
      setExporting(false);
    }
  };

  const handleApplyTeachingPlan = async () => {
    try {
      await generateAIReport({ action: "apply_teaching_plan" });
      alert("Plan d'enseignement appliqué avec succès !");
    } catch (error) {
      console.error("Error applying teaching plan:", error);
      alert("Erreur lors de l'application du plan");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    <div className="w-full bg-[#f9f9ff] min-h-screen">
      <main className="w-full px-6 lg:px-10 py-10">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-blue-700 mb-2">
              <span className="material-symbols-outlined text-sm">auto_awesome</span>
              <span className="text-xs font-semibold tracking-[0.2em] uppercase">AI Powered Analysis</span>
            </div>
            <h1 className="text-3xl lg:text-5xl font-bold text-blue-900 font-serif leading-tight">
              Advanced Quiz Reports
            </h1>
            <p className="text-base text-gray-500 mt-3 italic">
              Final Assessment: Introduction to Bilingual Semantics (Section B-24)
            </p>
          </div>
          <button 
            onClick={handleExport}
            disabled={exporting}
            className="bg-blue-900 text-white px-8 py-4 rounded-2xl font-semibold text-sm shadow-md hover:bg-blue-800 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 self-start md:self-auto disabled:opacity-50"
          >
            <span className="material-symbols-outlined">download</span>
            <span>{exporting ? "Exporting..." : "Export Reports"}</span>
          </button>
        </div>

        {/* METRICS */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-8 rounded-2xl shadow-md hover:-translate-y-1 transition-all duration-300">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Average Score</p>
            <h2 className="text-4xl font-bold text-blue-900">{stats.averageScore}%</h2>
            <div className="mt-5 flex items-center gap-2 text-green-600">
              <span className="material-symbols-outlined text-sm">trending_up</span>
              <span className="text-sm">+4.2% from mid-term</span>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-md hover:-translate-y-1 transition-all duration-300">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Success Rate</p>
            <h2 className="text-4xl font-bold text-gray-900">{stats.successRate}%</h2>
            <div className="mt-5 w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div className="bg-blue-900 h-2 rounded-full" style={{ width: `${stats.successRate}%` }}></div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-md hover:-translate-y-1 transition-all duration-300">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Avg. Completion</p>
            <h2 className="text-4xl font-bold text-gray-900">{stats.avgCompletionTime}m</h2>
            <p className="text-sm text-gray-500 mt-5 italic">Standard deviation: 8.5m</p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-md hover:-translate-y-1 transition-all duration-300">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Difficult Items</p>
            <h2 className="text-4xl font-bold text-red-600">{stats.difficultItems}</h2>
            <p className="text-sm text-gray-500 mt-5">Required immediate review</p>
          </div>
        </section>

        {/* CHART + AI */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          {/* HEATMAP */}
          <div className="xl:col-span-2 bg-white p-8 rounded-2xl shadow-md">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h3 className="text-2xl font-bold text-blue-900 mb-1 font-serif">Difficulty Heatmap</h3>
                <p className="text-gray-500 italic">Performance distribution across quiz sections</p>
              </div>
              <button onClick={handleExport} className="text-blue-900 font-semibold flex items-center gap-2 hover:underline">
                <span className="material-symbols-outlined">download</span>
                Export
              </button>
            </div>

            <div className="h-[320px] flex items-end gap-4 border-b border-l border-gray-100 p-4 rounded-xl bg-gray-50">
              {heatmapData.map((item) => (
                <div key={item.label} className="flex-1 flex flex-col justify-end items-center">
                  <div className={`${item.color} w-full rounded-t-xl hover:opacity-80 transition-all duration-300`} style={{ height: `${item.value}%` }}></div>
                  <span className="text-xs text-gray-500 rotate-45 mt-4">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* AI INSIGHT */}
          <div className="bg-blue-900 text-white p-8 rounded-2xl shadow-xl flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined">bolt</span>
                <h3 className="uppercase tracking-widest text-sm font-bold">{aiInsight.title}</h3>
              </div>
              <p className="leading-relaxed text-blue-100 mb-6">
                {aiInsight.content}
              </p>
              <img src={aiInsight.image} alt="AI" className="rounded-2xl h-44 w-full object-cover mb-6" />
            </div>
            <button 
              onClick={handleApplyTeachingPlan}
              className="w-full bg-white text-blue-900 font-semibold py-3 rounded-xl hover:bg-blue-50 transition-all duration-300"
            >
              Apply Teaching Plan
            </button>
          </div>
        </div>

        {/* STUDENTS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* HIGH PERFORMERS */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="p-5 border-b bg-gray-50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-green-600">workspace_premium</span>
                <h4 className="font-bold text-gray-900">High Performers ({highPerformers.length})</h4>
              </div>
              <span className="text-sm text-gray-400">Score &gt; 90%</span>
            </div>
            <div className="p-5 space-y-5">
              {highPerformers.map((student) => (
                <div key={student.name} className="flex items-center justify-between hover:bg-gray-50 p-3 rounded-xl transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-700">
                      {student.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.score} Correct</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-gray-400 cursor-pointer">more_vert</span>
                </div>
              ))}
            </div>
          </div>

          {/* AT RISK */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            <div className="p-5 border-b bg-gray-50 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-600">warning</span>
                <h4 className="font-bold text-gray-900">At-Risk Focus ({atRiskStudents.length})</h4>
              </div>
              <span className="text-sm text-gray-400">Score &lt; 65%</span>
            </div>
            <div className="p-5 space-y-5">
              {atRiskStudents.map((student) => (
                <div key={student.name} className="flex items-center justify-between hover:bg-gray-50 p-3 rounded-xl transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center font-bold text-red-600">
                      {student.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{student.name}</p>
                      <p className="text-sm text-gray-500">{student.info}</p>
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