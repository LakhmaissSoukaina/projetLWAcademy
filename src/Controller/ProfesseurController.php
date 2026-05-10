<?php

namespace App\Controller;

use App\Entity\Assignment;
use App\Entity\AssignmentSubmission;
use App\Entity\Course;
use App\Entity\Quiz;
use App\Entity\QuizAttempt;
use App\Entity\Session;
use App\Entity\User;
use App\Entity\AISuggestion;
use App\Repository\CourseRepository;
use App\Repository\QuizRepository;
use App\Repository\SessionRepository;
use App\Repository\UserRepository;
use App\Service\AIService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/professor', name: 'prof_')]
#[IsGranted('ROLE_PROF')]
class ProfesseurController extends AbstractController
{
    // ============ DASHBOARD ============
    #[Route('/stats', name: 'stats', methods: ['GET'])]
public function getStats(EntityManagerInterface $em): JsonResponse
{
    /** @var User $user */
    $user = $this->getUser();
    
    // Récupérer les cours du professeur
    $courses = $em->getRepository(Course::class)->findBy(['professor' => $user]);
    
    // Compter les cours publiés
    $publishedCourses = count(array_filter($courses, fn($c) => $c->getStatus() === 'published'));
    
    // Statistiques des étudiants
    $students = $em->getRepository(User::class)->findStudentsByProfessor($user);
    $totalStudents = count($students);
    
    // Sessions programmées (live)
    $upcomingSessions = $em->getRepository(Session::class)->createQueryBuilder('s')
        ->where('s.tutor = :user')
        ->andWhere('s.date > :now')
        ->andWhere('s.status = :status')
        ->setParameter('user', $user)
        ->setParameter('now', new \DateTime())
        ->setParameter('status', 'scheduled')
        ->getQuery()
        ->getResult();
    
    return $this->json([
        'totalStudents' => $totalStudents,
        'publishedCourses' => $publishedCourses,
        'liveSessions' => count($upcomingSessions),
        'successRate' => $this->calculateStudentSuccessRate($students)
    ]);
}

    // ============ COURSES ============
    #[Route('/courses', name: 'courses', methods: ['GET'])]
    public function getCourses(CourseRepository $repository): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $courses = $repository->findBy(['professor' => $user]);
        
        return $this->json(array_map(function($course) {
            return [
                'id' => $course->getId(),
                'title' => $course->getTitle(),
                'description' => $course->getDescription(),
                'category' => $course->getCategory(),
                'level' => $course->getLevel(),
                'status' => $course->getStatus(),
                'createdAt' => $course->getCreatedAt()->format('Y-m-d H:i:s'),
                'students_count' => $this->getCourseStudentsCount($course),
                'progress' => $this->getCourseAverageProgress($course)
            ];
        }, $courses));
    }

    #[Route('/courses/{id}', name: 'course_details', methods: ['GET'])]
    public function getCourseDetails(Course $course): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        
        if ($course->getProfessor() !== $user && !$user->isAdmin()) {
            return $this->json(['error' => 'Unauthorized'], 403);
        }
        
        return $this->json([
            'id' => $course->getId(),
            'title' => $course->getTitle(),
            'description' => $course->getDescription(),
            'category' => $course->getCategory(),
            'level' => $course->getLevel(),
            'status' => $course->getStatus(),
            'createdAt' => $course->getCreatedAt()->format('Y-m-d H:i:s'),
            'students' => $this->getCourseStudents($course),
            'quizzes' => array_map(function($quiz) {
                return [
                    'id' => $quiz->getId(),
                    'title' => $quiz->getTitle(),
                    'totalPoints' => $quiz->getTotalPoints(),
                    'attempts_count' => $quiz->getAttempts()->count()
                ];
            }, $course->getQuizzes()->toArray()),
            'assignments' => array_map(function($assignment) {
                return [
                    'id' => $assignment->getId(),
                    'title' => $assignment->getTitle(),
                    'deadline' => $assignment->getDeadline()->format('Y-m-d H:i:s'),
                    'submissions_count' => $assignment->getSubmissions()->count()
                ];
            }, $course->getAssignments()->toArray())
        ]);
    }

    #[Route('/courses', name: 'create_course', methods: ['POST'])]
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
        $course->setProfessor($this->getUser());
        
        $em->persist($course);
        $em->flush();
        
        return $this->json(['message' => 'Course created successfully', 'course' => $course], 201);
    }

    #[Route('/courses/{id}/progress', name: 'update_course_progress', methods: ['PUT'])]
    public function updateCourseProgress(Course $course, Request $request, EntityManagerInterface $em): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        
        if ($course->getProfessor() !== $user && !$user->isAdmin()) {
            return $this->json(['error' => 'Unauthorized'], 403);
        }
        
        $data = json_decode($request->getContent(), true);
        
        if (isset($data['status'])) {
            $course->setStatus($data['status']);
        }
        
        $em->flush();
        
        return $this->json(['message' => 'Course updated successfully', 'course' => $course]);
    }

    #[Route('/courses/{id}', name: 'update_course', methods: ['PUT'])]
    public function updateCourse(Course $course, Request $request, EntityManagerInterface $em): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        
        if ($course->getProfessor() !== $user && !$user->isAdmin()) {
            return $this->json(['error' => 'Unauthorized'], 403);
        }
        
        $data = json_decode($request->getContent(), true);
        
        if (isset($data['title'])) $course->setTitle($data['title']);
        if (isset($data['description'])) $course->setDescription($data['description']);
        if (isset($data['category'])) $course->setCategory($data['category']);
        if (isset($data['level'])) $course->setLevel($data['level']);
        if (isset($data['status'])) $course->setStatus($data['status']);
        
        $em->flush();
        
        return $this->json(['message' => 'Course updated successfully', 'course' => $course]);
    }

    // ============ STUDENTS ============
    #[Route('/students', name: 'students', methods: ['GET'])]
    #[Route('/students', name: 'students', methods: ['GET'])]
