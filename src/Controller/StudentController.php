<?php
// src/Controller/StudentController.php

namespace App\Controller;

use App\Entity\Assignment;
use App\Entity\AssignmentSubmission;
use App\Entity\Chapter;
use App\Entity\Course;
use App\Entity\Enrollment;
use App\Entity\Quiz;
use App\Entity\QuizAttempt;
use App\Entity\Session;
use App\Entity\User;
use App\Entity\AISuggestion;
use App\Repository\AssignmentRepository;
use App\Repository\CourseRepository;
use App\Repository\QuizRepository;
use App\Repository\SessionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/student', name: 'student_')]
#[IsGranted('ROLE_ETUDIANT')]
class StudentController extends AbstractController
{
    // ============ DASHBOARD ============
    #[Route('/stats', name: 'stats', methods: ['GET'])]
    public function getStats(EntityManagerInterface $em): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        
        $enrollments = $em->getRepository(Enrollment::class)->findBy([
            'student' => $user,
            'status' => 'active'
        ]);
        
        $totalCourses = count($enrollments);
        $totalProgress = 0;
        $completedCourses = 0;
        
        foreach ($enrollments as $enrollment) {
            $progress = $this->calculateCourseProgress($enrollment->getCourse());
            $totalProgress += $progress;
            if ($progress >= 100) {
                $completedCourses++;
            }
        }
        
