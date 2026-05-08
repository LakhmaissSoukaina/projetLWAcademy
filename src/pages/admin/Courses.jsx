import { useState } from "react";

function Courses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [showFilters, setShowFilters] = useState(false);

  // Données des contenus éducatifs
  const contents = [
    {
      id: 1,
      title: "Advanced Quantum Mechanics",
      idCode: "CRSE-8829",
      type: "Course",
      typeIcon: "school",
      publisher: "Dr. Elena Vos",
      status: "Pending",
      statusColor: "bg-blue-50 text-blue-800 border-blue-100",
      thumbnail: "https://lh3.googleusercontent.com/aida/ADBb0uh-gORIA9_i2XBTfcBGNH7GvGK61nvpvmamftY8UYejNeuJ-2gn1laSL1vEXhF7sdvLuNjY6Ao8oUTl9IRE6MhxfYT2pJH4XYXbSfGEsrOug-CNxULYOog7_nWuCzv64tq-a6oa4MgiBYoPMBgiwf2DlOau_PG8OJajScH80sbddx4qabkfJEDRk2dHvVy5ZE20y7duE3gTvaK9WrkaJUfQwjkusg1lP4OD2T-LWZjynbzUqBPF8VoDkQ5CmN3iGB6gv7Vt-3sIyA",
      hasImage: true
    },
    {
      id: 2,
      title: "Introduction to Macroeconomics L1",
      idCode: "VID-1022",
      type: "Video",
      typeIcon: "movie",
      publisher: "Marc Simon",
      status: "Published",
      statusColor: "bg-green-50 text-green-700 border-green-100",
      hasImage: false,
      iconBg: "bg-blue-50"
    },
    {
      id: 3,
      title: "Case Study: Global Logistics 2024",
      idCode: "DOC-4410",
      type: "PDF",
      typeIcon: "description",
      publisher: "Academic Board",
      status: "Flagged",
      statusColor: "bg-orange-50 text-orange-700 border-orange-100",
      hasImage: false,
      iconBg: "bg-orange-50"
    },
    {
      id: 4,
      title: "French Grammar Level 1",
      idCode: "CRSE-1029",
      type: "Course",
      typeIcon: "school",
      publisher: "Prof. Marie Lefebvre",
      status: "Published",
      statusColor: "bg-green-50 text-green-700 border-green-100",
      hasImage: false,
      iconBg: "bg-blue-50"
    },
    {
      id: 5,
      title: "Data Structures & Algorithms",
      idCode: "VID-2045",
      type: "Video",
      typeIcon: "movie",
      publisher: "Dr. Ahmed Mansour",
      status: "Pending",
      statusColor: "bg-blue-50 text-blue-800 border-blue-100",
      hasImage: false,
      iconBg: "bg-purple-50"
    },
    {
      id: 6,
      title: "Academic Integrity Guidelines",
      idCode: "DOC-5501",
      type: "PDF",
      typeIcon: "description",
      publisher: "Academic Board",
      status: "Published",
      statusColor: "bg-green-50 text-green-700 border-green-100",
      hasImage: false,
      iconBg: "bg-emerald-50"
    }
  ];

  // Activités récentes
  const recentActions = [
    {
      id: 1,
      icon: "verified_user",
      iconBg: "bg-blue-50 text-blue-800",
      text: "Admin Sarah approved",
      highlight: "French Grammar Level 1",
      time: "2 minutes ago"
    },
    {
      id: 2,
      icon: "report",
      iconBg: "bg-red-50 text-red-600",
      text: "System automatically flagged",
      highlight: "Unlinked Video Asset #402",
      time: "15 minutes ago"
    },
    {
      id: 3,
      icon: "person_remove",
      iconBg: "bg-gray-100 text-gray-600",
      text: "Admin Marc removed",
      highlight: "Deprecated PDF Syllabus",
      time: "1 hour ago"
    },
    {
      id: 4,
      icon: "upload",
      iconBg: "bg-blue-50 text-blue-800",
      text: "Dr. Elena Vos uploaded",
      highlight: "Advanced Quantum Mechanics",
      time: "3 hours ago"
    }
  ];

  // Health metrics
  const healthMetrics = [
    { label: "Verified Courses", value: 88, color: "bg-blue-900" },
    { label: "Video Metadata", value: 72, color: "bg-blue-600" },
    { label: "PDF Accessibility", value: 95, color: "bg-emerald-500" }
  ];

  const getStatusStyle = (status) => {
    const styles = {
      Pending: "bg-blue-50 text-blue-800 border-blue-100",
      Published: "bg-green-50 text-green-700 border-green-100",
      Flagged: "bg-orange-50 text-orange-700 border-orange-100"
    };
    return styles[status] || "bg-gray-50 text-gray-600 border-gray-100";
  };

  const handleApprove = (id) => {
    console.log("Approve content:", id);
  };

  const handleFlag = (id) => {
    console.log("Flag content:", id);
  };

  const handleDelete = (id) => {
    console.log("Delete content:", id);
  };

  return (
    <div className="space-y-6 w-full max-w-full">
      {/* Breadcrumb & Header */}
      <div>
        <nav className="flex items-center gap-2 mb-4 text-xs text-gray-400">
          <span className="hover:text-blue-800 transition-colors cursor-pointer font-medium">Admin</span>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-blue-900 font-bold">Content</span>
        </nav>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-blue-900 font-serif">Content Supervision</h2>
            <p className="text-base text-gray-500 mt-2 max-w-xl">
              Review and moderate all educational assets across the platform. Maintain institutional standards through curated oversight.
            </p>
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="px-5 py-2.5 bg-white border border-gray-200 rounded-lg font-semibold text-sm text-blue-900 flex items-center gap-2 hover:bg-gray-50 transition-all shadow-sm"
            >
              <span className="material-symbols-outlined text-lg">filter_list</span>
              Filters
            </button>
            <button className="px-5 py-2.5 bg-blue-900 text-white rounded-lg font-semibold text-sm shadow-md hover:bg-blue-800 transition-all">
              Bulk Actions
            </button>
          </div>
        </div>
      </div>

      {/* Stats Overview - Bento Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-[0_4px_20px_rgba(30,64,175,0.05)] border-b-4 border-blue-900 hover:shadow-lg transition-all">
          <span className="text-xs text-gray-400 uppercase tracking-widest font-bold block mb-2">Pending Review</span>
          <div className="flex items-baseline gap-3">
            <span className="text-4xl font-bold text-blue-900 font-serif">24</span>
            <span className="text-sm font-bold text-red-500">+5 new</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-[0_4px_20px_rgba(30,64,175,0.05)] hover:shadow-lg transition-all">
          <span className="text-xs text-gray-400 uppercase tracking-widest font-bold block mb-2">Approved Today</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-gray-900 font-serif">142</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-[0_4px_20px_rgba(30,64,175,0.05)] hover:shadow-lg transition-all">
          <span className="text-xs text-gray-400 uppercase tracking-widest font-bold block mb-2">Flagged Items</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-red-600 font-serif">8</span>
          </div>
        </div>

        <div className="bg-blue-900 p-6 rounded-xl shadow-[0_4px_20px_rgba(30,64,175,0.05)] text-white hover:shadow-lg transition-all">
          <span className="text-xs text-white/70 uppercase tracking-widest font-bold block mb-2">Moderator Efficiency</span>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold font-serif">94%</span>
            <span className="material-symbols-outlined text-green-400 text-sm">trending_up</span>
          </div>
        </div>
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
              placeholder="Search content by title, ID or publisher..." 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3 flex-wrap">
            <div className="relative">
              <select 
                className="appearance-none bg-gray-50 border-none rounded-lg py-3 pl-4 pr-10 text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-blue-200 transition-all cursor-pointer outline-none"
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
              >
                <option>All Types</option>
                <option>Course</option>
                <option>Video</option>
                <option>PDF</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none material-symbols-outlined text-gray-400 text-sm">expand_more</span>
            </div>
            
            <div className="relative">
              <select 
                className="appearance-none bg-gray-50 border-none rounded-lg py-3 pl-4 pr-10 text-sm font-semibold text-gray-700 focus:ring-2 focus:ring-blue-200 transition-all cursor-pointer outline-none"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option>All Status</option>
                <option>Published</option>
                <option>Pending</option>
                <option>Flagged</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none material-symbols-outlined text-gray-400 text-sm">expand_more</span>
            </div>
            
            <button className="p-3 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-lg transition-colors">
              <span className="material-symbols-outlined">tune</span>
            </button>
          </div>
        </section>
      )}

      {/* Main Content Table */}
      <div className="bg-white rounded-xl shadow-[0_4px_20px_rgba(30,64,175,0.05)] border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Content Asset</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Publisher</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {contents.map((content) => (
                <tr key={content.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 border border-gray-100">
                        {content.hasImage ? (
                          <img 
                            alt={content.title} 
                            className="w-full h-full object-cover" 
                            src={content.thumbnail}
                          />
                        ) : (
                          <div className={`w-full h-full flex items-center justify-center ${content.iconBg || 'bg-blue-50'}`}>
                            <span className="material-symbols-outlined text-blue-800">{content.typeIcon}</span>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-blue-900 text-sm truncate">{content.title}</p>
                        <p className="text-xs text-gray-400 mt-0.5">ID: {content.idCode}</p>
                      </div>
                    </div>
                  </td>
                  
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 text-gray-500">
                      <span className="material-symbols-outlined text-lg">{content.typeIcon}</span>
                      <span className="text-sm font-semibold">{content.type}</span>
                    </div>
                  </td>
                  
                  <td className="px-6 py-5 text-sm text-gray-700 font-medium">
                    {content.publisher}
                  </td>
                  
                  <td className="px-6 py-5">
                    <span className={`px-3 py-1 text-[11px] font-bold rounded-full uppercase tracking-wider border ${getStatusStyle(content.status)}`}>
                      {content.status}
                    </span>
                  </td>
                  
                  <td className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {content.status === "Published" ? (
                        <button 
                          className="p-2 text-gray-400 cursor-not-allowed"
                          disabled
                          title="Already Approved"
                        >
                          <span className="material-symbols-outlined fill-1 text-green-600">check_circle</span>
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleApprove(content.id)}
                          className="p-2 hover:bg-blue-50 rounded-lg text-blue-800 transition-colors"
                          title="Approve"
                        >
                          <span className="material-symbols-outlined">check_circle</span>
                        </button>
                      )}
                      
                      <button 
                        onClick={() => handleFlag(content.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          content.status === "Flagged" 
                            ? "bg-orange-50 text-orange-600" 
                            : "hover:bg-gray-100 text-gray-500"
                        }`}
                        title={content.status === "Flagged" ? "Flagged" : "Flag"}
                      >
                        <span className="material-symbols-outlined" style={content.status === "Flagged" ? {fontVariationSettings: "'FILL' 1"} : {}}>flag</span>
                      </button>
                      
                      <button 
                        onClick={() => handleDelete(content.id)}
                        className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors"
                        title="Remove"
                      >
                        <span className="material-symbols-outlined">delete</span>
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
            Showing <span className="font-bold text-gray-900">1 to {contents.length}</span> of <span className="font-bold text-gray-900">1,240</span> entries
          </p>
          <div className="flex items-center gap-2">
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-white transition-colors text-gray-400 hover:text-gray-600">
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            <button className="h-9 w-9 bg-blue-900 text-white rounded-lg font-bold text-xs shadow-sm">1</button>
            <button className="h-9 w-9 hover:bg-white rounded-lg font-bold text-xs text-gray-500 transition-colors">2</button>
            <button className="h-9 w-9 hover:bg-white rounded-lg font-bold text-xs text-gray-500 transition-colors">3</button>
            <span className="px-2 text-gray-400 text-xs">...</span>
            <button className="h-9 w-9 hover:bg-white rounded-lg font-bold text-xs text-gray-500 transition-colors">124</button>
            <button className="p-2 border border-gray-200 rounded-lg hover:bg-white transition-colors text-gray-400 hover:text-gray-600">
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section - Recent Actions + Content Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Actions - 2 colonnes */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-[0_4px_20px_rgba(30,64,175,0.05)] border border-gray-100">
          <h3 className="text-xl font-bold text-blue-900 mb-6 font-serif">Recent Actions</h3>
          <div className="space-y-5">
            {recentActions.map((action) => (
              <div key={action.id} className="flex gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${action.iconBg}`}>
                  <span className="material-symbols-outlined text-lg">{action.icon}</span>
                </div>
                <div className="flex-1 border-b border-gray-50 pb-5 last:border-0 last:pb-0">
                  <p className="text-sm text-gray-700">
                    <span className="font-bold">{action.text}</span>{' '}
                    <span className="font-bold text-blue-900">{action.highlight}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-1">{action.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Health - 1 colonne */}
        <div className="bg-white p-6 rounded-xl shadow-[0_4px_20px_rgba(30,64,175,0.05)] border border-gray-100">
          <h3 className="text-xl font-bold text-blue-900 mb-6 font-serif">Content Health</h3>
          <div className="space-y-6">
            {healthMetrics.map((metric, index) => (
              <div key={index}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-semibold text-gray-700">{metric.label}</span>
                  <span className="text-sm font-bold text-blue-900">{metric.value}%</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${metric.color}`}
                    style={{ width: `${metric.value}%` }}
                  />
                </div>
              </div>
            ))}
            
            <div className="pt-4 border-t border-gray-100">
              <p className="text-xs text-gray-400 italic">
                "Maintaining 90%+ health ensures a premium student experience."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="pt-6 border-t border-gray-100 text-center pb-4">
        <p className="text-xs text-gray-400">
          All content moderation actions are logged for compliance. 
          <a className="text-blue-900 hover:underline ml-1 font-semibold" href="#">View Audit Trail</a>
        </p>
      </footer>

      {/* FAB for quick action */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-blue-900 text-white rounded-full shadow-lg shadow-blue-900/30 flex items-center justify-center hover:scale-110 hover:shadow-xl transition-all z-40">
        <span className="material-symbols-outlined text-2xl">add</span>
      </button>
    </div>
  );
}

export default Courses;