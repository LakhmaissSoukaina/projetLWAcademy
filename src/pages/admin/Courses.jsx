// src/pages/admin/Courses.jsx
import { useState, useEffect } from "react";
import { getCourses, createCourse, updateCourse, deleteCourse } from "../../api/adminApi";

export default function Courses() {
  // États existants
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [showFilters, setShowFilters] = useState(false);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔍 Recherche globale (depuis la Navbar)
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");

  // Écouter l'événement personnalisé de la Navbar
  useEffect(() => {
    const handleSearch = (event) => {
      setGlobalSearchTerm(event.detail);
    };
    window.addEventListener("searchTermChange", handleSearch);
    return () => window.removeEventListener("searchTermChange", handleSearch);
  }, []);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const data = await getCourses();
      setCourses(data);
    } catch (error) {
      console.error("Error loading courses:", error);
      // Données mockées
      setCourses([
        {
          id: 1,
          title: "Advanced Quantum Mechanics",
          idCode: "CRSE-8829",
          type: "Course",
          typeIcon: "school",
          publisher: "Dr. Elena Vos",
          status: "Pending",
        },
        {
          id: 2,
          title: "Introduction to Macroeconomics L1",
          idCode: "VID-1022",
          type: "Video",
          typeIcon: "movie",
          publisher: "Marc Simon",
          status: "Published",
        },
        {
          id: 3,
          title: "Case Study: Global Logistics 2024",
          idCode: "DOC-4410",
          type: "PDF",
          typeIcon: "description",
          publisher: "Academic Board",
          status: "Flagged",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    const styles = {
      Pending: "bg-blue-50 text-blue-800 border-blue-100",
      Published: "bg-green-50 text-green-700 border-green-100",
      Flagged: "bg-orange-50 text-orange-700 border-orange-100",
      Draft: "bg-gray-50 text-gray-600 border-gray-100",
    };
    return styles[status] || "bg-gray-50 text-gray-600 border-gray-100";
  };

  const handleApprove = async (id) => {
    try {
      await updateCourse(id, { status: "Published" });
      fetchCourses();
    } catch (error) {
      console.error("Error approving course:", error);
    }
  };

  const handleFlag = async (id) => {
    try {
      await updateCourse(id, { status: "Flagged" });
      fetchCourses();
    } catch (error) {
      console.error("Error flagging course:", error);
    }
  };

  const handleDelete = async (id) => {
    if (confirm("Voulez-vous supprimer définitivement ce contenu ?")) {
      try {
        await deleteCourse(id);
        fetchCourses();
      } catch (error) {
        console.error("Error deleting course:", error);
      }
    }
  };

  // Filtrage : combine la recherche interne, les types, les statuts ET la recherche globale
  const filteredCourses = courses.filter(course => {
    // Filtres internes (recherche textuelle, type, statut)
    const matchesInternalSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  course.idCode?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === "All Types" || course.type === selectedType;
    const matchesStatus = selectedStatus === "All Status" || course.status === selectedStatus;
    
    // Filtre global (depuis la Navbar)
    const matchesGlobal = !globalSearchTerm.trim() || 
                          course.title.toLowerCase().includes(globalSearchTerm.toLowerCase()) ||
                          course.idCode?.toLowerCase().includes(globalSearchTerm.toLowerCase()) ||
                          course.publisher?.toLowerCase().includes(globalSearchTerm.toLowerCase());
    
    return matchesInternalSearch && matchesType && matchesStatus && matchesGlobal;
  });

  const stats = {
    pending: courses.filter(c => c.status === "Pending").length,
    published: courses.filter(c => c.status === "Published").length,
    flagged: courses.filter(c => c.status === "Flagged").length,
    total: courses.length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full max-w-full">
      {/* Header - avec indication du filtre global actif */}
      <div>
        <nav className="flex items-center gap-2 mb-4 text-xs text-gray-400">
          <span className="hover:text-blue-800 cursor-pointer font-medium">Admin</span>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
          <span className="text-blue-900 font-bold">Courses</span>
        </nav>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
          <div>
            <h2 className="text-3xl lg:text-4xl font-bold text-blue-900 font-serif">Content Supervision</h2>
            <p className="text-base text-gray-500 mt-2 max-w-xl">
              Review and moderate all educational assets across the platform.
            </p>
            {globalSearchTerm && (
              <div className="mt-3 inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm">
                <span className="material-symbols-outlined text-sm">search</span>
                Global filter: <strong>{globalSearchTerm}</strong>
                <button
                  onClick={() => setGlobalSearchTerm("")}
                  className="ml-1 hover:bg-blue-100 rounded-full p-0.5"
                >
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              </div>
            )}
          </div>
          <div className="flex gap-3">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="px-5 py-2.5 bg-white border border-gray-200 rounded-lg font-semibold text-sm text-blue-900 flex items-center gap-2 hover:bg-gray-50 transition-all"
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

      {/* Cartes statistiques (inchangées) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border-b-4 border-blue-900 hover:shadow-lg transition-all">
          <span className="text-xs text-gray-400 uppercase font-bold">Pending Review</span>
          <div className="text-4xl font-bold text-blue-900 font-serif mt-2">{stats.pending}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
          <span className="text-xs text-gray-400 uppercase font-bold">Published</span>
          <div className="text-4xl font-bold text-gray-900 font-serif mt-2">{stats.published}</div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
          <span className="text-xs text-gray-400 uppercase font-bold">Flagged Items</span>
          <div className="text-4xl font-bold text-red-600 font-serif mt-2">{stats.flagged}</div>
        </div>
        <div className="bg-blue-900 p-6 rounded-xl shadow-md text-white">
          <span className="text-xs text-white/70 uppercase font-bold">Total Content</span>
          <div className="text-4xl font-bold font-serif mt-2">{stats.total}</div>
        </div>
      </div>

      {/* Barre de filtres internes */}
      {showFilters && (
        <section className="bg-white p-6 rounded-xl shadow-md border border-gray-100 flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-[280px] relative">
            <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
              <span className="material-symbols-outlined text-lg">search</span>
            </span>
            <input 
              className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-lg focus:ring-2 focus:ring-blue-200 text-sm outline-none"
              placeholder="Search by title, ID or publisher..." 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="bg-gray-50 rounded-lg py-3 pl-4 pr-10 text-sm font-semibold text-gray-700 cursor-pointer outline-none"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option>All Types</option>
            <option>Course</option>
            <option>Video</option>
            <option>PDF</option>
          </select>
          <select 
            className="bg-gray-50 rounded-lg py-3 pl-4 pr-10 text-sm font-semibold text-gray-700 cursor-pointer outline-none"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
          >
            <option>All Status</option>
            <option>Published</option>
            <option>Pending</option>
            <option>Flagged</option>
          </select>
          <button className="p-3 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-lg">
            <span className="material-symbols-outlined">tune</span>
          </button>
        </section>
      )}

      {/* Tableau des cours filtré */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Content Asset</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Type</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Publisher</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-gray-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCourses.length > 0 ? (
                filteredCourses.map((course) => (
                  <tr key={course.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                          <span className="material-symbols-outlined text-blue-800">{course.typeIcon || "school"}</span>
                        </div>
                        <div>
                          <p className="font-bold text-blue-900 text-sm">{course.title}</p>
                          <p className="text-xs text-gray-400">ID: {course.idCode}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">{course.typeIcon || "school"}</span>
                        <span className="text-sm font-semibold">{course.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-gray-700">{course.publisher}</td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 text-[11px] font-bold rounded-full uppercase border ${getStatusStyle(course.status)}`}>
                        {course.status}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {course.status === "Published" ? (
                          <button disabled className="p-2 text-gray-400 cursor-not-allowed">
                            <span className="material-symbols-outlined text-green-600">check_circle</span>
                          </button>
                        ) : (
                          <button onClick={() => handleApprove(course.id)} className="p-2 hover:bg-blue-50 rounded-lg text-blue-800">
                            <span className="material-symbols-outlined">check_circle</span>
                          </button>
                        )}
                        <button onClick={() => handleFlag(course.id)} className={`p-2 rounded-lg ${course.status === "Flagged" ? "bg-orange-50 text-orange-600" : "hover:bg-gray-100 text-gray-500"}`}>
                          <span className="material-symbols-outlined">flag</span>
                        </button>
                        <button onClick={() => handleDelete(course.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500">
                          <span className="material-symbols-outlined">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-400">
                    <span className="material-symbols-outlined text-3xl">search_off</span>
                    <p className="mt-1">Aucun cours ne correspond aux critères.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination (simplifiée) */}
        <div className="p-5 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
          <p className="text-xs text-gray-400">
            Showing <span className="font-bold text-gray-900">{filteredCourses.length}</span> of <span className="font-bold text-gray-900">{stats.total}</span> entries
          </p>
          <div className="flex gap-2">
            <button className="p-2 border rounded-lg hover:bg-white">
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            <button className="h-9 w-9 bg-blue-900 text-white rounded-lg font-bold text-xs">1</button>
            <button className="p-2 border rounded-lg hover:bg-white">
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Actions & Content Health (inchangés) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-xl font-bold text-blue-900 mb-6">Recent Actions</h3>
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-blue-800">verified_user</span>
              </div>
              <div>
                <p className="text-sm">Admin approved <span className="font-bold text-blue-900">French Grammar Level 1</span></p>
                <p className="text-xs text-gray-400">2 minutes ago</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <span className="material-symbols-outlined text-red-600">report</span>
              </div>
              <div>
                <p className="text-sm">System flagged <span className="font-bold text-blue-900">Unlinked Video Asset #402</span></p>
                <p className="text-xs text-gray-400">15 minutes ago</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
          <h3 className="text-xl font-bold text-blue-900 mb-6">Content Health</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold">Verified Courses</span>
                <span className="text-sm font-bold text-blue-900">88%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-900 rounded-full" style={{ width: '88%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold">Video Metadata</span>
                <span className="text-sm font-bold text-blue-900">72%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: '72%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-semibold">PDF Accessibility</span>
                <span className="text-sm font-bold text-blue-900">95%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: '95%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAB */}
      <button className="fixed bottom-8 right-8 w-14 h-14 bg-blue-900 text-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-all z-40">
        <span className="material-symbols-outlined text-2xl">add</span>
      </button>
    </div>
  );
}