        return $this->json([
            'quiz_average' => $user->getQuizAverage(),
            'assignment_average' => $user->getAssignmentAverage(),
            'overall_progress' => $totalCourses > 0 ? round($totalProgress / $totalCourses) : 0,
            'completed_quizzes' => $user->getTotalCompletedQuizzes(),
            'submitted_assignments' => $user->getTotalSubmittedAssignments(),
            'upcoming_sessions' => $this->getUpcomingSessionsCount($user),
            'best_quiz_score' => $user->getBestQuizScore(),
            'best_assignment_grade' => $user->getBestAssignmentGrade(),
            'total_courses' => $totalCourses,
            'completed_courses' => $completedCourses,
            'completed_assignments' => $user->getTotalGradedAssignments()
        ]);
    }

    // ============ COURSES ============
    #[Route('/courses', name: 'courses', methods: ['GET'])]
    public function getCourses(EntityManagerInterface $em): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        
        // Récupérer les inscriptions de l'étudiant
        $enrollments = $em->getRepository(Enrollment::class)->findBy([
            'student' => $user,
            'status' => 'active'
        ]);
        
        $courses = array_map(fn($e) => $e->getCourse(), $enrollments);
        
        return $this->json(array_map(function($course) {
            return [
                'id' => $course->getId(),
                'title' => $course->getTitle(),
                'description' => $course->getDescription(),
                'category' => $course->getCategory(),
                'level' => $course->getLevel(),
                'progress' => $this->calculateCourseProgress($course),
                'professor' => $course->getProfessor()->getNomComplet(),
                'professorId' => $course->getProfessor()->getId(),
                'professorEmail' => $course->getProfessor()->getEmail()
            ];
        }, $courses));
    }

    #[Route('/courses/{id}', name: 'course_details', methods: ['GET'])]
    public function getCourseDetails(Course $course, EntityManagerInterface $em): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        
        // Vérifier que l'étudiant est inscrit
        $enrollment = $em->getRepository(Enrollment::class)->findOneBy([
            'student' => $user,
            'course' => $course,
            'status' => 'active'
        ]);
        
        if (!$enrollment) {
            return $this->json(['error' => 'You are not enrolled in this course'], 403);
        }
        
        if ($course->getStatus() !== 'published') {
            return $this->json(['error' => 'Course not available'], 403);
        }
        
        return $this->json([
            'id' => $course->getId(),
            'title' => $course->getTitle(),
            'description' => $course->getDescription(),
            'category' => $course->getCategory(),
            'level' => $course->getLevel(),
            'professor' => $course->getProfessor()->getNomComplet(),
            'professorId' => $course->getProfessor()->getId(),
            'professorEmail' => $course->getProfessor()->getEmail(),
            'quizzes' => array_map(function($quiz) {
                return [
                    'id' => $quiz->getId(),
                    'title' => $quiz->getTitle(),
                    'duration' => $quiz->getDuration(),
                    'totalPoints' => $quiz->getTotalPoints(),
                    'status' => $this->getQuizStatusForStudent($quiz)
                ];
            }, $course->getQuizzes()->toArray()),
            'assignments' => array_map(function($assignment) {
                return [
                    'id' => $assignment->getId(),
                    'title' => $assignment->getTitle(),
                    'deadline' => $assignment->getDeadline()->format('Y-m-d H:i:s'),
                    'maxPoints' => $assignment->getMaxPoints(),
                    'submitted' => $this->hasSubmittedAssignment($assignment)
                ];
            }, $course->getAssignments()->toArray())
        ]);
    }

    #[Route('/courses/{id}/details', name: 'course_details_with_content', methods: ['GET'])]
    public function getCourseDetailsWithContent(Course $course, EntityManagerInterface $em): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        
        // Vérifier que l'étudiant est inscrit
        $enrollment = $em->getRepository(Enrollment::class)->findOneBy([
            'student' => $user,
            'course' => $course,
            'status' => 'active'
        ]);
        
        if (!$enrollment) {
            return $this->json(['error' => 'You are not enrolled in this course'], 403);
        }
        
        if ($course->getStatus() !== 'published') {
            return $this->json(['error' => 'Course not available'], 403);
        }
        
        $chapters = $em->getRepository(Chapter::class)->findBy(
            ['course' => $course],
            ['number' => 'ASC']
        );
        
        return $this->json([
            'id' => $course->getId(),
            'title' => $course->getTitle(),
            'description' => $course->getDescription(),
            'category' => $course->getCategory(),
            'level' => $course->getLevel(),
            'professor' => $course->getProfessor()->getNomComplet(),
            'chapters' => array_map(function($chapter) {
                return [
                    'id' => $chapter->getId(),
                    'number' => $chapter->getNumber(),
                    'title' => $chapter->getTitle(),
                    'contents' => array_map(function($content) {
                        return [
                            'id' => $content->getId(),
                            'title' => $content->getTitle(),
                            'type' => $content->getType(),
                            'filePath' => $content->getFilePath(),
                            'fileSize' => $content->getFileSize(),
                            'duration' => $content->getDuration()
                        ];
                    }, $chapter->getContents()->toArray())
                ];
            }, $chapters)
        ]);
    }

    // ============ TUTORS ============
    #[Route('/tutors', name: 'tutors', methods: ['GET'])]
    public function getAvailableTutors(EntityManagerInterface $em): JsonResponse
    {
        $tutors = $em->getRepository(User::class)->findByRole('ROLE_PROF');
        
        return $this->json(array_map(function($tutor) {
            return [
                'id' => $tutor->getId(),
                'name' => $tutor->getNomComplet(),
                'email' => $tutor->getEmail(),
                'photo' => $tutor->getPhoto(),
                'specialties' => $this->getTutorSpecialties($tutor),
                'total_sessions' => $tutor->getTutorSessions()->count()
            ];
        }, $tutors));
    }

    #[Route('/tutors/active', name: 'active_tutors', methods: ['GET'])]
    public function getActiveTutors(EntityManagerInterface $em): JsonResponse
    {
        $tutors = $em->getRepository(User::class)->findByRole('ROLE_PROF');
        $activeTutors = array_filter($tutors, function($tutor) {
            return $tutor->getTutorSessions()->filter(function($session) {
                return $session->getStatus() === 'scheduled';
            })->count() > 0;
        });
        
        return $this->json(array_values(array_map(function($tutor) {
            return [
                'id' => $tutor->getId(),
                'name' => $tutor->getNomComplet(),
                'email' => $tutor->getEmail(),
                'photo' => $tutor->getPhoto(),
                'next_session' => $this->getNextSessionDate($tutor)
            ];
        }, $activeTutors)));
    }

    #[Route('/tutors/{id}/request', name: 'request_tutor', methods: ['POST'])]
    public function requestTutorSession(User $tutor, Request $request, EntityManagerInterface $em): JsonResponse
    {
        if (!$tutor->isProfessor()) {
            return $this->json(['error' => 'Invalid tutor'], 400);
        }
        
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['date']) || !isset($data['title'])) {
            return $this->json(['error' => 'Date and title are required'], 400);
        }
        
        $session = new Session();
        $session->setTitle($data['title']);
        $session->setDate(new \DateTime($data['date']));
        $session->setDuration($data['duration'] ?? 60);
        $session->setTutor($tutor);
        $session->setStudent($this->getUser());
        $session->setStatus('scheduled');
        $session->setNotes($data['notes'] ?? null);
        $session->setMeetingLink($data['meetingLink'] ?? null);
        
        if (isset($data['course'])) {
            $course = $em->getRepository(Course::class)->find($data['course']);
            if ($course) $session->setCourse($course);
        }
        
        $em->persist($session);
        $em->flush();
        
        return $this->json([
            'message' => 'Session requested successfully',
            'session' => [
                'id' => $session->getId(),
                'title' => $session->getTitle(),
                'date' => $session->getDate()->format('Y-m-d H:i:s'),
                'duration' => $session->getDuration(),
                'status' => $session->getStatus(),
                'meetingLink' => $session->getMeetingLink()
            ]
        ], 201);
    }

    // ============ SESSIONS ============
    #[Route('/sessions/upcoming', name: 'upcoming_sessions', methods: ['GET'])]
    public function getUpcomingSessions(SessionRepository $repository): JsonResponse
    {
        $now = new \DateTime();
        $sessions = $repository->createQueryBuilder('s')
            ->where('s.student = :user')
            ->andWhere('s.date > :now')
            ->andWhere('s.status = :status')
            ->setParameter('user', $this->getUser())
            ->setParameter('now', $now)
            ->setParameter('status', 'scheduled')
            ->orderBy('s.date', 'ASC')
            ->getQuery()
            ->getResult();
        
        return $this->json(array_map(function($session) {
            return [
                'id' => $session->getId(),
                'title' => $session->getTitle(),
                'date' => $session->getDate()->format('Y-m-d H:i:s'),
                'duration' => $session->getDuration(),
                'tutor' => [
                    'id' => $session->getTutor()->getId(),
                    'name' => $session->getTutor()->getNomComplet()
                ],
                'meetingLink' => $session->getMeetingLink(),
                'status' => $session->getStatus()
            ];
        }, $sessions));
    }

    #[Route('/sessions/history', name: 'session_history', methods: ['GET'])]
    public function getSessionHistory(SessionRepository $repository): JsonResponse
    {
        $sessions = $repository->findBy([
            'student' => $this->getUser(),
            'status' => 'completed'
        ], ['date' => 'DESC']);
        
        return $this->json(array_map(function($session) {
            return [
                'id' => $session->getId(),
                'title' => $session->getTitle(),
                'date' => $session->getDate()->format('Y-m-d H:i:s'),
                'duration' => $session->getDuration(),
                'tutor' => $session->getTutor()->getNomComplet(),
                'notes' => $session->getNotes()
            ];
        }, $sessions));
    }

    // ============ QUIZZES ============
    #[Route('/quizzes', name: 'quizzes', methods: ['GET'])]
    public function getQuizzes(QuizRepository $repository): JsonResponse
    {
        $quizzes = $repository->findBy(['status' => 'published']);
        
        return $this->json(array_map(function($quiz) {
            return [
                'id' => $quiz->getId(),
                'title' => $quiz->getTitle(),
                'description' => $quiz->getDescription(),
                'duration' => $quiz->getDuration(),
                'totalPoints' => $quiz->getTotalPoints(),
                'course' => $quiz->getCourse() ? $quiz->getCourse()->getTitle() : null,
                'attempted' => $this->hasAttemptedQuiz($quiz)
            ];
        }, $quizzes));
    }

    #[Route('/quizzes/{id}', name: 'quiz_details', methods: ['GET'])]
    public function getQuizDetails(Quiz $quiz): JsonResponse
    {
        if ($quiz->getStatus() !== 'published') {
            return $this->json(['error' => 'Quiz not available'], 403);
        }
        
        // Vérifier si déjà tenté
        $attempt = $this->getUserAttempt($quiz);
        if ($attempt && $attempt->getStatus() === 'completed') {
            return $this->json([
                'error' => 'You have already completed this quiz',
                'score' => $attempt->getScore(),
                'percentage' => ($attempt->getScore() / $quiz->getTotalPoints()) * 100
            ], 400);
        }
        
        return $this->json([
            'id' => $quiz->getId(),
            'title' => $quiz->getTitle(),
            'description' => $quiz->getDescription(),
            'duration' => $quiz->getDuration(),
            'totalPoints' => $quiz->getTotalPoints(),
            'questions' => array_map(function($q) {
                return [
                    'id' => $q->getId(),
                    'text' => $q->getText(),
                    'type' => $q->getType(),
                    'points' => $q->getPoints(),
                    'options' => $q->getOptions()
                ];
            }, $quiz->getQuestions()->toArray())
        ]);
    }

    #[Route('/quizzes/{id}/submit', name: 'submit_quiz', methods: ['POST'])]
    public function submitQuiz(Quiz $quiz, Request $request, EntityManagerInterface $em): JsonResponse
    {
        if ($quiz->getStatus() !== 'published') {
            return $this->json(['error' => 'Quiz not available'], 400);
        }
        
        // Vérifier si déjà tenté
        $existingAttempt = $this->getUserAttempt($quiz);
        if ($existingAttempt && $existingAttempt->getStatus() === 'completed') {
            return $this->json(['error' => 'You have already completed this quiz'], 400);
        }
        
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['answers'])) {
            return $this->json(['error' => 'Answers are required'], 400);
        }
        
        $attempt = new QuizAttempt();
        $attempt->setQuiz($quiz);
        $attempt->setStudent($this->getUser());
        $attempt->setAnswers($data['answers']);
        $attempt->setCompletedAt(new \DateTime());
        $attempt->setStatus('completed');
        
        $score = $this->calculateQuizScore($quiz, $data['answers']);
        $attempt->setScore($score);
        
        $em->persist($attempt);
        $em->flush();
        
        return $this->json([
            'message' => 'Quiz submitted successfully',
            'score' => $score,
            'total' => $quiz->getTotalPoints(),
            'percentage' => round(($score / $quiz->getTotalPoints()) * 100, 2)
        ]);
    }

    // ============ ASSIGNMENTS ============
    #[Route('/assignments', name: 'assignments', methods: ['GET'])]
    public function getAssignments(AssignmentRepository $repository): JsonResponse
    {
        $assignments = $repository->findBy(['status' => 'published']);
        
        return $this->json(array_map(function($assignment) {
            $submission = $this->getUserSubmission($assignment);
            return [
                'id' => $assignment->getId(),
                'title' => $assignment->getTitle(),
                'description' => $assignment->getDescription(),
                'deadline' => $assignment->getDeadline()->format('Y-m-d H:i:s'),
                'maxPoints' => $assignment->getMaxPoints(),
                'course' => $assignment->getCourse() ? $assignment->getCourse()->getTitle() : null,
                'submitted' => $submission !== null,
                'grade' => $submission ? $submission->getGrade() : null,
                'status' => $submission ? $submission->getStatus() : 'pending'
            ];
        }, $assignments));
    }

    #[Route('/assignments/{id}', name: 'assignment_details', methods: ['GET'])]
    public function getAssignmentDetails(Assignment $assignment): JsonResponse
    {
        if ($assignment->getStatus() !== 'published') {
            return $this->json(['error' => 'Assignment not available'], 403);
        }
        
        $submission = $this->getUserSubmission($assignment);
        
        return $this->json([
            'id' => $assignment->getId(),
            'title' => $assignment->getTitle(),
            'description' => $assignment->getDescription(),
            'deadline' => $assignment->getDeadline()->format('Y-m-d H:i:s'),
            'maxPoints' => $assignment->getMaxPoints(),
            'course' => $assignment->getCourse() ? [
                'id' => $assignment->getCourse()->getId(),
                'title' => $assignment->getCourse()->getTitle()
            ] : null,
            'my_submission' => $submission ? [
                'id' => $submission->getId(),
                'content' => $submission->getContent(),
                'file' => $submission->getFile(),
                'submittedAt' => $submission->getSubmittedAt()->format('Y-m-d H:i:s'),
                'grade' => $submission->getGrade(),
                'feedback' => $submission->getFeedback(),
                'status' => $submission->getStatus()
            ] : null,
            'deadline_passed' => $assignment->getDeadline() < new \DateTime()
        ]);
    }

    #[Route('/assignments/{id}/submit', name: 'submit_assignment', methods: ['POST'])]
    public function submitAssignment(Assignment $assignment, Request $request, EntityManagerInterface $em): JsonResponse
    {
        if ($assignment->getStatus() !== 'published') {
            return $this->json(['error' => 'Assignment not available'], 400);
        }
        
        $existing = $this->getUserSubmission($assignment);
        if ($existing) {
            return $this->json(['error' => 'You have already submitted this assignment'], 400);
        }
        
        $data = json_decode($request->getContent(), true);
        
        $submission = new AssignmentSubmission();
        $submission->setAssignment($assignment);
        $submission->setStudent($this->getUser());
        $submission->setContent($data['content'] ?? null);
        $submission->setFile($data['file'] ?? null);
        
        if ($assignment->getDeadline() < new \DateTime()) {
            $submission->setStatus('late');
        }
        
        $em->persist($submission);
        $em->flush();
        
        return $this->json([
            'message' => 'Assignment submitted successfully',
            'submission' => [
                'id' => $submission->getId(),
                'content' => $submission->getContent(),
                'submittedAt' => $submission->getSubmittedAt()->format('Y-m-d H:i:s'),
                'status' => $submission->getStatus()
            ]
        ], 201);
    }

    // ============ REPORTS ============
    #[Route('/reports', name: 'reports', methods: ['GET'])]
    public function getReports(EntityManagerInterface $em): JsonResponse
    {
        $reports = $em->getRepository(AISuggestion::class)->findBy([
            'user' => $this->getUser(),
            'type' => 'study_plan'
        ], ['generatedAt' => 'DESC']);
        
        return $this->json(array_map(function($report) {
            return [
                'id' => $report->getId(),
                'type' => $report->getType(),
                'content' => substr($report->getContent(), 0, 200) . '...',
                'generatedAt' => $report->getGeneratedAt()->format('Y-m-d H:i:s')
            ];
        }, $reports));
    }

    #[Route('/reports/{id}', name: 'report_details', methods: ['GET'])]
    public function getReportDetails(AISuggestion $report): JsonResponse
    {
        if ($report->getUser() !== $this->getUser()) {
            return $this->json(['error' => 'Unauthorized'], 403);
        }
        
        return $this->json([
            'id' => $report->getId(),
            'type' => $report->getType(),
            'content' => $report->getContent(),
            'context' => $report->getContext(),
            'generatedAt' => $report->getGeneratedAt()->format('Y-m-d H:i:s')
        ]);
    }

    // ============ PRIVATE METHODS ============
    private function getUpcomingSessionsCount(User $user): int
    {
        $now = new \DateTime();
        $count = 0;
        foreach ($user->getStudentSessions() as $session) {
            if ($session->getDate() > $now && $session->getStatus() === 'scheduled') {
                $count++;
            }
        }
        return $count;
    }

    private function getTutorSpecialties(User $tutor): array
    {
        $specialties = [];
        foreach ($tutor->getCourses() as $course) {
            $specialties[] = $course->getCategory();
        }
        return array_unique($specialties);
    }

    private function getNextSessionDate(User $tutor): ?string
    {
        $now = new \DateTime();
        foreach ($tutor->getTutorSessions() as $session) {
            if ($session->getDate() > $now && $session->getStatus() === 'scheduled') {
                return $session->getDate()->format('Y-m-d H:i:s');
            }
        }
        return null;
    }

    private function hasAttemptedQuiz(Quiz $quiz): bool
    {
        foreach ($this->getUser()->getQuizAttempts() as $attempt) {
            if ($attempt->getQuiz()->getId() === $quiz->getId() && $attempt->getStatus() === 'completed') {
                return true;
            }
        }
        return false;
    }

    private function getUserAttempt(Quiz $quiz): ?QuizAttempt
    {
        foreach ($this->getUser()->getQuizAttempts() as $attempt) {
            if ($attempt->getQuiz()->getId() === $quiz->getId()) {
                return $attempt;
            }
        }
        return null;
    }

    private function getUserSubmission(Assignment $assignment): ?AssignmentSubmission
    {
        foreach ($this->getUser()->getSubmissions() as $submission) {
            if ($submission->getAssignment()->getId() === $assignment->getId()) {
                return $submission;
            }
        }
        return null;
    }

    private function hasSubmittedAssignment(Assignment $assignment): bool
    {
        return $this->getUserSubmission($assignment) !== null;
    }

    private function calculateCourseProgress(Course $course): float
    {
        $totalQuizzes = $course->getQuizzes()->count();
        $completedQuizzes = 0;
        foreach ($course->getQuizzes() as $quiz) {
            if ($this->hasAttemptedQuiz($quiz)) {
                $completedQuizzes++;
            }
        }
        
        $totalAssignments = $course->getAssignments()->count();
        $completedAssignments = 0;
        foreach ($course->getAssignments() as $assignment) {
            if ($this->hasSubmittedAssignment($assignment)) {
                $completedAssignments++;
            }
        }
        
        $total = $totalQuizzes + $totalAssignments;
        $completed = $completedQuizzes + $completedAssignments;
        
        if ($total === 0) return 0;
        
        return round(($completed / $total) * 100, 1);
    }

    private function getTotalCoursesCount(): int
    {
        return $this->getDoctrine()->getRepository(Course::class)->count(['status' => 'published']);
    }

    private function calculateQuizScore(Quiz $quiz, array $answers): float
    {
        $totalEarned = 0;
        foreach ($quiz->getQuestions() as $question) {
            $questionId = $question->getId();
            if (isset($answers[$questionId])) {
                if ($question->getCorrectAnswer() === $answers[$questionId]) {
                    $totalEarned += $question->getPoints();
                }
            }
        }
        return $totalEarned;
    }

    private function getQuizStatusForStudent(Quiz $quiz): string
    {
        if ($this->hasAttemptedQuiz($quiz)) {
            return 'completed';
        }
        return 'pending';
    }
}