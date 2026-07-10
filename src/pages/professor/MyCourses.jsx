// src/pages/professor/MyCourses.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api/axios";
import { 
  getProfessorCourses, 
  createCourse, 
  updateCourse,
  deleteCourse,
  addChapter,
  updateChapter,
  deleteChapter,
  addContentToChapter,
  updateContent,
  deleteContent,
  getCourseWithContent
} from "../../api/professorApi";
import { 
  Pencil, 
  Trash2, 
  Plus, 
  Play, 
  FileText, 
  ChevronRight, 
  FolderTree,
  Video,
  File,
  BookOpen,
  Upload,
  X,
  Save,
  Edit,
  FolderOpen
} from "lucide-react";

export default function MyCourses() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [existingCourses, setExistingCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [chapters, setChapters] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  // États pour les modals
  const [showCreateCourse, setShowCreateCourse] = useState(false);
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseCategory, setNewCourseCategory] = useState('Programmation');
  const [newCourseLevel, setNewCourseLevel] = useState('Beginner');

  const [showChapterModal, setShowChapterModal] = useState(false);
  const [newChapterTitle, setNewChapterTitle] = useState('');

  const [showContentModal, setShowContentModal] = useState(false);
  const [contentType, setContentType] = useState('video');
  const [selectedChapterForContent, setSelectedChapterForContent] = useState('');
  const [contentFile, setContentFile] = useState(null);
  const [contentTitle, setContentTitle] = useState('');

  // États pour la modification
  const [editingCourse, setEditingCourse] = useState(null);
  const [editingChapter, setEditingChapter] = useState(null);
  const [editingContent, setEditingContent] = useState(null);

  const categories = ["Programmation", "Base de données", "DevOps", "Design", "Littérature", "Mathématiques", "Physique", "Sciences sociales"];
  const levels = ["Beginner", "Intermediate", "Advanced"];

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await getProfessorCourses();
      setExistingCourses(data);
      if (data.length > 0) {
        setSelectedCourseId(data[0].id);
        loadCourseChapters(data[0].id);
      }
    } catch (error) {
      console.error("Error loading courses:", error);
    }
  };

  const loadCourseChapters = async (courseId) => {
    if (!courseId) return;
    setLoading(true);
    try {
      const data = await getCourseWithContent(courseId);
      if (data.chapters && data.chapters.length > 0) {
        setChapters(data.chapters.map((ch, index) => ({
          id: ch.id,
          number: index + 1,
          title: ch.title,
          contents: ch.contents && ch.contents.length > 0 ? ch.contents.map(c => ({
            id: c.id,
            type: c.type,
            title: c.title,
            duration: c.duration,
            size: c.fileSize,
            filePath: c.filePath
          })) : []
        })));
      } else {
        setChapters([]);
      }
    } catch (error) {
      console.error("Error loading chapters:", error);
    } finally {
      setLoading(false);
    }
  };

  // ========== CRUD COURS ==========
  const handleCreateCourse = async () => {
    if (!newCourseTitle.trim()) {
      alert("Veuillez entrer un titre pour le cours");
      return;
    }
    setLoading(true);
    try {
      await createCourse({
        title: newCourseTitle,
        category: newCourseCategory,
        level: newCourseLevel,
        status: 'published'
      });
      alert("Cours créé avec succès !");
      setShowCreateCourse(false);
      setNewCourseTitle('');
      await fetchCourses();
    } catch (error) {
      console.error("Error creating course:", error);
      alert("Erreur lors de la création du cours");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCourse = async () => {
    if (!editingCourse) return;
    setLoading(true);
    try {
      await updateCourse(editingCourse.id, {
        title: editingCourse.title,
        category: editingCourse.category,
        level: editingCourse.level
      });
      alert("Cours modifié avec succès !");
      setEditingCourse(null);
      await fetchCourses();
    } catch (error) {
      console.error("Error updating course:", error);
      alert("Erreur lors de la modification du cours");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!confirm("Voulez-vous vraiment supprimer ce cours ?")) return;
    setLoading(true);
    try {
      await deleteCourse(courseId);
      alert("Cours supprimé avec succès !");
      if (selectedCourseId === courseId) {
        setSelectedCourseId('');
        setChapters([]);
      }
      await fetchCourses();
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Erreur lors de la suppression du cours");
    } finally {
      setLoading(false);
    }
  };

  // ========== CRUD CHAPITRE ==========
  const handleCreateChapter = async () => {
    if (!selectedCourseId) {
      alert("Veuillez d'abord sélectionner un cours");
      return;
    }
    if (!newChapterTitle.trim()) {
      alert("Veuillez entrer un titre pour le chapitre");
      return;
    }
    setLoading(true);
    try {
      await addChapter(selectedCourseId, { title: newChapterTitle });
      alert("Chapitre ajouté avec succès !");
      setShowChapterModal(false);
      setNewChapterTitle('');
      await loadCourseChapters(selectedCourseId);
      setRefreshKey(prev => prev + 1);
    } catch (error) {
      console.error("Error adding chapter:", error);
      alert("Erreur lors de l'ajout du chapitre");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateChapter = async () => {
    if (!editingChapter || !selectedCourseId) return;
    setLoading(true);
    try {
      await updateChapter(selectedCourseId, editingChapter.id, {
        title: editingChapter.title
      });
      alert("Chapitre modifié avec succès !");
      setEditingChapter(null);
      await loadCourseChapters(selectedCourseId);
    } catch (error) {
      console.error("Error updating chapter:", error);
      alert("Erreur lors de la modification du chapitre");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteChapter = async (chapterId) => {
    if (!confirm("Voulez-vous vraiment supprimer ce chapitre ?")) return;
    setLoading(true);
    try {
      await deleteChapter(selectedCourseId, chapterId);
      alert("Chapitre supprimé avec succès !");
      await loadCourseChapters(selectedCourseId);
    } catch (error) {
      console.error("Error deleting chapter:", error);
      alert("Erreur lors de la suppression du chapitre");
    } finally {
      setLoading(false);
    }
  };

  // ========== CRUD CONTENU ==========
  const handleContentSubmit = async () => {
    if (!selectedCourseId || !selectedChapterForContent || !contentFile || !contentTitle.trim()) {
      alert("Veuillez remplir tous les champs");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('chapterId', parseInt(selectedChapterForContent));
      formData.append('title', contentTitle);
      formData.append('type', contentType);
      formData.append('file', contentFile);
      if (contentType === 'video') {
        formData.append('duration', '45:30');
      }

      const response = await api.post(`/courses/${selectedCourseId}/add-content`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log("✅ SUCCESS! Response:", response);
      alert(`${contentType === 'video' ? 'Vidéo' : 'PDF'} ajouté avec succès !`);
      setShowContentModal(false);
      setContentFile(null);
      setContentTitle('');
      setSelectedChapterForContent('');
      await loadCourseChapters(selectedCourseId);
      setRefreshKey(prev => prev + 1);
      
    } catch (error) {
      console.error("❌ Error:", error);
      alert("Erreur lors de l'ajout du contenu: " + (error.response?.data?.error || error.message));
    } finally {
      setUploading(false);
    }
  };

  // 🔥 VERSION MODIFIÉE AVEC LA KASTUCE
  const handleUpdateContent = async () => {
    if (!editingContent || !selectedCourseId) return;
    
    console.log("📤 Updating content:", {
      courseId: selectedCourseId,
      contentId: editingContent.id,
      data: { title: editingContent.title, type: editingContent.type }
    });
    
    setLoading(true);
    try {
      const response = await updateContent(selectedCourseId, editingContent.id, {
        title: editingContent.title,
        type: editingContent.type
      });
      
      console.log("✅ Update response:", response);
      alert("Contenu modifié avec succès !");
      setEditingContent(null);
      await loadCourseChapters(selectedCourseId);
      setRefreshKey(prev => prev + 1);
      
    } catch (error) {
      console.error("❌ Error updating content:", error);
      console.error("❌ Response:", error.response);
      
      // 🔥 KASTUCE : Même en cas d'erreur, recharge les chapitres
      await loadCourseChapters(selectedCourseId);
      
      // Vérifier si la modification a quand même été appliquée
      const errorMessage = error.response?.data?.error || error.message || "Erreur inconnue";
      alert("Erreur lors de la modification: " + errorMessage + "\n\n💡 La modification a peut-être été appliquée. Vérifiez en rafraîchissant.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContent = async (contentId) => {
    if (!confirm("Voulez-vous vraiment supprimer ce contenu ?")) return;
    setLoading(true);
    try {
      await deleteContent(selectedCourseId, contentId);
      alert("Contenu supprimé avec succès !");
      await loadCourseChapters(selectedCourseId);
    } catch (error) {
      console.error("Error deleting content:", error);
      alert("Erreur lors de la suppression du contenu");
    } finally {
      setLoading(false);
    }
  };

  // ========== RENDER ==========
  return (
    <div className="w-full max-w-full" key={refreshKey}>
      <main className="max-w-7xl mx-auto px-6 py-12 mb-32">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 space-y-4 md:space-y-0">
          <div>
            <nav className="flex items-center gap-2 text-xs text-gray-400 mb-2">
              <Link to="/professor" className="hover:text-blue-900 transition-colors">Dashboard</Link>
              <ChevronRight size={16} className="text-gray-300" />
              <span className="text-blue-900 font-bold">My Courses</span>
            </nav>
            <h1 className="text-3xl lg:text-4xl font-bold text-blue-900 font-serif">Gérer mes cours</h1>
            <p className="text-base text-gray-500 mt-2">Ajoutez, modifiez et supprimez vos cours, chapitres et contenus.</p>
          </div>
          <button onClick={() => setShowCreateCourse(true)} className="bg-blue-700 hover:bg-blue-800 transition-all text-white px-6 py-3 rounded-xl flex items-center gap-2 font-semibold shadow-lg">
            <Plus size={20} />
            Nouveau cours
          </button>
        </div>

        {/* Sélection du cours */}
        <div className="bg-white p-6 rounded-xl shadow-md mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-semibold text-gray-700 mb-2">Sélectionner un cours</label>
              <div className="flex gap-2">
                <select 
                  className="flex-1 p-3 border rounded-lg bg-white focus:ring-2 focus:ring-blue-500"
                  value={selectedCourseId || ''}
                  onChange={(e) => {
                    setSelectedCourseId(e.target.value);
                    loadCourseChapters(e.target.value);
                  }}
                >
                  <option value="">-- Sélectionner un cours --</option>
                  {existingCourses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
                {selectedCourseId && (
                  <>
                    <button
                      onClick={() => {
                        const course = existingCourses.find(c => c.id === parseInt(selectedCourseId));
                        setEditingCourse({...course});
                      }}
                      className="px-4 py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(selectedCourseId)}
                      className="px-4 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
                    >
                      <Trash2 size={18} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Actions rapides */}
        {selectedCourseId && (
          <div className="flex flex-wrap gap-4 mb-6">
            <button onClick={() => setShowChapterModal(true)} className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center gap-2">
              <Plus size={18} /> Ajouter un chapitre
            </button>
            <button onClick={() => {
              if (chapters.length === 0) {
                alert("Veuillez d'abord créer un chapitre.");
                return;
              }
              setContentType('video');
              setContentFile(null);
              setContentTitle('');
              setSelectedChapterForContent('');
              setShowContentModal(true);
            }} className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2">
              <Video size={18} /> Ajouter une vidéo
            </button>
            <button onClick={() => {
              if (chapters.length === 0) {
                alert("Veuillez d'abord créer un chapitre.");
                return;
              }
              setContentType('pdf');
              setContentFile(null);
              setContentTitle('');
              setSelectedChapterForContent('');
              setShowContentModal(true);
            }} className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition flex items-center gap-2">
              <File size={18} /> Ajouter un PDF
            </button>
          </div>
        )}

        {/* Liste des chapitres */}
        {selectedCourseId && (
          <div className="bg-white p-6 rounded-xl shadow-md">
            <h2 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
              <FolderTree size={22} />
              Chapitres et contenus
            </h2>

            {loading ? (
              <div className="text-center py-8"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-800 mx-auto"></div></div>
            ) : chapters.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p className="mb-4">Aucun chapitre pour ce cours.</p>
                <button onClick={() => setShowChapterModal(true)} className="text-blue-600 font-semibold hover:underline">+ Créer votre premier chapitre</button>
              </div>
            ) : (
              <div className="space-y-4">
                {chapters.map((chapter) => (
                  <div key={chapter.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-50 p-4 font-semibold text-gray-800 flex items-center justify-between">
                      <div>
                        <span className="text-xs text-gray-500 uppercase">Chapitre {chapter.number}</span>
                        <span className="ml-3">{chapter.title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-400">{chapter.contents ? chapter.contents.length : 0} contenu(s)</span>
                        <button
                          onClick={() => setEditingChapter({id: chapter.id, title: chapter.title})}
                          className="px-3 py-1 bg-yellow-500 text-white rounded-lg text-sm hover:bg-yellow-600 transition"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteChapter(chapter.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded-lg text-sm hover:bg-red-700 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-4 space-y-2">
                      {!chapter.contents || chapter.contents.length === 0 ? (
                        <p className="text-sm text-gray-400 text-center py-2">Aucun contenu dans ce chapitre</p>
                      ) : (
                        chapter.contents.map((content) => (
                          <div key={content.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                            <div className="flex items-center gap-3">
                              {content.type === 'video' ? (
                                <Play size={18} className="text-blue-600" />
                              ) : (
                                <FileText size={18} className="text-red-600" />
                              )}
                              <span className="text-sm text-gray-700">{content.title}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-400">{content.duration || content.size}</span>
                              <button
                                onClick={() => setEditingContent({id: content.id, title: content.title, type: content.type})}
                                className="px-2 py-1 bg-yellow-500 text-white rounded-lg text-xs hover:bg-yellow-600 transition"
                              >
                                <Pencil size={12} />
                              </button>
                              <button
                                onClick={() => handleDeleteContent(content.id)}
                                className="px-2 py-1 bg-red-600 text-white rounded-lg text-xs hover:bg-red-700 transition"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ===== MODALS (inchangés) ===== */}
        {/* MODAL CRÉATION COURS */}
        {showCreateCourse && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                <BookOpen size={20} /> Créer un nouveau cours
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Titre du cours</label>
                  <input
                    type="text"
                    value={newCourseTitle}
                    onChange={(e) => setNewCourseTitle(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: Introduction à Symfony"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Catégorie</label>
                  <select
                    value={newCourseCategory}
                    onChange={(e) => setNewCourseCategory(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Niveau</label>
                  <select
                    value={newCourseLevel}
                    onChange={(e) => setNewCourseLevel(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {levels.map(level => <option key={level} value={level}>{level}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowCreateCourse(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-1">
                  <X size={16} /> Annuler
                </button>
                <button onClick={handleCreateCourse} disabled={loading} className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition disabled:opacity-50 flex items-center gap-1">
                  <Save size={16} /> {loading ? "Création..." : "Créer"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL CRÉATION CHAPITRE */}
        {showChapterModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                <FolderOpen size={20} /> Créer un nouveau chapitre
              </h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Titre du chapitre</label>
                <input
                  type="text"
                  value={newChapterTitle}
                  onChange={(e) => setNewChapterTitle(e.target.value)}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: Introduction, Concepts avancés..."
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowChapterModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-1">
                  <X size={16} /> Annuler
                </button>
                <button onClick={handleCreateChapter} disabled={loading} className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition disabled:opacity-50 flex items-center gap-1">
                  <Save size={16} /> {loading ? "Création..." : "Créer"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL AJOUT CONTENU */}
        {showContentModal && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6">
              <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                {contentType === 'video' ? <Video size={20} /> : <File size={20} />}
                Ajouter {contentType === 'video' ? 'une vidéo' : 'un PDF'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Titre</label>
                  <input
                    type="text"
                    value={contentTitle}
                    onChange={(e) => setContentTitle(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Titre du contenu"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Choisir le chapitre</label>
                  <select
                    value={selectedChapterForContent}
                    onChange={(e) => setSelectedChapterForContent(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Sélectionner un chapitre --</option>
                    {chapters.map(ch => (
                      <option key={ch.id} value={ch.id}>Chapitre {ch.number}: {ch.title}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Fichier {contentType === 'video' ? 'vidéo' : 'PDF'}</label>
                  <input
                    type="file"
                    accept={contentType === 'video' ? 'video/*' : '.pdf'}
                    onChange={(e) => setContentFile(e.target.files[0])}
                    className="w-full p-2 border rounded-lg"
                  />
                  {contentFile && <p className="text-sm text-green-600 mt-1 flex items-center gap-1"><Upload size={14} /> Fichier sélectionné: {contentFile.name}</p>}
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setShowContentModal(false)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-1">
                  <X size={16} /> Annuler
                </button>
                <button onClick={handleContentSubmit} disabled={uploading} className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition disabled:opacity-50 flex items-center gap-1">
                  <Upload size={16} /> {uploading ? "Upload..." : "Ajouter"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL MODIFIER COURS */}
        {editingCourse && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                <Edit size={20} /> Modifier le cours
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Titre</label>
                  <input
                    type="text"
                    value={editingCourse.title || ''}
                    onChange={(e) => setEditingCourse({...editingCourse, title: e.target.value})}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Catégorie</label>
                  <select
                    value={editingCourse.category || ''}
                    onChange={(e) => setEditingCourse({...editingCourse, category: e.target.value})}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Niveau</label>
                  <select
                    value={editingCourse.level || ''}
                    onChange={(e) => setEditingCourse({...editingCourse, level: e.target.value})}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {levels.map(level => <option key={level} value={level}>{level}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setEditingCourse(null)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-1">
                  <X size={16} /> Annuler
                </button>
                <button onClick={handleUpdateCourse} className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition flex items-center gap-1">
                  <Save size={16} /> Enregistrer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL MODIFIER CHAPITRE */}
        {editingChapter && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                <Edit size={20} /> Modifier le chapitre
              </h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Titre</label>
                <input
                  type="text"
                  value={editingChapter.title || ''}
                  onChange={(e) => setEditingChapter({...editingChapter, title: e.target.value})}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setEditingChapter(null)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-1">
                  <X size={16} /> Annuler
                </button>
                <button onClick={handleUpdateChapter} className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition flex items-center gap-1">
                  <Save size={16} /> Enregistrer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL MODIFIER CONTENU */}
        {editingContent && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-blue-900 mb-4 flex items-center gap-2">
                <Edit size={20} /> Modifier le contenu
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Titre</label>
                  <input
                    type="text"
                    value={editingContent.title || ''}
                    onChange={(e) => setEditingContent({...editingContent, title: e.target.value})}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Type</label>
                  <select
                    value={editingContent.type || 'video'}
                    onChange={(e) => setEditingContent({...editingContent, type: e.target.value})}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="video">Vidéo</option>
                    <option value="pdf">PDF</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button onClick={() => setEditingContent(null)} className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition flex items-center gap-1">
                  <X size={16} /> Annuler
                </button>
                <button onClick={handleUpdateContent} className="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition flex items-center gap-1">
                  <Save size={16} /> Enregistrer
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}