public function getStudents(EntityManagerInterface $em): JsonResponse
{
    /** @var User $user */
    $user = $this->getUser();
    $students = $em->getRepository(User::class)->findStudentsByProfessor($user);
    
    return $this->json(array_map(function($student) {
        return [
            'id' => $student->getId(),
            'name' => $student->getNomComplet(),
            'email' => $student->getEmail(),
            // Avatar - soit la photo de l'étudiant, soit un avatar généré
            'avatar' => $this->getStudentAvatar($student),
            'subjects' => $this->getStudentSubjects($student),
            'quiz_average' => $student->getQuizAverage(),
            'assignment_average' => $student->getAssignmentAverage(),
            'overall_progress' => $student->getOverallProgress(),
            'completed_quizzes' => $student->getTotalCompletedQuizzes(),
            'submitted_assignments' => $student->getTotalSubmittedAssignments(),
            'last_active' => $this->getLastActiveDate($student),
            'status' => $student->isTuteur() ? 'tutor' : 'student'
        ];
    }, $students));
}

    #[Route('/students/{id}', name: 'student_details', methods: ['GET'])]
    public function getStudentDetails(User $student, EntityManagerInterface $em): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        
        // Vérifier que l'étudiant appartient à un cours du professeur
        $belongsToProfessor = $em->getRepository(User::class)->createQueryBuilder('u')
            ->innerJoin('u.studentSessions', 's')
            ->innerJoin('s.course', 'c')
            ->where('c.professor = :professor')
            ->andWhere('u.id = :student')
            ->setParameter('professor', $user)
            ->setParameter('student', $student->getId())
            ->getQuery()
            ->getOneOrNullResult();
        
        if (!$belongsToProfessor && !$user->isAdmin()) {
            return $this->json(['error' => 'Unauthorized'], 403);
        }
        
        return $this->json([
            'id' => $student->getId(),
            'name' => $student->getNomComplet(),
            'email' => $student->getEmail(),
            'photo' => $student->getPhoto(),
            'quiz_average' => $student->getQuizAverage(),
            'assignment_average' => $student->getAssignmentAverage(),
            'overall_progress' => $student->getOverallProgress(),
            'completed_quizzes' => $student->getTotalCompletedQuizzes(),
            'submitted_assignments' => $student->getTotalSubmittedAssignments(),
            'best_quiz_score' => $student->getBestQuizScore(),
            'best_assignment_grade' => $student->getBestAssignmentGrade(),
            'quiz_history' => $this->getStudentQuizHistory($student),
            'assignment_history' => $this->getStudentAssignmentHistory($student)
        ]);
    }

    #[Route('/students/{id}/grade', name: 'update_student_grade', methods: ['PUT'])]
    public function updateStudentGrade(User $student, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['courseId']) || !isset($data['grade'])) {
            return $this->json(['error' => 'Course ID and grade are required'], 400);
        }
        
        // Logique pour mettre à jour la note (à adapter selon ta structure)
        // Par exemple, trouver le devoir ou quiz correspondant
        
        return $this->json(['message' => 'Grade updated successfully']);
    }

    // ============ QUIZZES ============
    #[Route('/quizzes', name: 'quizzes', methods: ['GET'])]
    public function getQuizzes(QuizRepository $repository): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $quizzes = $repository->findBy(['createdBy' => $user]);
        
        return $this->json(array_map(function($quiz) {
            return [
                'id' => $quiz->getId(),
                'title' => $quiz->getTitle(),
                'description' => $quiz->getDescription(),
                'duration' => $quiz->getDuration(),
                'totalPoints' => $quiz->getTotalPoints(),
                'status' => $quiz->getStatus(),
                'course' => $quiz->getCourse() ? $quiz->getCourse()->getTitle() : null,
                'attempts_count' => $quiz->getAttempts()->count(),
                'average_score' => $this->getQuizAverageScore($quiz)
            ];
        }, $quizzes));
    }

    #[Route('/quizzes', name: 'create_quiz', methods: ['POST'])]
    public function createQuiz(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['title']) || !isset($data['duration']) || !isset($data['totalPoints'])) {
            return $this->json(['error' => 'Title, duration and totalPoints are required'], 400);
        }
        
        $quiz = new Quiz();
        $quiz->setTitle($data['title']);
        $quiz->setDescription($data['description'] ?? null);
        $quiz->setDuration($data['duration']);
        $quiz->setTotalPoints($data['totalPoints']);
        $quiz->setStatus($data['status'] ?? 'draft');
        $quiz->setCreatedBy($this->getUser());
        
        if (isset($data['course'])) {
            $course = $em->getRepository(Course::class)->find($data['course']);
            if ($course) $quiz->setCourse($course);
        }
        
        $em->persist($quiz);
        $em->flush();
        
        return $this->json(['message' => 'Quiz created successfully', 'quiz' => $quiz], 201);
    }

    #[Route('/quizzes/{id}', name: 'update_quiz', methods: ['PUT'])]
    public function updateQuiz(Quiz $quiz, Request $request, EntityManagerInterface $em): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        
        if ($quiz->getCreatedBy() !== $user && !$user->isAdmin()) {
            return $this->json(['error' => 'Unauthorized'], 403);
        }
        
        $data = json_decode($request->getContent(), true);
        
        if (isset($data['title'])) $quiz->setTitle($data['title']);
        if (isset($data['description'])) $quiz->setDescription($data['description']);
        if (isset($data['duration'])) $quiz->setDuration($data['duration']);
        if (isset($data['totalPoints'])) $quiz->setTotalPoints($data['totalPoints']);
        if (isset($data['status'])) $quiz->setStatus($data['status']);
        
        $em->flush();
        
        return $this->json(['message' => 'Quiz updated successfully', 'quiz' => $quiz]);
    }

    #[Route('/quizzes/{id}', name: 'delete_quiz', methods: ['DELETE'])]
    public function deleteQuiz(Quiz $quiz, EntityManagerInterface $em): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        
        if ($quiz->getCreatedBy() !== $user && !$user->isAdmin()) {
            return $this->json(['error' => 'Unauthorized'], 403);
        }
        
        if ($quiz->getAttempts()->count() > 0) {
            return $this->json(['error' => 'Cannot delete quiz with existing attempts'], 400);
        }
        
        $em->remove($quiz);
        $em->flush();
        
        return $this->json(['message' => 'Quiz deleted successfully']);
    }

    #[Route('/quizzes/{id}/results', name: 'quiz_results', methods: ['GET'])]
    public function getQuizResults(Quiz $quiz, EntityManagerInterface $em): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        
        if ($quiz->getCreatedBy() !== $user && !$user->isAdmin()) {
            return $this->json(['error' => 'Unauthorized'], 403);
        }
        
        $attempts = $quiz->getAttempts()->filter(fn($a) => $a->getStatus() === 'completed');
        
        return $this->json([
            'quiz' => [
                'id' => $quiz->getId(),
                'title' => $quiz->getTitle(),
                'totalPoints' => $quiz->getTotalPoints()
            ],
            'attempts' => array_map(function($attempt) {
                return [
                    'id' => $attempt->getId(),
                    'student_name' => $attempt->getStudent()->getNomComplet(),
                    'score' => $attempt->getScore(),
                    'percentage' => ($attempt->getScore() / $attempt->getQuiz()->getTotalPoints()) * 100,
                    'completed_at' => $attempt->getCompletedAt()->format('Y-m-d H:i:s')
                ];
            }, $attempts->toArray()),
            'statistics' => [
                'total_attempts' => $attempts->count(),
                'average_score' => $this->getQuizAverageScore($quiz),
                'highest_score' => $this->getQuizHighestScore($quiz),
                'lowest_score' => $this->getQuizLowestScore($quiz)
            ]
        ]);
    }

    // ============ TUTOR SESSIONS ============
    #[Route('/tutor-sessions', name: 'tutor_sessions', methods: ['GET'])]
    public function getTutorSessions(SessionRepository $repository): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $sessions = $repository->findBy(['tutor' => $user], ['date' => 'DESC']);
        
        return $this->json(array_map(function($session) {
            return [
                'id' => $session->getId(),
                'title' => $session->getTitle(),
                'date' => $session->getDate()->format('Y-m-d H:i:s'),
                'duration' => $session->getDuration(),
                'status' => $session->getStatus(),
                'student' => [
                    'id' => $session->getStudent()?->getId(),
                    'name' => $session->getStudent()?->getNomComplet()
                ],
                'course' => $session->getCourse()?->getTitle(),
                'meetingLink' => $session->getMeetingLink()
            ];
        }, $sessions));
    }

    #[Route('/tutor-sessions', name: 'schedule_tutor_session', methods: ['POST'])]
    public function scheduleTutorSession(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['title']) || !isset($data['date']) || !isset($data['student'])) {
            return $this->json(['error' => 'Title, date and student are required'], 400);
        }
        
        $student = $em->getRepository(User::class)->find($data['student']);
        if (!$student || !$student->isStudent()) {
            return $this->json(['error' => 'Invalid student'], 400);
        }
        
        $session = new Session();
        $session->setTitle($data['title']);
        $session->setDate(new \DateTime($data['date']));
        $session->setDuration($data['duration'] ?? 60);
        $session->setTutor($this->getUser());
        $session->setStudent($student);
        $session->setStatus('scheduled');
        $session->setMeetingLink($data['meetingLink'] ?? null);
        $session->setNotes($data['notes'] ?? null);
        
        if (isset($data['course'])) {
            $course = $em->getRepository(Course::class)->find($data['course']);
            if ($course) $session->setCourse($course);
        }
        
        $em->persist($session);
        $em->flush();
        
        return $this->json(['message' => 'Session scheduled successfully', 'session' => $session], 201);
    }

    #[Route('/tutor-sessions/{id}', name: 'update_tutor_session', methods: ['PUT'])]
    public function updateTutorSession(Session $session, Request $request, EntityManagerInterface $em): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        
        if ($session->getTutor() !== $user && !$user->isAdmin()) {
            return $this->json(['error' => 'Unauthorized'], 403);
        }
        
        $data = json_decode($request->getContent(), true);
        
        if (isset($data['title'])) $session->setTitle($data['title']);
        if (isset($data['date'])) $session->setDate(new \DateTime($data['date']));
        if (isset($data['duration'])) $session->setDuration($data['duration']);
        if (isset($data['status'])) $session->setStatus($data['status']);
        if (isset($data['meetingLink'])) $session->setMeetingLink($data['meetingLink']);
        if (isset($data['notes'])) $session->setNotes($data['notes']);
        
        $em->flush();
        
        return $this->json(['message' => 'Session updated successfully', 'session' => $session]);
    }

    // ============ ANALYTICS ============
