// frontend/src/routes/AppRouter.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Home from "../pages/Home";
import LandingPage from "../pages/LandingPage";
import RegisterProfessor from "../pages/RegisterProfessor"; // ← AJOUT

// =========================
// ADMIN
// =========================
import AdminLayout from "../components/layout/AdminLayout";
import Dashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import Courses from "../pages/admin/Courses";
import Tutors from "../pages/admin/Tutors";
import AIReports from "../pages/admin/AIReports";
import AdminProfessorRequests from "../pages/admin/AdminProfessorRequests"; // ← AJOUT

// =========================
// PROFESSOR
// =========================
import ProfessorLayout from "../components/layout/ProfessorLayout";
import ProfessorDashboard from "../pages/professor/ProfessorDashboard";
import MyCourses from "../pages/professor/MyCourses";
import ProfessorTutorSessions from "../pages/professor/TutorSessions";
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
import TutorSessions from "../pages/tutor/TutorSessions";
import TutorSessionHistory from "../pages/tutor/TutorSessionHistory";
import TutorMessages from "../pages/tutor/TutorMessages";

// Composant de protection des routes
const PrivateRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useContext(AuthContext);
  const isAuthenticated = !!user;

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const userRoles = user?.roles || [];
  const hasAllowedRole = allowedRoles.some(role => userRoles.includes(role));

  if (!hasAllowedRole) {
    if (userRoles.includes('ROLE_ADMIN')) return <Navigate to="/admin" replace />;
    if (userRoles.includes('ROLE_PROF')) return <Navigate to="/professor" replace />;
    if (userRoles.includes('ROLE_TUTEUR')) return <Navigate to="/tutor/dashboard" replace />;
    if (userRoles.includes('ROLE_ETUDIANT')) return <Navigate to="/student/dashboard" replace />;
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Composant de redirection automatique après login
const AutoRedirect = () => {
  const { user, loading } = useContext(AuthContext);
  const isAuthenticated = !!user;

  if (loading) return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const roles = user?.roles || [];
  
  if (roles.includes('ROLE_ADMIN')) return <Navigate to="/admin" replace />;
  if (roles.includes('ROLE_PROF')) return <Navigate to="/professor" replace />;
  if (roles.includes('ROLE_TUTEUR')) return <Navigate to="/tutor/dashboard" replace />;
  if (roles.includes('ROLE_ETUDIANT')) return <Navigate to="/student/dashboard" replace />;
  
  return <Navigate to="/login" replace />;
};

function AppRouter() {
  return (
    <Routes>
      {/* PUBLIC ROUTES */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/register-professor" element={<RegisterProfessor />} /> {/* ← AJOUT */}
      <Route path="/redirect" element={<AutoRedirect />} />

      {/* ADMIN ROUTES */}
      <Route 
        path="/admin" 
        element={
          <PrivateRoute allowedRoles={['ROLE_ADMIN']}>
            <AdminLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="courses" element={<Courses />} />
        <Route path="tutors" element={<Tutors />} />
        <Route path="ai" element={<AIReports />} />
        <Route path="professor-requests" element={<AdminProfessorRequests />} /> {/* ← AJOUT */}
      </Route>

      {/* PROFESSOR ROUTES */}
      <Route 
        path="/professor" 
        element={
          <PrivateRoute allowedRoles={['ROLE_PROF']}>
            <ProfessorLayout />
          </PrivateRoute>
        }
      >
        <Route index element={<ProfessorDashboard />} />
        <Route path="courses" element={<MyCourses />} />
        <Route path="sessions" element={<ProfessorTutorSessions />} />
        <Route path="quiz" element={<QuizManager />} />
        <Route path="students" element={<ProfessorStudents />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="ai" element={<ProfessorAIReports />} />
      </Route>

      {/* STUDENT ROUTES */}
      <Route 
        path="/student" 
        element={
          <PrivateRoute allowedRoles={['ROLE_ETUDIANT', 'ROLE_TUTEUR']}>
            <StudentLayout />
          </PrivateRoute>
        }
      >
        <Route path="dashboard" element={<StudentDashboard />} />
        <Route path="courses" element={<StudentCourses />} />
        <Route path="sessions" element={<StudentTutors />} />
        <Route path="quizes" element={<StudentQuiz />} />
        <Route path="assignments" element={<StudentAssignment />} />
        <Route path="aireports" element={<StudentReport />} />
      </Route>

      {/* TUTOR ROUTES */}
      <Route 
        path="/tutor" 
        element={
          <PrivateRoute allowedRoles={['ROLE_TUTEUR']}>
            <TutorLayout />
          </PrivateRoute>
        }
      >
        <Route path="dashboard" element={<TutorDashboard />} />
        <Route path="sessions" element={<TutorSessions />} />
        <Route path="history" element={<TutorSessionHistory />} />
        <Route path="messages" element={<TutorMessages />} />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRouter;