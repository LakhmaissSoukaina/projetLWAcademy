// frontend/src/api/adminApi.js
import api from "./axios";

// ============ USERS ============
export const getUsers = async () => {
  const response = await api.get("/admin/users");
  return response.data;
};

export const updateUserRoles = async (userId, roles) => {
  const response = await api.put(`/admin/user/${userId}/roles`, { roles });
  return response.data;
};

// ============ COURSES ============
export const getCourses = async () => {
  const response = await api.get("/admin/courses");
  return response.data;
};

export const createCourse = async (courseData) => {
  const response = await api.post("/admin/courses", courseData);
  return response.data;
};

export const updateCourse = async (courseId, courseData) => {
  const response = await api.put(`/admin/courses/${courseId}`, courseData);
  return response.data;
};

export const deleteCourse = async (courseId) => {
  const response = await api.delete(`/admin/courses/${courseId}`);
  return response.data;
};

// ============ TUTORS ============
export const getTutors = async () => {
  const response = await api.get("/admin/tutors");
  return response.data;
};

export const updateTutorStatus = async (tutorId, status) => {
  const response = await api.put(`/admin/tutors/${tutorId}/status`, { status });
  return response.data;
};

export const deleteTutor = async (tutorId) => {
  const response = await api.delete(`/admin/tutors/${tutorId}`);
  return response.data;
};

// ============ STATS ============
export const getAdminStats = async () => {
  const response = await api.get("/admin/stats");
  return response.data;
};
// ============ AI REPORTS (ADMIN) ============
export const getAIReports = async () => {
  const response = await api.get("/admin/ai/reports");
  return response.data;
};

export const generateAIReport = async (type) => {
  const response = await api.post("/admin/ai/generate", { type });
  return response.data;
};

export const getAISystemStats = async () => {
  const response = await api.get("/admin/ai/stats");
  return response.data;
};

export const generateClassReport = async () => {
  const response = await api.post("/admin/ai/class-report");
  return response.data;
};

export const generateStudentReport = async (studentId) => {
  const response = await api.post(`/admin/ai/student-report/${studentId}`);
  return response.data;
};