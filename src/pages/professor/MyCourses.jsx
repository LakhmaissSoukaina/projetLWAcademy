import { useState } from "react";
import { Link } from "react-router-dom";

function MyCourses() {
  const [activeStep, setActiveStep] = useState("general");
  
  // États du formulaire
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("Linguistic Sciences");
  const [duration, setDuration] = useState("");
  const [overview, setOverview] = useState("");
  
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

  // Simulation d'upload vidéo
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

  // Simulation d'upload PDF
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

  // ============================================================
  // RENDU CONDITIONNEL SELON L'ÉTAPE ACTIVE
  // ============================================================

  const renderGeneralInfo = () => (
    <div className="space-y-6">
      {/* Section 1: General Info */}
      <section className="bg-white p-8 rounded-xl shadow-[0_4px_20px_rgba(30,64,175,0.08)]">
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
              className="w-full border-0 border-b-2 border-gray-100 focus:ring-0 focus:border-blue-900 py-4 text-lg font-serif bg-transparent outline-none transition-all placeholder:text-gray-300"
              placeholder="e.g. Advanced Francophone Literature | الأدب الفرانكوفوني المتقدم"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-2">
              Primary Category
            </label>
            <select 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border-0 border-b-2 border-gray-100 focus:ring-0 focus:border-blue-900 py-4 bg-transparent outline-none transition-all appearance-none cursor-pointer"
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
              className="w-full border-0 border-b-2 border-gray-100 focus:ring-0 focus:border-blue-900 py-4 bg-transparent outline-none transition-all"
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
              className="w-full border-0 border-b-2 border-gray-100 focus:ring-0 focus:border-blue-900 py-4 bg-transparent outline-none transition-all resize-none"
              placeholder="A brief description of the learning outcomes and academic scope..."
            />
          </div>
        </div>
      </section>

      {/* Media Assets */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <section className="md:col-span-3 bg-white p-8 rounded-xl shadow-[0_4px_20px_rgba(30,64,175,0.08)] flex flex-col">
          <h2 className="text-xl font-bold text-blue-900 mb-6 font-serif">Course Thumbnail</h2>
          <div className="relative flex-grow min-h-[300px] border-2 border-dashed border-gray-200 rounded-xl overflow-hidden group hover:border-blue-900 transition-colors cursor-pointer bg-gray-50 flex flex-col items-center justify-center">
            <img 
              alt="Course Thumbnail" 
              className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-500"
              src="https://lh3.googleusercontent.com/aida/ADBb0ugN82B1x3CmEb_bs037GZqR9bkWVTkox0p4MnGP6223WAP1uoWvI_thYgvmS2Ik9RGj96qwECtPC_PQ4dKBKKof9hxMXTyO4v6rMp0qseA7chO7lWbitOuD3BEK8hoVxADTivkGSFQWYIwTbtK10R4O2LslgYXm_TKBTJ9H1GNkfyNcEPe5Ensrd0oHzl9h1YJdJvbyF_ctQ995iT0pKJVGXxZo3NSAJa8twx1hEHJdPexAZ_MMZCQQMj7p9AI-DjpuhzU6oU2K8w"
            />
            <div className="relative z-10 text-center p-6">
              <span className="material-symbols-outlined text-5xl text-blue-900 mb-4">add_a_photo</span>
              <p className="font-semibold text-blue-900">UPLOAD COVER IMAGE</p>
              <p className="text-xs text-gray-500 mt-2">Recommended: 1600x900px (JPG/PNG)</p>
            </div>
          </div>
        </section>

        <section className="md:col-span-2 bg-white p-8 rounded-xl shadow-[0_4px_20px_rgba(30,64,175,0.08)]">
          <h2 className="text-xl font-bold text-blue-900 mb-6 font-serif">Quick Summary</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-50 p-3 rounded-full flex-shrink-0">
                <span className="material-symbols-outlined text-blue-900">visibility</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Private Preview</p>
                <p className="text-xs text-gray-500">Only enrolled students can view full contents.</p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-blue-50 p-3 rounded-full flex-shrink-0">
                <span className="material-symbols-outlined text-blue-900">translate</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Bilingual Mode</p>
                <p className="text-xs text-gray-500">Course supports French and Arabic dual streams.</p>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">Professor Profile</p>
              <div className="flex items-center gap-3">
                <img 
                  alt="Professor" 
                  className="w-12 h-12 rounded-full object-cover"
                  src="https://lh3.googleusercontent.com/aida/ADBb0uh-gORIA9_i2XBTfcBGNH7GvGK61nvpvmamftY8UYejNeuJ-2gn1laSL1vEXhF7sdvLuNjY6Ao8oUTl9IRE6MhxfYT2pJH4XYXbSfGEsrOug-CNxULYOog7_nWuCzv64tq-a6oa4MgiBYoPMBgiwf2DlOau_PG8OJajScH80sbddx4qabkfJEDRk2dHvVy5ZE20y7duE3gTvaK9WrkaJUfQwjkusg1lP4OD2T-LWZjynbzUqBPF8VoDkQ5CmN3iGB6gv7Vt-3sIyA"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-900">Dr. Alexandre Mansour</p>
                  <p className="text-xs text-gray-500">Department Head, Humanities</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );

  const renderVideoUpload = () => (
    <div className="space-y-6">
      <section className="bg-white p-8 rounded-xl shadow-[0_4px_20px_rgba(30,64,175,0.08)]">
        <h2 className="text-xl font-bold text-blue-900 mb-6 font-serif flex items-center gap-3">
          <span className="material-symbols-outlined text-gray-500">video_library</span>
          Video Upload Center
        </h2>

        {/* Zone d'upload */}
        <div 
          onClick={handleVideoUpload}
          className="relative min-h-[250px] border-2 border-dashed border-gray-200 rounded-xl overflow-hidden group hover:border-blue-900 transition-colors cursor-pointer bg-gray-50 flex flex-col items-center justify-center mb-8"
        >
          {isUploading ? (
            <div className="text-center p-6 w-full max-w-md">
              <p className="text-sm font-semibold text-blue-900 mb-4">Uploading Lecture...</p>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-900 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
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

        {/* Liste des vidéos uploadées */}
        {uploadedVideos.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Uploaded Videos ({uploadedVideos.length})</h3>
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
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase">
                    {video.status}
                  </span>
                  <button className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors">
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );

  const renderPdfResources = () => (
    <div className="space-y-6">
      <section className="bg-white p-8 rounded-xl shadow-[0_4px_20px_rgba(30,64,175,0.08)]">
        <h2 className="text-xl font-bold text-blue-900 mb-6 font-serif flex items-center gap-3">
          <span className="material-symbols-outlined text-gray-500">picture_as_pdf</span>
          PDF Resources Library
        </h2>

        {/* Zone d'upload PDF */}
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

        {/* Liste des PDFs */}
        {uploadedPdfs.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Uploaded Documents ({uploadedPdfs.length})</h3>
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
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-bold uppercase">
                    {pdf.status}
                  </span>
                  <button className="p-2 hover:bg-blue-50 rounded-lg text-blue-900 transition-colors">
                    <span className="material-symbols-outlined text-sm">visibility</span>
                  </button>
                  <button className="p-2 hover:bg-red-50 rounded-lg text-red-500 transition-colors">
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Section Bibliothèque existante */}
        <div className="mt-8 pt-8 border-t border-gray-100">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Academic Templates</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: "Syllabus Template", icon: "article", color: "bg-blue-50 text-blue-900" },
              { name: "Assignment Sheet", icon: "assignment", color: "bg-amber-50 text-amber-700" },
              { name: "Grade Rubric", icon: "grading", color: "bg-emerald-50 text-emerald-700" }
            ].map((template) => (
              <div key={template.name} className="p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-blue-200 transition-all cursor-pointer">
                <div className={`w-10 h-10 ${template.color} rounded-lg flex items-center justify-center mb-3`}>
                  <span className="material-symbols-outlined">{template.icon}</span>
                </div>
                <p className="text-sm font-semibold text-gray-900">{template.name}</p>
                <p className="text-xs text-gray-500 mt-1">Click to use template</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );

  const renderChapterStructure = () => (
    <div className="space-y-6">
      <section className="bg-white p-8 rounded-xl shadow-[0_4px_20px_rgba(30,64,175,0.08)]">
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
              {/* Chapter Header */}
              <div 
                onClick={() => toggleChapter(chapter.id)}
                className={`flex items-center justify-between p-6 cursor-pointer ${
                  chapter.expanded ? 'bg-blue-50/30' : 'bg-white'
                }`}
              >
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined text-gray-400 cursor-grab">drag_indicator</span>
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

              {/* Chapter Contents */}
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
      </section>

      {/* Prévisualisation du cours */}
      <section className="bg-white p-8 rounded-xl shadow-[0_4px_20px_rgba(30,64,175,0.08)]">
        <h2 className="text-xl font-bold text-blue-900 mb-6 font-serif">Course Preview</h2>
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 bg-blue-50 rounded-lg flex items-center justify-center">
              <span className="material-symbols-outlined text-blue-900 text-2xl">school</span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900">{courseTitle || "Untitled Course"}</h3>
              <p className="text-xs text-gray-500">{category} • {duration || "Not set"}</p>
            </div>
          </div>
          <div className="flex gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">video_library</span>
              {uploadedVideos.length} Videos
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">picture_as_pdf</span>
              {uploadedPdfs.length} PDFs
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">account_tree</span>
              {chapters.length} Chapters
            </span>
          </div>
        </div>
      </section>
    </div>
  );

  // ============================================================
  // RENDU PRINCIPAL
  // ============================================================

  return (
    <div className="w-full max-w-full">
      <main className="max-w-7xl mx-auto px-6 py-12 mb-32">
        
        {/* Breadcrumbs & Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <nav className="flex items-center gap-2 text-xs text-gray-400 mb-2">
              <Link to="/professor" className="hover:text-blue-900 cursor-pointer transition-colors">Dashboard</Link>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
              <Link to="/professor/courses" className="hover:text-blue-900 cursor-pointer transition-colors">My Courses</Link>
              <span className="material-symbols-outlined text-sm">chevron_right</span>
              <span className="text-blue-900 font-bold">Create Course</span>
            </nav>
            <h1 className="text-3xl lg:text-4xl font-bold text-blue-900 font-serif">New Academic Course</h1>
            <p className="text-base text-gray-500 mt-2">
              Design a premium bilingual learning experience for your students.
            </p>
          </div>
          <button className="bg-blue-900 text-white px-8 py-4 rounded font-semibold text-sm shadow-[0_4px_20px_rgba(30,64,175,0.08)] hover:bg-blue-800 transition-all scale-95 active:scale-100 flex items-center gap-2 flex-shrink-0">
            <span className="material-symbols-outlined">publish</span>
            <span>Publish Course</span>
          </button>
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
                  Ensure all resources adhere to the W. Centre Academy bilingual standards and copyright regulations.
                </p>
              </div>
            </div>
          </div>

          {/* Main Content - RENDU CONDITIONNEL */}
          <div className="lg:col-span-9 space-y-6">
            {activeStep === "general" && renderGeneralInfo()}
            {activeStep === "videos" && renderVideoUpload()}
            {activeStep === "pdfs" && renderPdfResources()}
            {activeStep === "structure" && renderChapterStructure()}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto gap-6">
          <div className="text-center md:text-left">
            <div className="font-serif font-bold text-blue-900 text-lg mb-2">W. Centre Academy</div>
            <p className="font-serif text-xs leading-relaxed text-gray-500">
              © 2024 W. Centre Academy. Excellence in Bilingual Education.
            </p>
          </div>
          <div className="flex gap-8">
            <a href="#" className="font-serif text-xs text-gray-500 hover:text-blue-800 transition-opacity">Privacy Policy</a>
            <a href="#" className="font-serif text-xs text-gray-500 hover:text-blue-800 transition-opacity">Terms of Service</a>
            <a href="#" className="font-serif text-xs text-gray-500 hover:text-blue-800 transition-opacity">Faculty Portal</a>
            <a href="#" className="font-serif text-xs text-gray-500 hover:text-blue-800 transition-opacity">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MyCourses;