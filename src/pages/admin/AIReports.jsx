import { useState } from "react";

function AIReports() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("Last 30 Days");
  const [selectedStream, setSelectedStream] = useState("All Streams");
  const [showFilters, setShowFilters] = useState(false);

  // Statistiques IA
  const stats = [
    {
      title: "AI Interactions",
      value: "24,582",
      icon: "chat",
      color: "bg-blue-100 text-blue-800",
      progress: 78,
      progressColor: "bg-blue-900",
      trend: "+12%",
      trendUp: true
    },
    {
      title: "Reports Generated",
      value: "1,847",
      icon: "auto_stories",
      color: "bg-gray-100 text-gray-600",
      progress: 65,
      progressColor: "bg-gray-500",
      trend: "+8%",
      trendUp: true
    },
    {
      title: "Accuracy Rate",
      value: "96.4%",
      icon: "verified",
      color: "bg-emerald-50 text-emerald-600",
      progress: 96,
      progressColor: "bg-emerald-500",
      trend: "+2.1%",
      trendUp: true
    }
  ];

  // Données des rapports IA
  const reports = [
    {
      id: 1,
      title: "Student Performance Prediction - Q3",
      type: "Predictive Analysis",
      typeIcon: "psychology",
      typeColor: "bg-purple-50 text-purple-700",
      generatedBy: "AI Model v4.2",
      date: "Oct 12, 2024",
      status: "Completed",
      statusColor: "bg-green-50 text-green-700 border-green-100",
      confidence: 94.2,
      students: 1240
    },
    {
      id: 2,
      title: "At-Risk Student Identification",
      type: "Risk Assessment",
      typeIcon: "warning",
      typeColor: "bg-red-50 text-red-700",
      generatedBy: "AI Model v4.2",
      date: "Oct 10, 2024",
      status: "Completed",
      statusColor: "bg-green-50 text-green-700 border-green-100",
      confidence: 89.7,
      students: 42
    },
    {
      id: 3,
      title: "Curriculum Gap Analysis - French Lit",
      type: "Content Analysis",
      typeIcon: "menu_book",
      typeColor: "bg-blue-50 text-blue-700",
      generatedBy: "AI Model v4.1",
      date: "Oct 08, 2024",
      status: "Processing",
      statusColor: "bg-blue-50 text-blue-800 border-blue-100",
      confidence: null,
      students: 580
    },
    {
      id: 4,
      title: "Peer Tutor Effectiveness Report",
      type: "Performance Analysis",
      typeIcon: "groups",
      typeColor: "bg-amber-50 text-amber-700",
      generatedBy: "AI Model v4.2",
      date: "Oct 05, 2024",
      status: "Completed",
      statusColor: "bg-green-50 text-green-700 border-green-100",
      confidence: 91.3,
      students: 156
    },
    {
      id: 5,
      title: "Engagement Pattern Recognition",
      type: "Behavioral Analysis",
      typeIcon: "analytics",
      typeColor: "bg-teal-50 text-teal-700",
      generatedBy: "AI Model v4.2",
      date: "Oct 01, 2024",
      status: "Completed",
      statusColor: "bg-green-50 text-green-700 border-green-100",
      confidence: 87.5,
      students: 2104
    }
  ];

  // Insights IA
  const insights = [
    {
      id: 1,
      icon: "trending_up",
      iconBg: "bg-blue-50 text-blue-800",
      title: "Performance Uptrend Detected",
      description: "Students engaging with AI tutoring show 23% higher completion rates in Chapter 4 assessments.",
      metric: "+23%",
      metricColor: "text-green-600"
    },
    {
      id: 2,
      icon: "flag",
      iconBg: "bg-red-50 text-red-600",
      title: "Critical Attention Required",
      description: "42 students flagged as at-risk in Advanced Arabic Syntax. Intervention recommended within 48 hours.",
      metric: "42 students",
      metricColor: "text-red-600"
    },
    {
      id: 3,
      icon: "lightbulb",
      iconBg: "bg-amber-50 text-amber-600",
      title: "Curriculum Optimization Suggested",
      description: "AI analysis suggests restructuring Phonetics module to improve retention by estimated 15%.",
      metric: "+15% est.",
      metricColor: "text-amber-600"
    }
  ];

  // Périodes disponibles
  const periods = [
    "Last 7 Days",
    "Last 30 Days",
    "Last Quarter",
    "Last Semester",
    "Academic Year 2024"
  ];

  // Streams disponibles
  const streams = [
    "All Streams",
    "Bilingual French",
    "Advanced Arabic",
    "Classical Literature",
    "Applied Sciences"
  ];

  const handleDownload = (id) => {
    console.log("Download report:", id);
  };

  const handleView = (id) => {
    console.log("View report:", id);
  };

  const handleRegenerate = (id) => {
    console.log("Regenerate report:", id);
  };

  return (
    <div className="space-y-6 w-full max-w-full">
      {/* Breadcrumb & Header */}
      <div>
        <nav className="flex items-center gap-2 mb-4 text-xs text-gray-400">
          <span className="hover:text-blue-800 transition-colors cursor-pointer font-medium">Admin</span>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-blue-900 font-bold">AI Reports</span>
        </nav>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <span className="text-blue-900 font-semibold uppercase tracking-widest text-xs">Intelligent Analytics</span>
            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mt-2 font-serif">AI-Powered Reports</h1>
            <p className="text-base text-gray-500 max-w-2xl mt-4">
              Monitor AI-generated insights, predictive analytics, and automated assessments across all academic streams. Review model confidence and intervention recommendations.
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-full font-semibold text-sm hover:bg-gray-200 transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-sm">filter_list</span>
              Filters
            </button>
            <button className="bg-blue-900 text-white px-5 py-2.5 rounded-full font-semibold text-sm shadow-lg shadow-blue-900/20 hover:bg-blue-800 transition-all flex items-center gap-2">
              <span className="material-symbols-outlined text-sm">add</span>
              Generate Report
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-[0_4px_20px_rgba(30,64,175,0.05)] border border-gray-100 hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.color}`}>
                  <span className="material-symbols-outlined">{stat.icon}</span>
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 font-serif">{stat.value}</p>
                </div>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.trendUp ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
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

      {/* Filter Bar (conditional) */}
      {showFilters && (
        <section className="bg-white p-6 rounded-xl shadow-[0_4px_20px_rgba(30,64,175,0.05)] border border-gray-100 flex flex-wrap gap-4 items-center animate-in slide-in-from-top-2">
          <div className="flex-1 min-w-[280px] relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
              <span className="material-symbols-outlined text-lg">search</span>
            </span>
            <input 
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-lg focus:ring-2 focus:ring-blue-200 text-sm transition-all outline-none placeholder-gray-400"
              placeholder="Search reports by title, type or model..." 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3 flex-wrap">
            <div className="relative">
              <select 
                className="appearance-none bg-gray-50 border-none rounded-lg py-3 pl-4 pr-10 text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-blue-200 transition-all cursor-pointer outline-none"
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                {periods.map((period, idx) => (
                  <option key={idx} value={period}>{period}</option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none material-symbols-outlined text-gray-400 text-sm">expand_more</span>
            </div>
            
            <div className="relative">
              <select 
                className="appearance-none bg-gray-50 border-none rounded-lg py-3 pl-4 pr-10 text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-blue-200 transition-all cursor-pointer outline-none"
                value={selectedStream}
                onChange={(e) => setSelectedStream(e.target.value)}
              >
                {streams.map((stream, idx) => (
                  <option key={idx} value={stream}>{stream}</option>
                ))}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none material-symbols-outlined text-gray-400 text-sm">expand_more</span>
            </div>
            
            <button className="p-3 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors">
              <span className="material-symbols-outlined">tune</span>
            </button>
          </div>
        </section>
      )}

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Reports Table - 8 colonnes */}
        <div className="lg:col-span-8 bg-white rounded-xl shadow-[0_12px_40px_rgba(30,64,175,0.08)] overflow-hidden border border-gray-100">
          <div className="p-6 border-b border-gray-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h2 className="text-xl font-bold text-blue-900 font-serif">Generated Reports</h2>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors">
                <span className="material-symbols-outlined text-sm">download</span>
                Export All
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-gray-50/50">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Report</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Generated</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Confidence</th>
                  <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-blue-50/30 transition-colors group">
                    {/* Report Title */}
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${report.typeColor}`}>
                          <span className="material-symbols-outlined text-lg">{report.typeIcon}</span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-gray-900 text-sm truncate">{report.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5">{report.students.toLocaleString()} students analyzed</p>
                        </div>
                      </div>
                    </td>

                    {/* Type */}
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${report.typeColor}`}>
                        {report.type}
                      </span>
                    </td>

                    {/* Generated */}
                    <td className="px-6 py-5">
                      <div className="text-sm text-gray-700">{report.date}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{report.generatedBy}</div>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider border ${report.statusColor}`}>
                        {report.status}
                      </span>
                    </td>

                    {/* Confidence */}
                    <td className="px-6 py-5">
                      {report.confidence ? (
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className="bg-blue-900 h-full rounded-full"
                              style={{ width: `${report.confidence}%` }}
                            />
                          </div>
                          <span className="text-sm font-bold text-gray-900">{report.confidence}%</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-400 italic">Calculating...</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => handleView(report.id)}
                          className="p-2 hover:bg-blue-50 rounded-lg text-blue-800 transition-colors"
                          title="View Report"
                        >
                          <span className="material-symbols-outlined">visibility</span>
                        </button>
                        <button 
                          onClick={() => handleDownload(report.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
                          title="Download"
                        >
                          <span className="material-symbols-outlined">download</span>
                        </button>
                        <button 
                          onClick={() => handleRegenerate(report.id)}
                          className="p-2 hover:bg-blue-50 rounded-lg text-blue-800 transition-colors"
                          title="Regenerate"
                        >
                          <span className="material-symbols-outlined">refresh</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="p-5 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-gray-400">
              Showing <span className="font-bold text-gray-900">1-{reports.length}</span> of <span className="font-bold text-gray-900">47</span> reports
            </p>
            <div className="flex gap-2">
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-white transition-colors text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined text-lg">chevron_left</span>
              </button>
              <button className="h-9 w-9 bg-blue-900 text-white rounded-lg font-bold text-xs shadow-sm">1</button>
              <button className="h-9 w-9 hover:bg-white rounded-lg font-bold text-xs text-gray-500 transition-colors">2</button>
              <button className="h-9 w-9 hover:bg-white rounded-lg font-bold text-xs text-gray-500 transition-colors">3</button>
              <span className="px-2 text-gray-400 text-xs">...</span>
              <button className="h-9 w-9 hover:bg-white rounded-lg font-bold text-xs text-gray-500 transition-colors">9</button>
              <button className="p-2 border border-gray-200 rounded-lg hover:bg-white transition-colors text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined text-lg">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* AI Insights - 4 colonnes */}
        <div className="lg:col-span-4 space-y-6">
          {/* Insights Card */}
          <div className="bg-white p-6 rounded-xl shadow-[0_4px_20px_rgba(30,64,175,0.05)] border border-gray-100">
            <h3 className="text-lg font-bold text-blue-900 mb-6 font-serif flex items-center gap-2">
              <span className="material-symbols-outlined text-blue-800">lightbulb</span>
              AI Insights
            </h3>
            <div className="space-y-5">
              {insights.map((insight) => (
                <div key={insight.id} className="flex gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${insight.iconBg}`}>
                    <span className="material-symbols-outlined text-lg">{insight.icon}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-semibold text-gray-900 text-sm">{insight.title}</p>
                      <span className={`text-xs font-bold ${insight.metricColor}`}>{insight.metric}</span>
                    </div>
                    <p className="text-xs text-gray-400 leading-relaxed">{insight.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Model Performance */}
          <div className="bg-white p-6 rounded-xl shadow-[0_4px_20px_rgba(30,64,175,0.05)] border border-gray-100">
            <h3 className="text-lg font-bold text-blue-900 mb-6 font-serif">Model Performance</h3>
            <div className="space-y-5">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Prediction Accuracy</span>
                  <span className="text-sm font-bold text-blue-900">94.2%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-900 rounded-full" style={{ width: '94.2%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Response Time</span>
                  <span className="text-sm font-bold text-blue-900">1.2s</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full" style={{ width: '85%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">Data Coverage</span>
                  <span className="text-sm font-bold text-blue-900">98.7%</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '98.7%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-blue-900 text-white p-6 rounded-xl shadow-lg shadow-blue-900/20">
            <h3 className="text-lg font-bold font-serif mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all text-sm font-semibold">
                <span className="material-symbols-outlined">psychology</span>
                Run Predictive Analysis
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all text-sm font-semibold">
                <span className="material-symbols-outlined">warning</span>
                Identify At-Risk Students
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 rounded-lg hover:bg-white/20 transition-all text-sm font-semibold">
                <span className="material-symbols-outlined">menu_book</span>
                Analyze Curriculum Gaps
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Guidance Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* AI Ethics & Responsibility */}
        <div className="bg-blue-900 text-white p-8 rounded-xl flex items-start gap-6 shadow-lg shadow-blue-900/20">
          <span className="material-symbols-outlined text-4xl text-blue-300 flex-shrink-0">policy</span>
          <div>
            <h3 className="text-xl font-bold font-serif mb-2">AI Ethics & Responsibility</h3>
            <p className="text-sm text-blue-100 opacity-90 leading-relaxed">
              All AI-generated reports are reviewed by academic staff before intervention. Student privacy is protected under institutional data governance policies. Human oversight remains mandatory for all automated decisions.
            </p>
            <button className="mt-6 text-xs font-bold border-b border-white pb-1 hover:text-blue-200 transition-colors uppercase tracking-widest">
              Read AI Policy
            </button>
          </div>
        </div>

        {/* Model Information */}
        <div className="bg-white border border-dashed border-gray-300 p-8 rounded-xl flex items-start gap-6">
          <span className="material-symbols-outlined text-4xl text-blue-800 flex-shrink-0">info</span>
          <div>
            <h3 className="text-xl font-bold text-blue-900 font-serif mb-2">Model Information</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Current deployment: AI Model v4.2 (September 2024). Training data includes 5 years of institutional academic records. Models are retrained quarterly with faculty-validated outcomes. Confidence thresholds set at 85% minimum for automated interventions.
            </p>
            <div className="mt-4 flex gap-3">
              <span className="px-3 py-1 bg-blue-50 text-blue-800 text-xs font-bold rounded-full">v4.2 Active</span>
              <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-bold rounded-full">Operational</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="pt-8 border-t border-gray-100 text-center pb-4">
        <p className="text-xs text-gray-400">
          AI processing complies with GDPR and institutional data protection standards. 
          <a className="text-blue-900 hover:underline ml-1 font-semibold" href="#">View Compliance Report</a>
        </p>
      </footer>
    </div>
  );
}

export default AIReports;