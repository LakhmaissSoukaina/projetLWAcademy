import { useState, useEffect } from "react";
import {
  getAIReports,
  generateAIReport,
  getAISystemStats
} from "../../api/adminApi";

function AIReports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("Last 30 Days");
  const [selectedStream, setSelectedStream] = useState("All Streams");
  const [showFilters, setShowFilters] = useState(false);

  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const [reports, setReports] = useState([]);

  const [showReportModal, setShowReportModal] = useState(false);
  const [generatedReport, setGeneratedReport] = useState(null);

  const [stats, setStats] = useState({
    totalInteractions: 0,
    reportsGenerated: 0,
    accuracyRate: 0,
    avgResponseTime: 0,
    dataCoverage: 0
  });

  const [insights] = useState([
    {
      id: 1,
      icon: "trending_up",
      iconBg: "bg-blue-50 text-blue-800",
      title: "Performance Uptrend Detected",
      description:
        "Students engaging with AI tutoring show 23% higher completion rates in assessments.",
      metric: "+23%",
      metricColor: "text-green-600"
    },
    {
      id: 2,
      icon: "flag",
      iconBg: "bg-red-50 text-red-600",
      title: "Critical Attention Required",
      description:
        "42 students flagged as at-risk. Intervention recommended within 48 hours.",
      metric: "42 students",
      metricColor: "text-red-600"
    }
  ]);

  useEffect(() => {
    fetchAIReports();
    fetchAIStats();
  }, []);

  const fetchAIReports = async () => {
    try {
      setLoading(true);

      const data = await getAIReports();

      setReports(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading AI reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAIStats = async () => {
    try {
      const data = await getAISystemStats();

      setStats({
        totalInteractions: data.totalInteractions || 24582,
        reportsGenerated: data.reportsGenerated || 1847,
        accuracyRate: data.accuracyRate || 96.4,
        avgResponseTime: data.avgResponseTime || 1.2,
        dataCoverage: data.dataCoverage || 98.7
      });
    } catch (error) {
      console.error("Error loading AI stats:", error);
    }
  };

  const handleGenerateReport = async (reportType) => {
    setGenerating(true);
    setShowReportModal(true);

    try {
      const result = await generateAIReport(reportType);

      setGeneratedReport(result);

      await fetchAIReports();
    } catch (error) {
      console.error("Error generating report:", error);

      setGeneratedReport({
        success: false,
        report: "Erreur lors de la génération du rapport"
      });
    } finally {
      setGenerating(false);
    }
  };

  const statsCards = [
    {
      title: "AI Interactions",
      value: stats.totalInteractions.toLocaleString(),
      icon: "chat",
      color: "bg-blue-100 text-blue-800",
      progress: 78,
      progressColor: "bg-blue-900",
      trend: "+12%",
      trendUp: true
    },
    {
      title: "Reports Generated",
      value: stats.reportsGenerated.toLocaleString(),
      icon: "auto_stories",
      color: "bg-gray-100 text-gray-600",
      progress: 65,
      progressColor: "bg-gray-500",
      trend: "+8%",
      trendUp: true
    },
    {
      title: "Accuracy Rate",
      value: `${stats.accuracyRate}%`,
      icon: "verified",
      color: "bg-emerald-50 text-emerald-600",
      progress: stats.accuracyRate,
      progressColor: "bg-emerald-500",
      trend: "+2.1%",
      trendUp: true
    }
  ];

  const periods = [
    "Last 7 Days",
    "Last 30 Days",
    "Last Quarter",
    "Last Semester",
    "Academic Year 2024"
  ];

  const streams = [
    "All Streams",
    "Bilingual French",
    "Advanced Arabic",
    "Classical Literature",
    "Applied Sciences"
  ];

  const filteredReports = reports.filter((report) =>
    report.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-full">

      {/* HEADER */}
      <div>
        <nav className="flex items-center gap-2 mb-4 text-xs text-gray-400">
          <span className="hover:text-blue-800 transition-colors cursor-pointer font-medium">
            Admin
          </span>

          <span className="material-symbols-outlined text-sm">
            chevron_right
          </span>

          <span className="text-blue-900 font-bold">
            AI Reports
          </span>
        </nav>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <span className="text-blue-900 font-semibold uppercase tracking-widest text-xs">
              Intelligent Analytics
            </span>

            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2 font-serif">
              AI-Powered Reports
            </h1>

            <p className="text-base text-gray-500 max-w-2xl mt-4">
              Monitor AI-generated insights, predictive analytics,
              and automated assessments across all academic streams.
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-gray-200 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">
                filter_list
              </span>

              Filters
            </button>

            <button
              onClick={() => handleGenerateReport("global_report")}
              disabled={generating}
              className="bg-blue-900 text-white px-5 py-2.5 rounded-full font-semibold text-sm shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <span className="material-symbols-outlined text-sm">
                auto_awesome
              </span>

              {generating ? "Génération..." : "Generate Report"}
            </button>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-[0_4px_20px_rgba(30,64,175,0.05)] border border-gray-100 hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.color}`}
                >
                  <span className="material-symbols-outlined">
                    {stat.icon}
                  </span>
                </div>

                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">
                    {stat.title}
                  </p>

                  <p className="text-2xl font-bold text-gray-900 font-serif">
                    {stat.value}
                  </p>
                </div>
              </div>

              <span
                className={`text-xs font-bold px-2 py-1 rounded-full ${
                  stat.trendUp
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {stat.trend}
              </span>
            </div>

            <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ${stat.progressColor}`}
                style={{ width: `${stat.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* FILTERS */}
      {showFilters && (
        <section className="bg-white p-6 rounded-xl shadow-[0_4px_20px_rgba(30,64,175,0.05)] border border-gray-100 flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[280px] relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <span className="material-symbols-outlined text-lg">
                search
              </span>
            </span>

            <input
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-blue-200 text-sm transition-all outline-none placeholder-gray-400"
              placeholder="Search reports..."
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-3 flex-wrap">

            <select
              className="bg-gray-50 rounded-lg py-3 px-4 text-sm font-semibold"
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
            >
              {periods.map((period, idx) => (
                <option key={idx}>{period}</option>
              ))}
            </select>

            <select
              className="bg-gray-50 rounded-lg py-3 px-4 text-sm font-semibold"
              value={selectedStream}
              onChange={(e) => setSelectedStream(e.target.value)}
            >
              {streams.map((stream, idx) => (
                <option key={idx}>{stream}</option>
              ))}
            </select>

          </div>
        </section>
      )}

      {/* REPORTS TABLE */}
      <div className="bg-white rounded-xl shadow-[0_12px_40px_rgba(30,64,175,0.08)] overflow-hidden border border-gray-100">

        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-blue-900 font-serif">
            Generated Reports
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">

            <thead className="bg-gray-50/50">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Report
                </th>

                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Type
                </th>

                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Generated
                </th>

                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">
                  Status
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {filteredReports.map((report) => (
                <tr
                  key={report.id}
                  className="hover:bg-blue-50/30 transition-colors"
                >
                  <td className="px-6 py-5">
                    <p className="font-bold text-gray-900 text-sm">
                      {report.title}
                    </p>
                  </td>

                  <td className="px-6 py-5">
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700">
                      {report.type}
                    </span>
                  </td>

                  <td className="px-6 py-5">
                    <div className="text-sm text-gray-700">
                      {report.date}
                    </div>
                  </td>

                  <td className="px-6 py-5">
                    <span className="px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider border bg-green-50 text-green-700 border-green-100">
                      {report.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>
      </div>

      {/* QUICK ACTIONS */}
      <div className="bg-blue-900 text-white p-6 rounded-xl shadow-lg shadow-blue-900/20">
        <h3 className="text-lg font-bold font-serif mb-4">
          Quick Actions
        </h3>

        <div className="space-y-3">

          <button
            onClick={() => handleGenerateReport("predictive_analysis")}
            disabled={generating}
            className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all text-sm font-semibold disabled:opacity-50"
          >
            <span className="material-symbols-outlined">
              psychology
            </span>

            Run Predictive Analysis
          </button>

          <button
            onClick={() => handleGenerateReport("risk_assessment")}
            disabled={generating}
            className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all text-sm font-semibold disabled:opacity-50"
          >
            <span className="material-symbols-outlined">
              warning
            </span>

            Identify At-Risk Students
          </button>

          <button
            onClick={() => handleGenerateReport("curriculum_gap")}
            disabled={generating}
            className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all text-sm font-semibold disabled:opacity-50"
          >
            <span className="material-symbols-outlined">
              menu_book
            </span>

            Analyze Curriculum Gaps
          </button>

        </div>
      </div>

      {/* MODAL RAPPORT IA */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">

            {/* HEADER */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex justify-between items-center">

              <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-2">
                <span className="material-symbols-outlined">
                  auto_awesome
                </span>

                AI Generated Report
              </h2>

              <button
                onClick={() => setShowReportModal(false)}
                className="text-gray-400 hover:text-gray-700 transition"
              >
                <span className="material-symbols-outlined">
                  close
                </span>
              </button>

            </div>

            {/* BODY */}
            <div className="p-6">

              {generating ? (
                <div className="text-center py-16">

                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>

                  <p className="text-gray-500">
                    Génération du rapport IA...
                  </p>

                </div>
              ) : generatedReport ? (
                <div>

                  {generatedReport.statistics && (
                    <div className="bg-blue-50 rounded-xl p-5 mb-6">

                      <h3 className="font-bold text-blue-900 mb-3">
                        Report Statistics
                      </h3>

                      <div className="space-y-2 text-sm text-gray-700">

                        <p>
                          Total étudiants :
                          {" "}
                          {generatedReport.statistics.total_students || 0}
                        </p>

                        <p>
                          Moyenne :
                          {" "}
                          {generatedReport.statistics.avg_score || 0}%
                        </p>

                        <p>
                          Taux de réussite :
                          {" "}
                          {generatedReport.statistics.success_rate || 0}%
                        </p>

                      </div>
                    </div>
                  )}

                  <div className="whitespace-pre-wrap leading-relaxed text-gray-700">
                    {generatedReport.report ||
                      generatedReport.message ||
                      "Rapport généré avec succès"}
                  </div>

                  <p className="text-xs text-gray-400 mt-6 text-right">
                    Généré le{" "}
                    {new Date(
                      generatedReport.generated_at || new Date()
                    ).toLocaleString()}
                  </p>

                </div>
              ) : (
                <p className="text-center text-gray-500 py-10">
                  Aucun rapport généré
                </p>
              )}

            </div>

            {/* FOOTER */}
            <div className="sticky bottom-0 bg-gray-50 border-t border-gray-100 p-4 flex justify-end">

              <button
                onClick={() => setShowReportModal(false)}
                className="px-6 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
              >
                Fermer
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default AIReports;