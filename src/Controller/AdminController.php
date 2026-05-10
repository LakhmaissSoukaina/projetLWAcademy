<?php

namespace App\Controller;

use App\Entity\Course;
use App\Entity\User;
use App\Entity\Session;
use App\Entity\Quiz;
use App\Entity\Assignment;
use App\Entity\AssignmentSubmission;
use App\Entity\QuizAttempt;
use App\Repository\UserRepository;
use App\Repository\CourseRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/admin', name: 'admin_')]
#[IsGranted('ROLE_ADMIN')]
class AdminController extends AbstractController
{
    // ============ USERS ============
    #[Route('/users', name: 'users', methods: ['GET'])]
    public function getUsers(UserRepository $repository): JsonResponse
    {
        $users = $repository->findAll();
        
        return $this->json(array_map(function($user) {
            return [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'nom' => $user->getNom(),
                'prenom' => $user->getPrenom(),
                'nomComplet' => $user->getNomComplet(),
                'photo' => $user->getPhoto(),
                'roles' => $user->getRoles(),
                'isVerified' => $user->isVerified(),
                'createdAt' => $user->getCreatedAt()->format('Y-m-d H:i:s'),
                'quizAverage' => $user->getQuizAverage(),
                'assignmentAverage' => $user->getAssignmentAverage(),
                'overallProgress' => $user->getOverallProgress()
            ];
        }, $users));
    }

