// frontend/src/api/professorApi.js
import api from "./axios";

// ============ DASHBOARD ============
export const getProfessorStats = async () => {
  const response = await api.get("/professor/stats");
  return response.data;
};

// ============ COURSES ============
export const getProfessorCourses = async () => {
  const response = await api.get("/professor/courses");
  return response.data;
};

export const getCourseDetails = async (courseId) => {
  const response = await api.get(`/professor/courses/${courseId}`);
  return response.data;
};

export const updateCourseProgress = async (courseId, data) => {
  const response = await api.put(`/professor/courses/${courseId}/progress`, data);
  return response.data;
};

export const createCourse = async (courseData) => {
  const response = await api.post("/professor/courses", courseData);
  return response.data;
};

export const updateCourse = async (courseId, courseData) => {
  const response = await api.put(`/professor/courses/${courseId}`, courseData);
  return response.data;
};

// ============ STUDENTS ============
export const getProfessorStudents = async () => {
  const response = await api.get("/professor/students");
  return response.data;
};

export const getStudentDetails = async (studentId) => {
  const response = await api.get(`/professor/students/${studentId}`);
  return response.data;
};

export const updateStudentGrade = async (studentId, courseId, grade) => {
  const response = await api.put(`/professor/students/${studentId}/grade`, { courseId, grade });
  return response.data;
};

// ============ QUIZZES ============
export const getProfessorQuizzes = async () => {
  const response = await api.get("/professor/quizzes");
  return response.data;
};

export const createQuiz = async (quizData) => {
  const response = await api.post("/professor/quizzes", quizData);
  return response.data;
};

export const updateQuiz = async (quizId, quizData) => {
  const response = await api.put(`/professor/quizzes/${quizId}`, quizData);
  return response.data;
};

export const deleteQuiz = async (quizId) => {
  const response = await api.delete(`/professor/quizzes/${quizId}`);
  return response.data;
};

export const getQuizResults = async (quizId) => {
  const response = await api.get(`/professor/quizzes/${quizId}/results`);
  return response.data;
};

// ============ TUTOR SESSIONS ============
export const getTutorSessions = async () => {
  const response = await api.get("/professor/tutor-sessions");
  return response.data;
};

export const scheduleTutorSession = async (sessionData) => {
  const response = await api.post("/professor/tutor-sessions", sessionData);
  return response.data;
};

export const updateTutorSession = async (sessionId, sessionData) => {
  const response = await api.put(`/professor/tutor-sessions/${sessionId}`, sessionData);
  return response.data;
};

// ============ ANALYTICS ============
export const getAnalytics = async () => {
  const response = await api.get("/professor/analytics");
  return response.data;
};

export const getCourseAnalytics = async (courseId) => {
  const response = await api.get(`/professor/analytics/courses/${courseId}`);
  return response.data;
};

// ============ AI REPORTS ============
export const getProfessorAIReports = async () => {
  const response = await api.get("/professor/ai-reports");
  return response.data;
};

export const generateAIReport = async (data) => {
  const response = await api.post("/professor/ai-reports/generate", data);
  return response.data;
};

// ============ FONCTIONS IA ============
export const generateClassReport = async () => {
  const response = await api.post("/ai/professor/class-report");
  return response.data;
};

export const generateIndividualStudentReport = async (studentId) => {
  const response = await api.post(`/ai/professor/student-report/${studentId}`);
  return response.data;
};

export const getAISuggestions = async () => {
  const response = await api.get("/ai/suggestions");
  return response.data;
};