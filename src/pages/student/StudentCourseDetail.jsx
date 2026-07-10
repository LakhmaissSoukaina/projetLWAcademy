// src/pages/student/StudentCourseDetail.jsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getCourseDetailsWithContent } from "../../api/studentApi";

const API_BASE_URL = 'http://localhost:8000';

export default function StudentCourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expandedChapter, setExpandedChapter] = useState(null);

  useEffect(() => {
    fetchCourseDetails();
  }, [id]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const data = await getCourseDetailsWithContent(id);
      setCourse(data);
      if (data.chapters && data.chapters.length > 0) {
        setExpandedChapter(data.chapters[0].id);
      }
    } catch (error) {
      console.error("Error loading course details:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleChapter = (chapterId) => {
    setExpandedChapter(expandedChapter === chapterId ? null : chapterId);
  };

  // ========== Fonction pour ouvrir le contenu ==========
  const openContent = (content) => {
    if (content.filePath) {
      // Construire l'URL complète vers le backend
      const fullUrl = `${API_BASE_URL}${content.filePath}`;
      window.open(fullUrl, '_blank');
    } else {
      alert('Ce contenu n\'a pas de fichier associé.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Cours non trouvé</p>
        <Link to="/student/courses" className="text-blue-600 hover:underline">Retour aux cours</Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <Link to="/student/courses" className="hover:text-blue-600">Mes cours</Link>
        <span className="text-gray-300">›</span>
        <span className="text-gray-900 font-medium">{course.title}</span>
      </nav>

      {/* En-tête du cours */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
        <p className="text-gray-600 mb-4">{course.description}</p>
        <div className="flex flex-wrap gap-4 text-sm">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
            {course.category}
          </span>
          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full">
            {course.level}
          </span>
          <span className="text-gray-500">
            Professeur: {course.professor}
          </span>
        </div>
      </div>

      {/* Chapitres et contenus */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Chapitres</h2>
        
        {course.chapters && course.chapters.length > 0 ? (
          course.chapters.map((chapter) => (
            <div key={chapter.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              {/* En-tête du chapitre */}
              <button
                onClick={() => toggleChapter(chapter.id)}
                className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                    Chapitre {chapter.number}
                  </span>
                  <span className="font-semibold text-gray-800">{chapter.title}</span>
                </div>
                <span className="material-symbols-outlined text-gray-400">
                  {expandedChapter === chapter.id ? 'expand_less' : 'expand_more'}
                </span>
              </button>

              {/* Contenu du chapitre */}
              {expandedChapter === chapter.id && (
                <div className="border-t border-gray-100 p-5 space-y-4">
                  {chapter.contents && chapter.contents.length > 0 ? (
                    chapter.contents.map((content) => (
                      <div key={content.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition">
                        <div className="flex items-start gap-4">
                          {/* Icône */}
                          <div className="flex-shrink-0">
                            {content.type === 'video' ? (
                              <span className="material-symbols-outlined text-3xl text-blue-600">
                                play_circle
                              </span>
                            ) : (
                              <span className="material-symbols-outlined text-3xl text-red-600">
                                description
                              </span>
                            )}
                          </div>
                          
                          {/* Informations */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-800">{content.title}</h3>
                            <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                              <span className="capitalize">{content.type}</span>
                              {content.duration && (
                                <span>• {content.duration}</span>
                              )}
                              {content.fileSize && (
                                <span>• {content.fileSize}</span>
                              )}
                              {content.filePath && (
                                <span className="text-xs text-gray-400 truncate max-w-[150px]">
                                  {content.filePath.split('/').pop()}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Bouton d'action avec onClick */}
                          <button 
                            onClick={() => openContent(content)}
                            className="flex-shrink-0 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition"
                          >
                            {content.type === 'video' ? '▶ Voir' : '📄 Lire'}
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-400 py-4">Aucun contenu dans ce chapitre</p>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400 py-8">Aucun chapitre disponible pour ce cours</p>
        )}
      </div>
    </div>
  );
}