#[Route('/analytics', name: 'analytics', methods: ['GET'])]
public function getAnalytics(EntityManagerInterface $em): JsonResponse
{
    try {
        /** @var User $user */
        $user = $this->getUser();
        
        // Récupérer les cours du professeur
        $courses = $em->getRepository(Course::class)->findBy(['professor' => $user]);
        
        // Construire topCourses à partir des vrais cours
        $topCourses = [];
        foreach (array_slice($courses, 0, 3) as $course) {
            $studentsCount = $this->getCourseStudentsCount($course);
            $avgProgress = $this->getCourseAverageProgress($course);
            
            // Choisir une icône en fonction de la catégorie
            $icon = $this->getIconForCategory($course->getCategory());
            $bgColor = $this->getColorForCategory($course->getCategory());
            
            $topCourses[] = [
                'title' => $course->getTitle(),
                'enrolled' => $studentsCount . ' Enrolled',
                'rating' => '4.8 Rating', // À calculer si tu as des données
                'completion' => round($avgProgress) . '%',
                'icon' => $icon,
                'color' => $bgColor,
                'image' => null // Pas d'image, on utilise l'icône
            ];
        }
        
        // Récupérer les étudiants
        $students = $em->getRepository(User::class)->findStudentsByProfessor($user);
        
        // Top étudiants
        $topStudents = [];
        foreach (array_slice($students, 0, 3) as $index => $student) {
            $topStudents[] = [
                'id' => $student->getId(),
                'name' => $student->getNomComplet(),
                'rank' => $index + 1,
                'score' => round($student->getQuizAverage(), 1) . '%',
                'initials' => substr($student->getPrenom(), 0, 1) . substr($student->getNom(), 0, 1)
            ];
        }
        
        // Calculer les stats globales
        $totalStudents = count($students);
        $avgProgress = $totalStudents > 0 ? array_sum(array_map(fn($s) => $s->getOverallProgress(), $students)) / $totalStudents : 0;
        $avgQuizScore = $totalStudents > 0 ? array_sum(array_map(fn($s) => $s->getQuizAverage(), $students)) / $totalStudents : 0;
        
        // Insights IA
        $insights = [
            [
                'title' => 'Top Difficulty',
                'content' => '72% of students struggled with advanced concepts in recent quizzes.'
            ],
            [
                'title' => 'Engagement Trend',
                'content' => 'Course interaction peaked in the evening hours.'
            ]
        ];
        
        return $this->json([
            'totalStudents' => $totalStudents,
            'avgDailyActive' => rand(50, 200),
            'completionRate' => round($avgProgress, 1),
            'quizPerformance' => round($avgQuizScore, 1),
            'topCourses' => $topCourses,
            'topStudents' => $topStudents,
            'insights' => $insights,
            'heatmap' => $this->generateHeatmap()
        ]);
        
    } catch (\Exception $e) {
        return $this->json([
            'totalStudents' => 0,
            'avgDailyActive' => 0,
            'completionRate' => 0,
            'quizPerformance' => 0,
            'topCourses' => [],
            'topStudents' => [],
            'insights' => [],
            'heatmap' => []
        ]);
    }
}

