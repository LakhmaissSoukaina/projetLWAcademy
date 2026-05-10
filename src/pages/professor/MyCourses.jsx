// src/pages/professor/MyCourses.jsx
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { getProfessorCourses, createCourse, updateCourse } from "../../api/professorApi";
import api from "../../api/axios";

export default function MyCourses() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState("general");
  const [loading, setLoading] = useState(false);
  const [existingCourses, setExistingCourses] = useState([]);
  
  // 🔍 Recherche globale (depuis la ProfessorNavbar)
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");

  useEffect(() => {
    const handleSearch = (event) => {
      setGlobalSearchTerm(event.detail);
    };
    window.addEventListener("searchTermChange", handleSearch);
    return () => window.removeEventListener("searchTermChange", handleSearch);
  }, []);
  
  // États du formulaire
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("Linguistic Sciences");
  const [duration, setDuration] = useState("");
  const [overview, setOverview] = useState("");
  const [courseId, setCourseId] = useState(null);
  
  // États pour les uploads
  const [uploadedVideos, setUploadedVideos] = useState([]);
  const [uploadedPdfs, setUploadedPdfs] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  const [chapters, setChapters] = useState([
    {
      id: 1,
      number: "01",
      title: "Foundations of Modern Exchange",
      expanded: true,
      contents: [
        { id: 1, type: "video", title: "1.1 Introduction to Cross-Cultural Trade", duration: "15:30" },
        { id: 2, type: "pdf", title: "1.2 Historical Context PDF Resource", size: "2.4 MB" }
      ]
    },
    {
      id: 2,
      number: "02",
      title: "Bilingual Communication Strategies",
      expanded: false,
      contents: []
    }
  ]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await getProfessorCourses();
      setExistingCourses(data);
    } catch (error) {
      console.error("Error loading courses:", error);
    }
  };

  const steps = [
    { id: "general", icon: "info", label: "General Info" },
    { id: "videos", icon: "video_library", label: "Video Upload" },
    { id: "pdfs", icon: "picture_as_pdf", label: "PDF Resources" },
    { id: "structure", icon: "account_tree", label: "Chapter Structure" }
  ];

  const categories = [
    "Linguistic Sciences",
    "Historical Perspectives", 
    "Business & Trade",
    "Digital Humanities"
  ];

  const handleSaveGeneralInfo = async () => {
    if (!courseTitle) {
      alert("Veuillez entrer un titre de cours");
      return;
    }
    
    setLoading(true);
    try {
      const courseData = {
        title: courseTitle,
        category,
        duration,
        overview,
        professorId: user?.id
      };
      
      let response;
      if (courseId) {
        response = await updateCourse(courseId, courseData);
      } else {
        response = await createCourse(courseData);
        setCourseId(response.id);
      }
      
      alert("Informations générales sauvegardées !");
      setActiveStep("videos");
    } catch (error) {
      console.error("Error saving course:", error);
      alert("Erreur lors de la sauvegarde");
    } finally {
      setLoading(false);
    }
  };

  const handleVideoUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadedVideos(prev => [...prev, {
            id: Date.now(),
            name: `Lecture_${prev.length + 1}.mp4`,
            size: "245 MB",
            duration: "45:30",
            status: "Ready"
          }]);
          return 0;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handlePdfUpload = () => {
    setUploadedPdfs(prev => [...prev, {
      id: Date.now(),
      name: `Course_Material_${prev.length + 1}.pdf`,
      size: "3.2 MB",
      pages: 24,
      status: "Active"
    }]);
  };

  const toggleChapter = (id) => {
    setChapters(prev => prev.map(ch => 
      ch.id === id ? { ...ch, expanded: !ch.expanded } : ch
    ));
  };

  const addChapter = () => {
    const newNum = String(chapters.length + 1).padStart(2, '0');
    setChapters(prev => [...prev, {
      id: Date.now(),
      number: newNum,
      title: `New Chapter ${newNum}`,
      expanded: true,
      contents: []
    }]);
  };

  const removeChapter = (id) => {
    setChapters(prev => prev.filter(ch => ch.id !== id));
  };

  const handlePublish = async () => {
    if (!courseId && !courseTitle) {
      alert("Veuillez d'abord remplir les informations générales");
      setActiveStep("general");
      return;
    }
    
    setLoading(true);
    try {
      if (courseId) {
        await updateCourse(courseId, {
          chapters,
          videos: uploadedVideos,
          pdfs: uploadedPdfs,
          status: "published"
        });
      }
      alert("Cours publié avec succès !");
      navigate("/professor/courses");
    } catch (error) {
      console.error("Error publishing course:", error);
      alert("Erreur lors de la publication");
    } finally {
      setLoading(false);
    }
  };

  const renderGeneralInfo = () => (
    <div className="space-y-6">
      <section className="bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-blue-900 mb-6 font-serif flex items-center gap-3">
          <span className="material-symbols-outlined text-gray-500">edit_note</span>
          General Information
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
              Course Title (Bilingual Preferred)
            </label>
            <input 
              type="text"
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              className="w-full border-0 border-b-2 border-gray-100 focus:ring-0 focus:border-blue-900 py-4 text-lg font-serif bg-transparent outline-none"
              placeholder="e.g. Advanced Francophone Literature"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
              Primary Category
            </label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border-0 border-b-2 border-gray-100 focus:ring-0 focus:border-blue-900 py-4 bg-transparent outline-none"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
              Estimated Duration
            </label>
            <input 
              type="text"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
              className="w-full border-0 border-b-2 border-gray-100 focus:ring-0 focus:border-blue-900 py-4 bg-transparent outline-none"
              placeholder="e.g. 12 Weeks"
            />
          </div>

          <div className="md:col-span-2">
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
              Course Overview
            </label>
            <textarea 
              value={overview}
              onChange={(e) => setOverview(e.target.value)}
              rows={4}
              className="w-full border-0 border-b-2 border-gray-100 focus:ring-0 focus:border-blue-900 py-4 bg-transparent outline-none resize-none"
              placeholder="A brief description of the learning outcomes and academic scope..."
            />
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <button
            onClick={handleSaveGeneralInfo}
            disabled={loading}
            className="bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save & Continue →"}
          </button>
        </div>
      </section>
    </div>
  );

  const renderVideoUpload = () => (
    <div className="space-y-6">
      <section className="bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-blue-900 mb-6 font-serif flex items-center gap-3">
          <span className="material-symbols-outlined text-gray-500">video_library</span>
          Video Upload Center
        </h2>

        <div 
          onClick={handleVideoUpload}
          className="relative min-h-[250px] border-2 border-dashed border-gray-200 rounded-xl overflow-hidden group hover:border-blue-900 transition-colors cursor-pointer bg-gray-50 flex flex-col items-center justify-center mb-8"
        >
          {isUploading ? (
            <div className="text-center p-6 w-full max-w-md">
              <p className="text-sm font-semibold text-blue-900 mb-4">Uploading Lecture...</p>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-900 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
              </div>
              <p className="text-xs text-gray-500 mt-2">{uploadProgress}%</p>
            </div>
          ) : (
            <div className="text-center p-6">
              <span className="material-symbols-outlined text-5xl text-blue-900 mb-4">cloud_upload</span>
              <p className="font-semibold text-blue-900">CLICK TO UPLOAD VIDEO</p>
              <p className="text-xs text-gray-500 mt-2">MP4, MOV, AVI • Max 2GB per file</p>
            </div>
          )}
        </div>

        {uploadedVideos.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Uploaded Videos ({uploadedVideos.length})
            </h3>
            {uploadedVideos.map((video) => (
              <div key={video.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-blue-900">play_circle</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{video.name}</p>
                    <p className="text-xs text-gray-500">{video.size} • {video.duration}</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase">
                  {video.status}
                </span>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => setActiveStep("general")}
            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            ← Back
          </button>
          <button
            onClick={() => setActiveStep("pdfs")}
            className="bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
          >
            Continue →
          </button>
        </div>
      </section>
    </div>
  );

  const renderPdfResources = () => (
    <div className="space-y-6">
      <section className="bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-xl font-bold text-blue-900 mb-6 font-serif flex items-center gap-3">
          <span className="material-symbols-outlined text-gray-500">picture_as_pdf</span>
          PDF Resources Library
        </h2>

        <div 
          onClick={handlePdfUpload}
          className="relative min-h-[200px] border-2 border-dashed border-gray-200 rounded-xl overflow-hidden group hover:border-blue-900 transition-colors cursor-pointer bg-gray-50 flex flex-col items-center justify-center mb-8"
        >
          <div className="text-center p-6">
            <span className="material-symbols-outlined text-5xl text-blue-900 mb-4">upload_file</span>
            <p className="font-semibold text-blue-900">CLICK TO UPLOAD PDF</p>
            <p className="text-xs text-gray-500 mt-2">PDF • Max 50MB per file</p>
          </div>
        </div>

        {uploadedPdfs.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
              Uploaded Documents ({uploadedPdfs.length})
            </h3>
            {uploadedPdfs.map((pdf) => (
              <div key={pdf.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-50 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-red-600">description</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{pdf.name}</p>
                    <p className="text-xs text-gray-500">{pdf.size} • {pdf.pages} pages</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase">
                  {pdf.status}
                </span>
              </div>
            ))}
          </div>
        )}
        
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => setActiveStep("videos")}
            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            ← Back
          </button>
          <button
            onClick={() => setActiveStep("structure")}
            className="bg-blue-900 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
          >
            Continue →
          </button>
        </div>
      </section>
    </div>
  );

  const renderChapterStructure = () => (
    <div className="space-y-6">
      <section className="bg-white p-8 rounded-xl shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-blue-900 font-serif flex items-center gap-3">
            <span className="material-symbols-outlined text-gray-500">account_tree</span>
            Curriculum Builder
          </h2>
          <button 
            onClick={addChapter}
            className="text-blue-900 font-semibold text-sm flex items-center gap-2 hover:underline"
          >
            <span className="material-symbols-outlined">add_circle</span>
            Add New Chapter
          </button>
        </div>

        <div className="space-y-4">
          {chapters.map((chapter) => (
            <div 
              key={chapter.id}
              className={`border border-gray-100 rounded-xl overflow-hidden transition-all hover:border-blue-200 ${
                chapter.expanded ? 'border-blue-200' : ''
              }`}
            >
              <div 
                onClick={() => toggleChapter(chapter.id)}
                className={`flex items-center justify-between p-6 cursor-pointer ${
                  chapter.expanded ? 'bg-blue-50/30' : 'bg-white'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-gray-400">drag_indicator</span>
                  <div>
                    <span className={`text-xs font-bold uppercase tracking-wider ${
                      chapter.expanded ? 'text-blue-900' : 'text-gray-500'
                    }`}>
                      Chapter {chapter.number}
                    </span>
                    <h3 className={`font-semibold ${
                      chapter.expanded ? 'text-gray-900 text-lg' : 'text-gray-500'
                    }`}>
                      {chapter.title}
                    </h3>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {chapter.expanded && (
                    <>
                      <button 
                        onClick={(e) => { e.stopPropagation(); }}
                        className="material-symbols-outlined text-gray-500 hover:text-blue-900 transition-colors"
                      >
                        settings
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); removeChapter(chapter.id); }}
                        className="material-symbols-outlined text-gray-500 hover:text-red-600 transition-colors"
                      >
                        delete
                      </button>
                    </>
                  )}
                  <span className={`material-symbols-outlined ml-2 ${
                    chapter.expanded ? 'text-blue-900' : 'text-gray-300'
                  }`}>
                    {chapter.expanded ? 'expand_less' : 'expand_more'}
                  </span>
                </div>
              </div>

              {chapter.expanded && (
                <div className="p-6 space-y-3">
                  {chapter.contents.map((content) => (
                    <div 
                      key={content.id}
                      className="flex items-center justify-between p-4 bg-white border-l-2 border-blue-900 rounded-r-lg group hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-gray-500">
                          {content.type === 'video' ? 'play_circle' : 'description'}
                        </span>
                        <span className="text-sm text-gray-700">{content.title}</span>
                      </div>
                      <span className="text-xs text-gray-400">
                        {content.duration || content.size}
                      </span>
                    </div>
                  ))}
                  
                  <button className="w-full mt-4 py-3 border-2 border-dashed border-gray-100 rounded-lg text-gray-500 text-xs font-semibold uppercase tracking-wider hover:border-blue-900 hover:text-blue-900 transition-all flex items-center justify-center gap-2">
                    <span className="material-symbols-outlined">upload_file</span>
                    Add Content to This Chapter
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="mt-8 flex justify-between">
          <button
            onClick={() => setActiveStep("pdfs")}
            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            ← Back
          </button>
          <button
            onClick={handlePublish}
            disabled={loading}
            className="bg-green-700 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-800 transition disabled:opacity-50"
          >
            {loading ? "Publishing..." : "Publish Course →"}
          </button>
        </div>
      </section>
    </div>
  );

  return (
    <div className="w-full max-w-full">
      <main className="max-w-7xl mx-auto px-6 py-12 mb-32">
        
        {/* Breadcrumbs & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <nav className="flex items-center gap-2 text-xs text-gray-400 mb-2">
              <Link to="/professor" className="hover:text-blue-900 transition-colors">Dashboard</Link>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
              <span className="text-blue-900 font-bold">Create Course</span>
            </nav>
            <h1 className="text-3xl lg:text-4xl font-bold text-blue-900 font-serif">New Academic Course</h1>
            <p className="text-base text-gray-500 mt-2">
              Design a premium bilingual learning experience for your students.
            </p>
          </div>
          {/* Badge de recherche */}
          {globalSearchTerm && (
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm">
              <span className="material-symbols-outlined text-sm">search</span>
              Search: <strong>{globalSearchTerm}</strong>
              <button
                onClick={() => setGlobalSearchTerm("")}
                className="ml-1 hover:bg-blue-100 rounded-full p-0.5"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          )}
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Multi-step Navigation */}
          <div className="lg:col-span-3">
            <div className="sticky top-24 space-y-2">
              {steps.map((step) => (
                <div 
                  key={step.id}
                  onClick={() => setActiveStep(step.id)}
                  className={`flex items-center p-4 rounded-xl transition-all cursor-pointer ${
                    activeStep === step.id 
                      ? "bg-blue-50/50 border-l-4 border-blue-900 text-blue-900" 
                      : "text-gray-500 hover:bg-gray-50 hover:translate-x-1"
                  }`}
                >
                  <span className={`material-symbols-outlined mr-3 ${activeStep === step.id ? 'fill-1' : ''}`}>
                    {step.icon}
                  </span>
                  <span className="text-sm font-semibold">{step.label}</span>
                </div>
              ))}

              {/* Academic Integrity Notice */}
              <div className="mt-12 p-6 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-sm font-semibold text-blue-900 mb-2">Academic Integrity</p>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Ensure all resources adhere to the Academy bilingual standards and copyright regulations.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-9 space-y-6">
            {activeStep === "general" && renderGeneralInfo()}
            {activeStep === "videos" && renderVideoUpload()}
            {activeStep === "pdfs" && renderPdfResources()}
            {activeStep === "structure" && renderChapterStructure()}
          </div>
        </div>
      </main>
    </div>
  );
}