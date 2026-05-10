// frontend/src/api/studentApi.js
import api from "./axios";

// ============ DASHBOARD ============
export const getStudentStats = async () => {
  const response = await api.get("/student/stats");
  return response.data;
};

// ============ COURSES ============
export const getStudentCourses = async () => {
  const response = await api.get("/student/courses");
  return response.data;
};

export const getCourseDetails = async (courseId) => {
  const response = await api.get(`/student/courses/${courseId}`);
  return response.data;
};

// ============ TUTORS ============
export const getAvailableTutors = async () => {
  const response = await api.get("/student/tutors");
  return response.data;
};

export const getActiveTutors = async () => {
  const response = await api.get("/student/tutors/active");
  return response.data;
};

export const requestTutorSession = async (tutorId, data) => {
  const response = await api.post(`/student/tutors/${tutorId}/request`, data);
  return response.data;
};

// ============ SESSIONS ============
export const getUpcomingSessions = async () => {
  const response = await api.get("/student/sessions/upcoming");
  return response.data;
};

export const getSessionHistory = async () => {
  const response = await api.get("/student/sessions/history");
  return response.data;
};

// ============ QUIZZES ============
export const getStudentQuizzes = async () => {
  const response = await api.get("/student/quizzes");
  return response.data;
};

export const getQuizDetails = async (quizId) => {
  const response = await api.get(`/student/quizzes/${quizId}`);
  return response.data;
};

export const submitQuiz = async (quizId, answers) => {
  const response = await api.post(`/student/quizzes/${quizId}/submit`, { answers });
  return response.data;
};

// ============ ASSIGNMENTS ============
export const getStudentAssignments = async () => {
  const response = await api.get("/student/assignments");
  return response.data;
};

export const getAssignmentDetails = async (assignmentId) => {
  const response = await api.get(`/student/assignments/${assignmentId}`);
  return response.data;
};

export const submitAssignment = async (assignmentId, formData) => {
  const response = await api.post(`/student/assignments/${assignmentId}/submit`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};

// ============ REPORTS ============
export const getStudentReports = async () => {
  const response = await api.get("/student/reports");
  return response.data;
};

export const getReportDetails = async (reportId) => {
  const response = await api.get(`/student/reports/${reportId}`);
  return response.data;
};