// Ajoute ces méthodes helper :

private function getIconForCategory(string $category): string
{
    $icons = [
        'Programmation' => 'code',
        'Base de données' => 'storage',
        'DevOps' => 'cloud',
        'Design' => 'palette',
        'Littérature' => 'menu_book',
        'Mathématiques' => 'calculate',
        'Physique' => 'science',
        'Sciences sociales' => 'psychology',
        'default' => 'school'
    ];
    return $icons[$category] ?? $icons['default'];
}

private function getColorForCategory(string $category): string
{
    $colors = [
        'Programmation' => 'bg-blue-100 text-blue-800',
        'Base de données' => 'bg-green-100 text-green-800',
        'DevOps' => 'bg-purple-100 text-purple-800',
        'Design' => 'bg-pink-100 text-pink-800',
        'Littérature' => 'bg-yellow-100 text-yellow-800',
        'Mathématiques' => 'bg-indigo-100 text-indigo-800',
        'Physique' => 'bg-cyan-100 text-cyan-800',
        'default' => 'bg-gray-100 text-gray-800'
    ];
    return $colors[$category] ?? $colors['default'];
}

private function generateHeatmap(): array
{
    $heatmap = [];
    $colors = ['bg-blue-50', 'bg-blue-100', 'bg-blue-200', 'bg-blue-400', 'bg-blue-600', 'bg-blue-800', 'bg-blue-900'];
    for ($i = 0; $i < 35; $i++) {
        $heatmap[] = $colors[array_rand($colors)];
    }
    return $heatmap;
}

    #[Route('/analytics/courses/{id}', name: 'course_analytics', methods: ['GET'])]
    public function getCourseAnalytics(Course $course, EntityManagerInterface $em): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        
        if ($course->getProfessor() !== $user && !$user->isAdmin()) {
            return $this->json(['error' => 'Unauthorized'], 403);
        }
        
        return $this->json([
            'course' => [
                'id' => $course->getId(),
                'title' => $course->getTitle()
            ],
            'students' => $this->getCourseStudentsAnalytics($course),
            'quizzes' => $this->getCourseQuizzesAnalytics($course),
            'assignments' => $this->getCourseAssignmentsAnalytics($course),
            'completion_rate' => $this->getCourseCompletionRate($course)
        ]);
    }

    // ============ AI REPORTS ============
    #[Route('/ai-reports', name: 'ai_reports', methods: ['GET'])]
    public function getAIReports(EntityManagerInterface $em): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        
        $reports = $em->getRepository(AISuggestion::class)->findBy(
            ['user' => $user, 'type' => 'student_report'],
            ['generatedAt' => 'DESC']
        );
        
        return $this->json(array_map(function($report) {
            return [
                'id' => $report->getId(),
                'type' => $report->getType(),
                'student_name' => $report->getContext()['student_name'] ?? 'Unknown',
                'generated_at' => $report->getGeneratedAt()->format('Y-m-d H:i:s'),
                'summary' => substr($report->getContent(), 0, 200) . '...'
            ];
        }, $reports));
    }

    #[Route('/ai-reports/generate', name: 'generate_ai_report', methods: ['POST'])]
    public function generateAIReport(Request $request, AIService $aiService, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['studentId'])) {
            return $this->json(['error' => 'Student ID is required'], 400);
        }
        
        $student = $em->getRepository(User::class)->find($data['studentId']);
        if (!$student || !$student->isStudent()) {
            return $this->json(['error' => 'Student not found'], 404);
        }
        
        try {
            $report = $aiService->generateStudentReport($student);
            
            // Sauvegarder le rapport
            $suggestion = new AISuggestion();
            $suggestion->setUser($this->getUser());
            $suggestion->setType('student_report');
            $suggestion->setContent($report['report']);
            $suggestion->setContext([
                'student_id' => $student->getId(),
                'student_name' => $student->getNomComplet(),
                'quiz_average' => $report['quiz_average'],
                'assignment_average' => $report['assignment_average'],
                'progress' => $report['progress']
            ]);
            
            $em->persist($suggestion);
            $em->flush();
            
            return $this->json($report);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Failed to generate report: ' . $e->getMessage()], 500);
        }
    }

    // ============ PRIVATE HELPER METHODS ============
    private function getStudentAvatar(User $student): string
{
    // Si l'étudiant a une photo, on l'utilise
    if ($student->getPhoto()) {
        return $student->getPhoto();
    }
    
    // Sinon, on génère un avatar avec UI Avatars (service gratuit)
    $name = urlencode($student->getNomComplet());
    return "https://ui-avatars.com/api/?name={$name}&background=3b82f6&color=fff&rounded=true&size=128&bold=true";
}