    #[Route('/user/{id}/roles', name: 'update_roles', methods: ['PUT'])]
    public function updateUserRoles(User $user, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['roles']) || !is_array($data['roles'])) {
            return $this->json(['error' => 'Roles are required'], 400);
        }
        
        $user->setRoles($data['roles']);
        $em->flush();
        
        return $this->json([
            'message' => 'User roles updated successfully',
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'roles' => $user->getRoles()
            ]
        ]);
    }

    #[Route('/user/{id}/verify', name: 'verify_user', methods: ['POST'])]
    public function verifyUser(User $user, EntityManagerInterface $em): JsonResponse
    {
        $user->setIsVerified(true);
        $em->flush();
        
        return $this->json(['message' => 'User verified successfully']);
    }

    #[Route('/user/{id}/delete', name: 'delete_user', methods: ['DELETE'])]
    public function deleteUser(User $user, EntityManagerInterface $em): JsonResponse
    {
        if ($user === $this->getUser()) {
            return $this->json(['error' => 'You cannot delete your own account'], 400);
        }
        
        $em->remove($user);
        $em->flush();
        
        return $this->json(['message' => 'User deleted successfully']);
    }

    // ============ COURSES ============
    #[Route('/courses', name: 'admin_courses', methods: ['GET'])]
    public function getCourses(CourseRepository $repository): JsonResponse
    {
        $courses = $repository->findAll();
        
        return $this->json(array_map(function($course) {
            return [
                'id' => $course->getId(),
                'title' => $course->getTitle(),
                'description' => $course->getDescription(),
                'category' => $course->getCategory(),
                'level' => $course->getLevel(),
                'status' => $course->getStatus(),
                'professor' => [
                    'id' => $course->getProfessor()->getId(),
                    'name' => $course->getProfessor()->getNomComplet()
                ],
                'createdAt' => $course->getCreatedAt()->format('Y-m-d H:i:s'),
                'students_count' => $this->getCourseStudentsCount($course),
                'quizzes_count' => $course->getQuizzes()->count(),
                'assignments_count' => $course->getAssignments()->count()
            ];
        }, $courses));
    }

    #[Route('/courses', name: 'admin_create_course', methods: ['POST'])]
    public function createCourse(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['title']) || !isset($data['category']) || !isset($data['level'])) {
            return $this->json(['error' => 'Title, category and level are required'], 400);
        }
        
        $course = new Course();
        $course->setTitle($data['title']);
        $course->setDescription($data['description'] ?? null);
        $course->setCategory($data['category']);
        $course->setLevel($data['level']);
        $course->setStatus($data['status'] ?? 'draft');
        
        if (isset($data['professor'])) {
            $professor = $em->getRepository(User::class)->find($data['professor']);
            if ($professor && $professor->isProfessor()) {
                $course->setProfessor($professor);
            }
        } else {
            $course->setProfessor($this->getUser());
        }
        
        $em->persist($course);
        $em->flush();
        
        return $this->json(['message' => 'Course created successfully', 'course' => $course], 201);
    }

    #[Route('/courses/{id}', name: 'admin_update_course', methods: ['PUT'])]
    public function updateCourse(Course $course, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        if (isset($data['title'])) $course->setTitle($data['title']);
        if (isset($data['description'])) $course->setDescription($data['description']);
        if (isset($data['category'])) $course->setCategory($data['category']);
        if (isset($data['level'])) $course->setLevel($data['level']);
        if (isset($data['status'])) $course->setStatus($data['status']);
        
        if (isset($data['professor'])) {
            $professor = $em->getRepository(User::class)->find($data['professor']);
            if ($professor && $professor->isProfessor()) {
                $course->setProfessor($professor);
            }
        }
        
        $em->flush();
        
        return $this->json(['message' => 'Course updated successfully', 'course' => $course]);
    }

    #[Route('/courses/{id}', name: 'admin_delete_course', methods: ['DELETE'])]
    public function deleteCourse(Course $course, EntityManagerInterface $em): JsonResponse
    {
        if ($course->getSessions()->count() > 0 || 
            $course->getQuizzes()->count() > 0 || 
            $course->getAssignments()->count() > 0) {
            return $this->json(['error' => 'Cannot delete course with existing sessions, quizzes or assignments'], 400);
        }
        
        $em->remove($course);
        $em->flush();
        
        return $this->json(['message' => 'Course deleted successfully']);
    }

    // ============ TUTORS ============
    #[Route('/tutors', name: 'admin_tutors', methods: ['GET'])]
    public function getTutors(EntityManagerInterface $em): JsonResponse
    {
        $tutors = $em->getRepository(User::class)->findByRole('ROLE_PROF');
        
        return $this->json(array_map(function($tutor) {
            return [
                'id' => $tutor->getId(),
                'name' => $tutor->getNomComplet(),
                'email' => $tutor->getEmail(),
                'photo' => $tutor->getPhoto(),
                'isVerified' => $tutor->isVerified(),
                'courses_count' => $tutor->getCourses()->count(),
                'sessions_count' => $tutor->getTutorSessions()->count(),
                'students_count' => $this->getTutorStudentsCount($tutor),
                'status' => $tutor->isVerified() ? 'active' : 'pending'
            ];
        }, $tutors));
    }

    #[Route('/tutors/{id}/status', name: 'update_tutor_status', methods: ['PUT'])]
    public function updateTutorStatus(User $tutor, Request $request, EntityManagerInterface $em): JsonResponse
    {
        if (!$tutor->isProfessor()) {
            return $this->json(['error' => 'User is not a tutor'], 400);
        }
        
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['status'])) {
            return $this->json(['error' => 'Status is required'], 400);
        }
        
        if ($data['status'] === 'active') {
            $tutor->setIsVerified(true);
        } elseif ($data['status'] === 'inactive') {
            $tutor->setIsVerified(false);
        } else {
            return $this->json(['error' => 'Invalid status. Use "active" or "inactive"'], 400);
        }
        
        $em->flush();
        
        return $this->json(['message' => 'Tutor status updated successfully']);
    }

    #[Route('/tutors/{id}', name: 'admin_delete_tutor', methods: ['DELETE'])]
    public function deleteTutor(User $tutor, EntityManagerInterface $em): JsonResponse
    {
        if (!$tutor->isProfessor()) {
            return $this->json(['error' => 'User is not a tutor'], 400);
        }
        
        if ($tutor->getCourses()->count() > 0) {
            return $this->json(['error' => 'Cannot delete tutor with existing courses'], 400);
        }
        
        $em->remove($tutor);
        $em->flush();
        
        return $this->json(['message' => 'Tutor deleted successfully']);
    }

    // ============ STATS ============
    #[Route('/stats', name: 'admin_stats', methods: ['GET'])]
    public function getStats(EntityManagerInterface $em): JsonResponse
    {
        $totalUsers = $em->getRepository(User::class)->count([]);
        $totalStudents = $em->getRepository(User::class)->countByRole('ROLE_ETUDIANT');
        $totalProfessors = $em->getRepository(User::class)->countByRole('ROLE_PROF');
        $totalAdmins = $em->getRepository(User::class)->countByRole('ROLE_ADMIN');
        
        $totalCourses = $em->getRepository(Course::class)->count([]);
        $publishedCourses = $em->getRepository(Course::class)->count(['status' => 'published']);
        $draftCourses = $em->getRepository(Course::class)->count(['status' => 'draft']);
        
        $totalQuizzes = $em->getRepository(Quiz::class)->count([]);
        $totalAssignments = $em->getRepository(Assignment::class)->count([]);
        $totalSessions = $em->getRepository(Session::class)->count([]);
        
        $totalQuizAttempts = $em->getRepository(QuizAttempt::class)->count([]);
        $totalSubmissions = $em->getRepository(AssignmentSubmission::class)->count([]);
        
        $averageQuizScore = $this->getAverageQuizScore($em);
        $averageAssignmentGrade = $this->getAverageAssignmentGrade($em);
        
        return $this->json([
            'users' => [
                'total' => $totalUsers,
                'students' => $totalStudents,
                'professors' => $totalProfessors,
                'admins' => $totalAdmins
            ],
            'courses' => [
                'total' => $totalCourses,
                'published' => $publishedCourses,
                'draft' => $draftCourses
            ],
            'content' => [
                'quizzes' => $totalQuizzes,
                'assignments' => $totalAssignments,
                'sessions' => $totalSessions
            ],
            'engagement' => [
                'quiz_attempts' => $totalQuizAttempts,
                'submissions' => $totalSubmissions,
                'average_quiz_score' => round($averageQuizScore, 2),
                'average_assignment_grade' => round($averageAssignmentGrade, 2)
            ]
        ]);
    }

    #[Route('/stats/advanced', name: 'admin_advanced_stats', methods: ['GET'])]
    public function getAdvancedStats(EntityManagerInterface $em): JsonResponse
    {
        // Statistiques par mois
        $monthlyRegistrations = $this->getMonthlyRegistrations($em);
        $monthlyCourses = $this->getMonthlyCourses($em);
        
        // Top professeurs
        $topProfessors = $this->getTopProfessors($em);
        
        // Progression globale des étudiants
        $students = $em->getRepository(User::class)->findByRole('ROLE_ETUDIANT');
        $studentProgress = array_map(function($student) {
            return $student->getOverallProgress();
        }, $students);
        
        return $this->json([
            'monthly_registrations' => $monthlyRegistrations,
            'monthly_courses' => $monthlyCourses,
            'top_professors' => $topProfessors,
            'student_progress_stats' => [
                'average' => empty($studentProgress) ? 0 : round(array_sum($studentProgress) / count($studentProgress), 1),
                'min' => empty($studentProgress) ? 0 : min($studentProgress),
                'max' => empty($studentProgress) ? 0 : max($studentProgress),
                'distribution' => $this->getProgressDistribution($studentProgress)
            ]
        ]);
    }

    // ============ PRIVATE METHODS ============
    private function getCourseStudentsCount(Course $course): int
    {
        $students = [];
        foreach ($course->getSessions() as $session) {
            if ($session->getStudent() && !in_array($session->getStudent()->getId(), $students)) {
                $students[] = $session->getStudent()->getId();
            }
        }
        return count($students);
    }

    private function getTutorStudentsCount(User $tutor): int
    {
        $students = [];
        foreach ($tutor->getTutorSessions() as $session) {
            if ($session->getStudent() && !in_array($session->getStudent()->getId(), $students)) {
                $students[] = $session->getStudent()->getId();
            }
        }
        return count($students);
    }

    private function getAverageQuizScore(EntityManagerInterface $em): float
    {
        $attempts = $em->getRepository(QuizAttempt::class)->findBy(['status' => 'completed']);
        if (empty($attempts)) return 0;
        
        $total = array_sum(array_map(fn($a) => $a->getScore(), $attempts));
        return $total / count($attempts);
    }

    private function getAverageAssignmentGrade(EntityManagerInterface $em): float
    {
        $submissions = $em->getRepository(AssignmentSubmission::class)->findBy(['status' => 'graded']);
        if (empty($submissions)) return 0;
        
        $total = array_sum(array_map(fn($s) => $s->getGrade(), $submissions));
        return $total / count($submissions);
    }

    private function getMonthlyRegistrations(EntityManagerInterface $em): array
    {
        $qb = $em->createQueryBuilder();
        $qb->select('MONTH(u.createdAt) as month, COUNT(u.id) as count')
            ->from(User::class, 'u')
            ->where('u.createdAt >= :year')
            ->setParameter('year', new \DateTime('-1 year'))
            ->groupBy('month')
            ->orderBy('month', 'ASC');
        
        $results = $qb->getQuery()->getResult();
        
        $data = [];
        for ($i = 1; $i <= 12; $i++) {
            $data[$i] = 0;
        }
        foreach ($results as $result) {
            $data[(int)$result['month']] = $result['count'];
        }
        
        return $data;
    }

    private function getMonthlyCourses(EntityManagerInterface $em): array
    {
        $qb = $em->createQueryBuilder();
        $qb->select('MONTH(c.createdAt) as month, COUNT(c.id) as count')
            ->from(Course::class, 'c')
            ->where('c.createdAt >= :year')
            ->setParameter('year', new \DateTime('-1 year'))
            ->groupBy('month')
            ->orderBy('month', 'ASC');
        
        $results = $qb->getQuery()->getResult();
        
        $data = [];
        for ($i = 1; $i <= 12; $i++) {
            $data[$i] = 0;
        }
        foreach ($results as $result) {
            $data[(int)$result['month']] = $result['count'];
        }
        
        return $data;
    }

    private function getTopProfessors(EntityManagerInterface $em): array
    {
        $professors = $em->getRepository(User::class)->findByRole('ROLE_PROF');
        
        $professorsWithStats = array_map(function($professor) {
            return [
                'id' => $professor->getId(),
                'name' => $professor->getNomComplet(),
                'courses_count' => $professor->getCourses()->count(),
                'students_count' => $this->getTutorStudentsCount($professor),
                'sessions_count' => $professor->getTutorSessions()->count()
            ];
        }, $professors);
        
        usort($professorsWithStats, function($a, $b) {
            return $b['students_count'] <=> $a['students_count'];
        });
        
        return array_slice($professorsWithStats, 0, 5);
    }

    private function getProgressDistribution(array $progresses): array
    {
        return [
            'excellent' => count(array_filter($progresses, fn($p) => $p >= 85)),
            'good' => count(array_filter($progresses, fn($p) => $p >= 70 && $p < 85)),
            'average' => count(array_filter($progresses, fn($p) => $p >= 50 && $p < 70)),
            'at_risk' => count(array_filter($progresses, fn($p) => $p < 50))
        ];
    }
}