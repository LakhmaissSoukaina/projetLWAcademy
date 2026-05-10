// src/pages/professor/QuizManager.jsx
import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { getProfessorQuizzes, createQuiz, updateQuiz, deleteQuiz, getQuizResults } from "../../api/professorApi";
import api from "../../api/axios";

export default function QuizManager() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [courses, setCourses] = useState([]);
  
  // Formulaire quiz
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [quizDuration, setQuizDuration] = useState(30);
  const [quizTotalPoints, setQuizTotalPoints] = useState(100);
  const [questions, setQuestions] = useState([]);
  const [saving, setSaving] = useState(false);

  // 🔍 Recherche globale (depuis la ProfessorNavbar)
  const [globalSearchTerm, setGlobalSearchTerm] = useState("");

  useEffect(() => {
    const handleSearch = (event) => {
      setGlobalSearchTerm(event.detail);
    };
    window.addEventListener("searchTermChange", handleSearch);
    return () => window.removeEventListener("searchTermChange", handleSearch);
  }, []);

  useEffect(() => {
    fetchQuizzes();
    fetchCourses();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const data = await getProfessorQuizzes();
      setQuizzes(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error loading quizzes:", error);
      setQuizzes([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const response = await api.get("/professor/courses");
      setCourses(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error loading courses:", error);
    }
  };

  const addQuestion = (type) => {
    const newId = Date.now();
    const newQuestion = {
      id: newId,
      text: "",
      type: type,
      points: type === "essay" ? 20 : 10,
      options: type === "multiple_choice" ? ["Option A", "Option B"] : null,
      correctAnswer: type === "multiple_choice" ? "Option A" : (type === "true_false" ? "Vrai" : null)
    };
    setQuestions([...questions, newQuestion]);
  };

  const updateQuestion = (id, field, value) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const updateOption = (questionId, optionIndex, value) => {
    setQuestions(questions.map(q => 
      q.id === questionId && q.options 
        ? { ...q, options: q.options.map((opt, idx) => idx === optionIndex ? value : opt) }
        : q
    ));
  };

  const addOption = (questionId) => {
    setQuestions(questions.map(q => 
      q.id === questionId && q.options 
        ? { ...q, options: [...q.options, `Option ${String.fromCharCode(65 + q.options.length)}`] }
        : q
    ));
  };

  const removeQuestion = (id) => {
    if (confirm("Supprimer cette question ?")) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  const calculateTotalPoints = () => {
    return questions.reduce((sum, q) => sum + (q.points || 0), 0);
  };

  const handleSaveDraft = async () => {
    if (!quizTitle.trim()) {
      alert("Veuillez entrer un titre pour le quiz");
      return;
    }

    setSaving(true);
    try {
      const quizData = {
        title: quizTitle,
        description: quizDescription,
        duration: quizDuration,
        totalPoints: calculateTotalPoints(),
        status: "draft",
        course: selectedCourseId || null,
        questions: questions.map(q => ({
          text: q.text,
          type: q.type,
          points: q.points,
          options: q.options,
          correctAnswer: q.correctAnswer
        }))
      };
      
      let response;
      if (selectedQuiz?.id) {
        response = await updateQuiz(selectedQuiz.id, quizData);
      } else {
        response = await createQuiz(quizData);
        setSelectedQuiz(response);
      }
      
      alert("Quiz sauvegardé en brouillon !");
      await fetchQuizzes();
      resetForm();
    } catch (error) {
      console.error("Error saving quiz:", error);
      alert("Erreur lors de la sauvegarde: " + (error.response?.data?.error || error.message));
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!quizTitle.trim()) {
      alert("Veuillez entrer un titre pour le quiz");
      return;
    }

    if (questions.length === 0) {
      alert("Ajoutez au moins une question avant de publier");
      return;
    }

    setSaving(true);
    try {
      const quizData = {
        title: quizTitle,
        description: quizDescription,
        duration: quizDuration,
        totalPoints: calculateTotalPoints(),
        status: "published",
        course: selectedCourseId || null,
        questions: questions.map(q => ({
          text: q.text,
          type: q.type,
          points: q.points,
          options: q.options,
          correctAnswer: q.correctAnswer
        }))
      };
      
      let response;
      if (selectedQuiz?.id) {
        response = await updateQuiz(selectedQuiz.id, quizData);
      } else {
        response = await createQuiz(quizData);
        setSelectedQuiz(response);
      }
      
      alert("Quiz publié avec succès !");
      await fetchQuizzes();
      resetForm();
    } catch (error) {
      console.error("Error publishing quiz:", error);
      alert("Erreur lors de la publication: " + (error.response?.data?.error || error.message));
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setQuizTitle("");
    setQuizDescription("");
    setQuizDuration(30);
    setQuizTotalPoints(100);
    setQuestions([]);
    setSelectedQuiz(null);
    setSelectedCourseId("");
  };

  const loadQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setQuizTitle(quiz.title);
    setQuizDescription(quiz.description || "");
    setQuizDuration(quiz.duration);
    setQuizTotalPoints(quiz.totalPoints);
    setSelectedCourseId(quiz.course?.id || "");
    setQuestions(quiz.questions?.map(q => ({
      id: q.id,
      text: q.text,
      type: q.type,
      points: q.points,
      options: q.options,
      correctAnswer: q.correctAnswer
    })) || []);
  };

  const deleteQuizHandler = async (quizId) => {
    if (confirm("Supprimer définitivement ce quiz ?")) {
      try {
        await deleteQuiz(quizId);
        await fetchQuizzes();
        if (selectedQuiz?.id === quizId) resetForm();
        alert("Quiz supprimé");
      } catch (error) {
        console.error("Error deleting quiz:", error);
        alert("Erreur lors de la suppression");
      }
    }
  };

  // 🔍 Filtrage des quizzes (titre, cours associé, statut)
  const filteredQuizzes = quizzes.filter(quiz => {
    if (!globalSearchTerm.trim()) return true;
    const term = globalSearchTerm.toLowerCase();
    return (
      (quiz.title && quiz.title.toLowerCase().includes(term)) ||
      (quiz.course?.title && quiz.course.title.toLowerCase().includes(term)) ||
      (quiz.status && quiz.status.toLowerCase().includes(term))
    );
  });

  const totalPoints = calculateTotalPoints();
  const estimatedDuration = Math.ceil(totalPoints / 2);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* HEADER */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm uppercase tracking-widest text-blue-700 font-semibold">
              Curriculum
            </p>
            <h1 className="text-3xl font-bold text-blue-900">
              {selectedQuiz ? `Modifier: ${quizTitle}` : "Nouveau Quiz"}
            </h1>
            {globalSearchTerm && (
              <div className="mt-2 inline-flex items-center gap-2 bg-blue-50 text-blue-800 px-3 py-1 rounded-full text-sm">
                <span className="material-symbols-outlined text-sm">search</span>
                Global: <strong>{globalSearchTerm}</strong>
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
              onClick={handleSaveDraft}
              disabled={saving}
              className="px-5 py-2 rounded-xl border border-slate-300 hover:bg-slate-100 transition disabled:opacity-50"
            >
              {saving ? "Sauvegarde..." : "Sauvegarder"}
            </button>
            <button 
              onClick={handlePublish}
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-blue-700 text-white hover:bg-blue-800 transition disabled:opacity-50"
            >
              Publier
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto p-6 grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* LEFT SIDE */}
        <div className="xl:col-span-8 space-y-6">
          {/* QUIZ SETTINGS */}
          <div className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-slate-500 mb-2">
                  Titre du Quiz
                </label>
                <input
                  type="text"
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  className="w-full border-b border-slate-300 bg-transparent py-3 text-xl font-semibold focus:outline-none focus:border-blue-700"
                  placeholder="Ex: Introduction à Symfony"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-500 mb-2">
                  Cours associé
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Aucun cours</option>
                  {courses.map(course => (
                    <option key={course.id} value={course.id}>{course.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-500 mb-2">
                  Durée (minutes)
                </label>
                <input
                  type="number"
                  value={quizDuration}
                  onChange={(e) => setQuizDuration(parseInt(e.target.value) || 30)}
                  className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                  min="5"
                  max="180"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-500 mb-2">
                  Points totaux
                </label>
                <input
                  type="number"
                  value={totalPoints}
                  disabled
                  className="w-full border rounded-xl p-3 bg-slate-50 text-slate-500"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-semibold text-slate-500 mb-2">
                Description
              </label>
              <textarea
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
                className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
                rows="3"
                placeholder="Décrivez le contenu du quiz..."
              />
            </div>
          </div>

          {/* QUESTIONS */}
          {questions.map((question, index) => (
            <div key={question.id} className="bg-white rounded-2xl shadow-sm p-8 border border-slate-100">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-blue-800 text-white flex items-center justify-center font-bold">
                    {index + 1}
                  </div>
                  <select
                    value={question.type}
                    onChange={(e) => updateQuestion(question.id, "type", e.target.value)}
                    className="px-4 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-bold uppercase border-none"
                  >
                    <option value="multiple_choice">Multiple Choice</option>
                    <option value="true_false">Vrai / Faux</option>
                    <option value="essay">Question ouverte</option>
                  </select>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-slate-500">Points</span>
                  <input
                    type="number"
                    value={question.points}
                    onChange={(e) => updateQuestion(question.id, "points", parseInt(e.target.value) || 0)}
                    className="w-16 text-center border-b border-slate-300 focus:outline-none focus:border-blue-700"
                    min="1"
                    max="100"
                  />
                  <button onClick={() => removeQuestion(question.id)} className="text-red-500 hover:text-red-700 transition">
                    ✕
                  </button>
                </div>
              </div>

              <textarea
                value={question.text}
                onChange={(e) => updateQuestion(question.id, "text", e.target.value)}
                className="w-full min-h-[80px] resize-none border border-slate-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-blue-600 mb-6"
                placeholder="Entrez votre question ici..."
              />

              {question.type === "multiple_choice" && (
                <div className="space-y-3">
                  {question.options?.map((option, optIndex) => (
                    <div key={optIndex} className="flex items-center gap-4">
                      <div 
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center cursor-pointer ${question.correctAnswer === option ? "border-blue-700" : "border-slate-300"}`}
                        onClick={() => updateQuestion(question.id, "correctAnswer", option)}
                      >
                        {question.correctAnswer === option && <div className="w-2.5 h-2.5 rounded-full bg-blue-700" />}
                      </div>
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                        className="flex-1 bg-slate-50 rounded-xl p-3 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"
                        placeholder={`Option ${String.fromCharCode(65 + optIndex)}`}
                      />
                    </div>
                  ))}
                  <button 
                    onClick={() => addOption(question.id)}
                    className="text-sm font-semibold text-blue-700 hover:text-blue-900"
                  >
                    + Ajouter une option
                  </button>
                </div>
              )}

              {question.type === "true_false" && (
                <div className="flex gap-4">
                  <button 
                    onClick={() => updateQuestion(question.id, "correctAnswer", "Vrai")}
                    className={`flex-1 py-3 rounded-xl border transition ${question.correctAnswer === "Vrai" ? "bg-blue-700 text-white border-blue-700" : "border-slate-300 hover:border-blue-700 hover:text-blue-700"}`}
                  >
                    Vrai
                  </button>
                  <button 
                    onClick={() => updateQuestion(question.id, "correctAnswer", "Faux")}
                    className={`flex-1 py-3 rounded-xl border transition ${question.correctAnswer === "Faux" ? "bg-blue-700 text-white border-blue-700" : "border-slate-300 hover:border-blue-700 hover:text-blue-700"}`}
                  >
                    Faux
                  </button>
                </div>
              )}

              {question.type === "essay" && (
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                  <p className="text-sm text-slate-500 italic">Question ouverte - l'étudiant fournira une réponse textuelle</p>
                </div>
              )}
            </div>
          ))}

          {/* ADD QUESTION */}
          <div className="bg-white rounded-2xl shadow-sm p-5 border border-slate-100 flex flex-wrap justify-center gap-4">
            <button onClick={() => addQuestion("multiple_choice")} className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 transition font-medium">
              + Multiple Choice
            </button>
            <button onClick={() => addQuestion("true_false")} className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 transition font-medium">
              + Vrai / Faux
            </button>
            <button onClick={() => addQuestion("essay")} className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 transition font-medium">
              + Question ouverte
            </button>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="xl:col-span-4">
          <div className="sticky top-24 space-y-6">
            {/* Quiz Preview */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="bg-blue-900 text-white p-6">
                <h2 className="text-xl font-bold">Aperçu</h2>
                <p className="text-sm text-blue-200 mt-1">Ce que verront les étudiants</p>
              </div>
              <div className="p-6 space-y-6">
                <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
                  <div className="flex justify-between items-center mb-6">
                    <div className="w-28 h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div className="w-1/4 h-full bg-blue-700"></div>
                    </div>
                    <span className="text-xs text-slate-500 font-semibold">{quizDuration}:00</span>
                  </div>
                  <h3 className="font-semibold text-slate-800 mb-4">
                    {questions[0]?.text || "Aucune question pour le moment"}
                  </h3>
                  {questions[0]?.type === "multiple_choice" && (
                    <div className="space-y-3">
                      {questions[0]?.options?.map((option, idx) => (
                        <div key={idx} className={`border rounded-xl p-3 text-sm bg-white border-slate-200`}>
                          {option || `Option ${String.fromCharCode(65 + idx)}`}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Questions</span>
                    <span className="font-bold text-blue-900">{questions.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Points totaux</span>
                    <span className="font-bold text-blue-900">{totalPoints}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Durée estimée</span>
                    <span className="font-bold text-blue-900">{estimatedDuration} min</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Liste des quizzes - FILTRÉE */}
            {quizzes.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4">
                <h3 className="font-semibold text-slate-800 mb-3">
                  Mes quizzes
                  {globalSearchTerm && filteredQuizzes.length !== quizzes.length && (
                    <span className="ml-2 text-xs font-normal text-slate-400">
                      ({filteredQuizzes.length} affichés sur {quizzes.length})
                    </span>
                  )}
                </h3>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {filteredQuizzes.map(quiz => (
                    <div key={quiz.id} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg">
                      <button onClick={() => loadQuiz(quiz)} className="text-left flex-1">
                        <p className="text-sm font-medium text-slate-700">{quiz.title}</p>
                        <p className="text-xs text-slate-400">Status: {quiz.status}</p>
                      </button>
                      <button onClick={() => deleteQuizHandler(quiz.id)} className="text-red-500 hover:text-red-700 p-1">
                        ✕
                      </button>
                    </div>
                  ))}
                  {filteredQuizzes.length === 0 && globalSearchTerm && (
                    <p className="text-sm text-slate-400 text-center py-2">
                      Aucun quiz ne correspond à "{globalSearchTerm}"
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}