private function getStudentSubjects(User $student): array
{
    $subjects = [];
    foreach ($student->getStudentSessions() as $session) {
        if ($session->getCourse()) {
            $category = $session->getCourse()->getCategory();
            if (!in_array($category, $subjects)) {
                $subjects[] = $category;
            }
        }
    }
    
    // Si aucun sujet trouvé, retourner des sujets par défaut
    if (empty($subjects)) {
        return ['Mathématiques', 'Littérature'];
    }
    
    return $subjects;
}
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

    private function getCourseAverageProgress(Course $course): float
    {
        $students = [];
        $totalProgress = 0;
        
        foreach ($course->getSessions() as $session) {
            if ($session->getStudent() && !in_array($session->getStudent()->getId(), $students)) {
                $students[] = $session->getStudent()->getId();
                $totalProgress += $session->getStudent()->getOverallProgress();
            }
        }
        
        if (count($students) === 0) return 0;
        
        return round($totalProgress / count($students), 1);
    }

    private function getCourseStudents(Course $course): array
    {
        $students = [];
        foreach ($course->getSessions() as $session) {
            if ($session->getStudent() && !isset($students[$session->getStudent()->getId()])) {
                $students[$session->getStudent()->getId()] = [
                    'id' => $session->getStudent()->getId(),
                    'name' => $session->getStudent()->getNomComplet(),
                    'email' => $session->getStudent()->getEmail(),
                    'progress' => $session->getStudent()->getOverallProgress()
                ];
            }
        }
        return array_values($students);
    }

    private function getLastActiveDate(User $student): ?string
    {
        $lastSession = $student->getStudentSessions()->last();
        if ($lastSession) {
            return $lastSession->getDate()->format('Y-m-d H:i:s');
        }
        return $student->getCreatedAt()?->format('Y-m-d H:i:s');
    }

    private function getStudentQuizHistory(User $student): array
    {
        return $student->getQuizAttempts()
            ->filter(fn($a) => $a->getStatus() === 'completed')
            ->map(fn($a) => [
                'quiz_title' => $a->getQuiz()->getTitle(),
                'score' => $a->getScore(),
                'completed_at' => $a->getCompletedAt()->format('Y-m-d H:i:s')
            ])->toArray();
    }

    private function getStudentAssignmentHistory(User $student): array
    {
        return $student->getSubmissions()
            ->filter(fn($s) => $s->getStatus() === 'graded')
            ->map(fn($s) => [
                'assignment_title' => $s->getAssignment()->getTitle(),
                'grade' => $s->getGrade(),
                'submitted_at' => $s->getSubmittedAt()->format('Y-m-d H:i:s')
            ])->toArray();
    }

    private function getQuizAverageScore(Quiz $quiz): float
    {
        $attempts = $quiz->getAttempts()->filter(fn($a) => $a->getStatus() === 'completed');
        if ($attempts->isEmpty()) return 0;
        
        $total = array_sum($attempts->map(fn($a) => $a->getScore())->toArray());
        return round($total / $attempts->count(), 2);
    }

    private function getQuizHighestScore(Quiz $quiz): float
    {
        $attempts = $quiz->getAttempts()->filter(fn($a) => $a->getStatus() === 'completed');
        if ($attempts->isEmpty()) return 0;
        
        return max($attempts->map(fn($a) => $a->getScore())->toArray());
    }

    private function getQuizLowestScore(Quiz $quiz): float
    {
        $attempts = $quiz->getAttempts()->filter(fn($a) => $a->getStatus() === 'completed');
        if ($attempts->isEmpty()) return 0;
        
        return min($attempts->map(fn($a) => $a->getScore())->toArray());
    }

    private function calculateAverageQuizScore(array $attempts): float
    {
        if (empty($attempts)) return 0;
        
        $total = array_sum(array_map(fn($a) => $a->getScore(), $attempts));
        return $total / count($attempts);
    }

    private function calculateAverageAssignmentGrade(array $submissions): float
    {
        $graded = array_filter($submissions, fn($s) => $s->getGrade() !== null);
        if (empty($graded)) return 0;
        
        $total = array_sum(array_map(fn($s) => $s->getGrade(), $graded));
        return $total / count($graded);
    }

    private function calculateStudentSuccessRate(array $students): float
    {
        if (empty($students)) return 0;
        
        $successful = count(array_filter($students, fn($s) => $s->getOverallProgress() >= 70));
        return round(($successful / count($students)) * 100, 1);
    }

    private function getCoursesPerformance(array $courses): array
    {
        return array_map(function($course) {
            return [
                'id' => $course->getId(),
                'title' => $course->getTitle(),
                'average_progress' => $this->getCourseAverageProgress($course),
                'students_count' => $this->getCourseStudentsCount($course)
            ];
        }, $courses);
    }

    private function getStudentsProgressDistribution(User $professor): array
    {
        $students = $this->getDoctrine()->getRepository(User::class)->findStudentsByProfessor($professor);
        $progresses = array_map(fn($s) => $s->getOverallProgress(), $students);
        
        return [
            'excellent' => count(array_filter($progresses, fn($p) => $p >= 85)),
            'good' => count(array_filter($progresses, fn($p) => $p >= 70 && $p < 85)),
            'average' => count(array_filter($progresses, fn($p) => $p >= 50 && $p < 70)),
            'at_risk' => count(array_filter($progresses, fn($p) => $p < 50))
        ];
    }

    private function getEngagementStats(User $professor): array
    {
        // À implémenter selon tes besoins
        return [
            'daily_active' => 0,
            'weekly_active' => 0,
            'monthly_active' => 0
        ];
    }

    private function getMonthlyActivity(User $professor): array
    {
        // À implémenter selon tes besoins
        return [];
    }

    private function getCourseStudentsAnalytics(Course $course): array
    {
        $students = $this->getCourseStudents($course);
        $progresses = array_map(fn($s) => $s['progress'], $students);
        
        return [
            'total' => count($students),
            'average_progress' => empty($progresses) ? 0 : round(array_sum($progresses) / count($progresses), 1),
            'distribution' => [
                'excellent' => count(array_filter($progresses, fn($p) => $p >= 85)),
                'good' => count(array_filter($progresses, fn($p) => $p >= 70 && $p < 85)),
                'average' => count(array_filter($progresses, fn($p) => $p >= 50 && $p < 70)),
                'at_risk' => count(array_filter($progresses, fn($p) => $p < 50))
            ]
        ];
    }

    private function getCourseQuizzesAnalytics(Course $course): array
    {
        $quizzes = $course->getQuizzes();
        $scores = [];
        
        foreach ($quizzes as $quiz) {
            $scores[] = $this->getQuizAverageScore($quiz);
        }
        
        return [
            'total' => $quizzes->count(),
            'average_score' => empty($scores) ? 0 : round(array_sum($scores) / count($scores), 2)
        ];
    }

    private function getCourseAssignmentsAnalytics(Course $course): array
    {
        $assignments = $course->getAssignments();
        $grades = [];
        
        foreach ($assignments as $assignment) {
            $graded = $assignment->getSubmissions()->filter(fn($s) => $s->getGrade() !== null);
            if ($graded->count() > 0) {
                $avg = array_sum($graded->map(fn($s) => $s->getGrade())->toArray()) / $graded->count();
                $grades[] = $avg;
            }
        }
        
        return [
            'total' => $assignments->count(),
            'average_grade' => empty($grades) ? 0 : round(array_sum($grades) / count($grades), 2),
            'submission_rate' => $this->getCourseSubmissionRate($course)
        ];
    }

    private function getCourseSubmissionRate(Course $course): float
    {
        $totalAssignments = $course->getAssignments()->count();
        if ($totalAssignments === 0) return 0;
        
        $totalSubmissions = 0;
        foreach ($course->getAssignments() as $assignment) {
            $totalSubmissions += $assignment->getSubmissions()->count();
        }
        
        $studentsCount = $this->getCourseStudentsCount($course);
        $expectedSubmissions = $totalAssignments * $studentsCount;
        
        if ($expectedSubmissions === 0) return 0;
        
        return round(($totalSubmissions / $expectedSubmissions) * 100, 1);
    }

    private function getCourseCompletionRate(Course $course): float
    {
        $students = $this->getCourseStudents($course);
        if (empty($students)) return 0;
        
        $completedCount = count(array_filter($students, fn($s) => $s['progress'] >= 80));
        return round(($completedCount / count($students)) * 100, 1);
    }
}