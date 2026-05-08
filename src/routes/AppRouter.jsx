import { Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Home from "../pages/Home";
import LandingPage from "../pages/LandingPage";

// =========================
// ADMIN
// =========================
import AdminLayout from "../components/layout/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import Courses from "../pages/admin/Courses";
import Tutors from "../pages/admin/Tutors";
import AIReports from "../pages/admin/AIReports";

// =========================
// PROFESSOR
// =========================
import ProfessorLayout from "../components/layout/ProfessorLayout";
import ProfessorDashboard from "../pages/professor/ProfessorDashboard";
import MyCourses from "../pages/professor/MyCourses";
import TutorSessions from "../pages/professor/TutorSessions";
import QuizManager from "../pages/professor/QuizManager";
import Analytics from "../pages/professor/Analytics";
import ProfessorStudents from "../pages/professor/ProfessorStudents";
import ProfessorAIReports from "../pages/professor/ProfessorAIReports";

// =========================
// STUDENT
// =========================
import StudentLayout from "../components/layout/StudentLayout";
import StudentDashboard from "../pages/student/StudentDashboard";
import StudentCourses from "../pages/student/StudentCourses";
import StudentTutors from "../pages/student/StudentTutors";
import StudentQuiz from "../pages/student/StudentQuiz";
import StudentAssignment from "../pages/student/StudentAssignment";
import StudentReport from "../pages/student/StudentReport";

// =========================
// TUTOR
// =========================

import TutorLayout from "../components/layout/TutorLayout";
import TutorDashboard from "../pages/tutor/TutorDashboard";

function AppRouter() {
  return (
    <Routes>
      {/* ========================= */}
      {/* LANDING PAGE */}
      {/* ========================= */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<Home />} />

      {/* ========================= */}
      {/* AUTH */}
      {/* ========================= */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ========================= */}
      {/* ADMIN ROUTES */}
      {/* ========================= */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="courses" element={<Courses />} />
        <Route path="tutors" element={<Tutors />} />
        <Route path="ai" element={<AIReports />} />
      </Route>

      {/* ========================= */}
      {/* PROFESSOR ROUTES */}
      {/* ========================= */}
      <Route path="/professor" element={<ProfessorLayout />}>
        {/* Dashboard */}
        <Route index element={<ProfessorDashboard />} />

        {/* Courses */}
        <Route path="courses" element={<MyCourses />} />

        {/* Sessions */}
        <Route path="sessions" element={<TutorSessions />} />

        {/* Quiz */}
        <Route path="quiz" element={<QuizManager />} />

        {/* Students */}
        <Route path="students" element={<ProfessorStudents />} />

        {/* Analytics */}
        <Route path="analytics" element={<Analytics />} />

        {/* AI REPORTS */}
        <Route path="ai" element={<ProfessorAIReports />} />
      </Route>

      {/* ========================= */}
      {/* STUDENT ROUTES */}
      {/* ========================= */}
      <Route path="/student" element={<StudentLayout />}>
        {/* Dashboard */}
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="courses" element={<StudentCourses />} />
        <Route path="sessions" element={<StudentTutors />} />
        <Route path="quizes" element={<StudentQuiz />} />
        <Route path="assignments" element={<StudentAssignment />} />
        <Route path="aireports" element={<StudentReport />} />
      </Route>

      {/* ========================= */}
      {/* TUTOR ROUTES */}
      {/* ========================= */}

      <Route path="/tutor" element={<TutorLayout />}>
        <Route path="dashboard" element={<TutorDashboard />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
