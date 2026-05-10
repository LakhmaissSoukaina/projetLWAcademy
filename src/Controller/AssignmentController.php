<?php

namespace App\Controller;

use App\Entity\Assignment;
use App\Entity\AssignmentSubmission;
use App\Entity\Course;
use App\Entity\User;
use App\Repository\AssignmentRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/assignments')]
class AssignmentController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function index(AssignmentRepository $repository): JsonResponse
    {
        $assignments = $repository->findAll();
        return $this->json($assignments, 200, [], ['groups' => 'assignment:read']);
    }

    #[Route('/{id}', methods: ['GET'])]
    public function show(Assignment $assignment): JsonResponse
    {
        return $this->json($assignment, 200, [], ['groups' => 'assignment:read']);
    }

    #[Route('', methods: ['POST'])]
    #[IsGranted('ROLE_PROF')]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        // Validation des données requises
        if (!isset($data['title']) || !isset($data['description']) || !isset($data['deadline']) || !isset($data['maxPoints'])) {
            return $this->json(['error' => 'Les champs title, description, deadline et maxPoints sont requis'], 400);
        }
        
        $assignment = new Assignment();
        $assignment->setTitle($data['title']);
        $assignment->setDescription($data['description']);
        $assignment->setDeadline(new \DateTime($data['deadline']));
        $assignment->setMaxPoints($data['maxPoints']);
        
        if (isset($data['course'])) {
            $course = $em->getRepository(Course::class)->find($data['course']);
            if (!$course) {
                return $this->json(['error' => 'Course not found'], 404);
            }
            $assignment->setCourse($course);
        }
        
        if (isset($data['status'])) {
            $assignment->setStatus($data['status']);
        }
        
        $em->persist($assignment);
        $em->flush();
        
        return $this->json($assignment, 201, [], ['groups' => 'assignment:read']);
    }

    #[Route('/{id}', methods: ['PUT'])]
    #[IsGranted('ROLE_PROF')]
    public function update(Assignment $assignment, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        if (isset($data['title'])) {
            $assignment->setTitle($data['title']);
        }
        if (isset($data['description'])) {
            $assignment->setDescription($data['description']);
        }
        if (isset($data['deadline'])) {
            $assignment->setDeadline(new \DateTime($data['deadline']));
        }
        if (isset($data['maxPoints'])) {
            $assignment->setMaxPoints($data['maxPoints']);
        }
        if (isset($data['status'])) {
            $assignment->setStatus($data['status']);
        }
        if (isset($data['course'])) {
            $course = $em->getRepository(Course::class)->find($data['course']);
            if ($course) {
                $assignment->setCourse($course);
            }
        }
        
        $em->flush();
        
        return $this->json($assignment, 200, [], ['groups' => 'assignment:read']);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    #[IsGranted('ROLE_PROF')]
    public function delete(Assignment $assignment, EntityManagerInterface $em): JsonResponse
    {
        // Vérifier si des soumissions existent
        if ($assignment->getSubmissions()->count() > 0) {
            return $this->json(['error' => 'Impossible de supprimer un devoir qui a déjà des soumissions'], 400);
        }
        
        $em->remove($assignment);
        $em->flush();
        
        return $this->json(['message' => 'Assignment deleted successfully']);
    }

    #[Route('/{id}/submit', methods: ['POST'])]
    #[IsGranted('ROLE_ETUDIANT')]
    public function submit(Assignment $assignment, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        // Vérifier si le devoir est publié
        if ($assignment->getStatus() !== 'published') {
            return $this->json(['error' => 'Ce devoir n\'est pas encore disponible'], 400);
        }
        
        // Vérifier si l'étudiant a déjà soumis
        $existing = $em->getRepository(AssignmentSubmission::class)->findOneBy([
            'assignment' => $assignment,
            'student' => $this->getUser()
        ]);
        
        if ($existing) {
            return $this->json(['error' => 'Vous avez déjà soumis ce devoir'], 400);
        }
        
        // Vérifier qu'au moins un contenu ou fichier est fourni
        if (empty($data['content']) && empty($data['file'])) {
            return $this->json(['error' => 'Veuillez fournir un contenu ou un fichier'], 400);
        }
        
        $submission = new AssignmentSubmission();
        $submission->setAssignment($assignment);
        $submission->setStudent($this->getUser());
        $submission->setContent($data['content'] ?? null);
        $submission->setFile($data['file'] ?? null);
        
        // Vérifier si c'est en retard
        $now = new \DateTime();
        if ($assignment->getDeadline() < $now) {
            $submission->setStatus('late');
        }
        
        $em->persist($submission);
        $em->flush();
        
        return $this->json([
            'message' => 'Devoir soumis avec succès',
            'submission' => $submission,
            'is_late' => $submission->getStatus() === 'late'
        ], 201, [], ['groups' => 'submission:read']);
    }

    #[Route('/{id}/submissions', methods: ['GET'])]
    #[IsGranted('ROLE_PROF')]
    public function getSubmissions(Assignment $assignment, EntityManagerInterface $em): JsonResponse
    {
        $submissions = $em->getRepository(AssignmentSubmission::class)->findBy([
            'assignment' => $assignment
        ]);
        
        return $this->json($submissions, 200, [], ['groups' => 'submission:read']);
    }

    #[Route('/my-submissions', methods: ['GET'])]
    #[IsGranted('ROLE_ETUDIANT')]
    public function mySubmissions(EntityManagerInterface $em): JsonResponse
    {
        $submissions = $em->getRepository(AssignmentSubmission::class)->findBy([
            'student' => $this->getUser()
        ]);
        
        return $this->json($submissions, 200, [], ['groups' => 'submission:read']);
    }

    #[Route('/submission/{id}/grade', methods: ['POST'])]
    #[IsGranted('ROLE_PROF')]
    public function grade(AssignmentSubmission $submission, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        // Validation de la note
        if (!isset($data['grade'])) {
            return $this->json(['error' => 'La note est requise'], 400);
        }
        
        $maxPoints = $submission->getAssignment()->getMaxPoints();
        $grade = floatval($data['grade']);
        
        if ($grade < 0 || $grade > $maxPoints) {
            return $this->json(['error' => "La note doit être comprise entre 0 et $maxPoints"], 400);
        }
        
        $submission->setGrade($grade);
        $submission->setFeedback($data['feedback'] ?? null);
        $submission->setGradedAt(new \DateTime());
        $submission->setGradedBy($this->getUser());
        $submission->setStatus('graded');
        
        $em->flush();
        
        return $this->json([
            'message' => 'Devoir noté avec succès',
            'submission' => $submission,
            'grade_percentage' => ($grade / $maxPoints) * 100
        ], 200, [], ['groups' => 'submission:read']);
    }

    #[Route('/submission/{id}', methods: ['GET'])]
    public function getSubmission(AssignmentSubmission $submission): JsonResponse
    {
        // Vérifier les droits d'accès
        $user = $this->getUser();
        $isOwner = $submission->getStudent() === $user;
        $isProfessor = $user->isProfessor() && $submission->getAssignment()->getCourse()?->getProfessor() === $user;
        $isAdmin = $user->isAdmin();
        
        if (!$isOwner && !$isProfessor && !$isAdmin) {
            return $this->json(['error' => 'Accès non autorisé'], 403);
        }
        
        return $this->json($submission, 200, [], ['groups' => 'submission:read']);
    }

    #[Route('/submission/{id}', methods: ['DELETE'])]
    #[IsGranted('ROLE_PROF')]
    public function deleteSubmission(AssignmentSubmission $submission, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($submission);
        $em->flush();
        
        return $this->json(['message' => 'Submission deleted successfully']);
    }

    #[Route('/course/{courseId}', methods: ['GET'])]
    public function getByCourse(int $courseId, EntityManagerInterface $em): JsonResponse
    {
        $course = $em->getRepository(Course::class)->find($courseId);
        
        if (!$course) {
            return $this->json(['error' => 'Course not found'], 404);
        }
        
        $assignments = $em->getRepository(Assignment::class)->findBy([
            'course' => $course
        ]);
        
        return $this->json($assignments, 200, [], ['groups' => 'assignment:read']);
    }

    #[Route('/submission/{id}/resubmit', methods: ['POST'])]
    #[IsGranted('ROLE_ETUDIANT')]
    public function resubmit(AssignmentSubmission $submission, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        // Vérifier que l'utilisateur est le propriétaire
        if ($submission->getStudent() !== $this->getUser()) {
            return $this->json(['error' => 'Accès non autorisé'], 403);
        }
        
        // Vérifier si le devoir est encore ouvert
        $assignment = $submission->getAssignment();
        if ($assignment->getStatus() !== 'published') {
            return $this->json(['error' => 'Ce devoir n\'est plus ouvert'], 400);
        }
        
        // Mettre à jour la soumission
        if (isset($data['content'])) {
            $submission->setContent($data['content']);
        }
        if (isset($data['file'])) {
            $submission->setFile($data['file']);
        }
        
        $submission->setSubmittedAt(new \DateTime());
        $submission->setGrade(null);
        $submission->setFeedback(null);
        $submission->setGradedAt(null);
        $submission->setGradedBy(null);
        
        // Vérifier si c'est en retard
        $now = new \DateTime();
        if ($assignment->getDeadline() < $now) {
            $submission->setStatus('late');
        } else {
            $submission->setStatus('pending');
        }
        
        $em->flush();
        
        return $this->json([
            'message' => 'Devoir resoumis avec succès',
            'submission' => $submission
        ], 200, [], ['groups' => 'submission:read']);
    }

    #[Route('/stats', methods: ['GET'])]
    #[IsGranted('ROLE_PROF')]
    public function getStats(EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        
        // Récupérer tous les devoirs du professeur
        $courses = $em->getRepository(Course::class)->findBy(['professor' => $user]);
        $courseIds = array_map(fn($c) => $c->getId(), $courses);
        
        $assignments = $em->getRepository(Assignment::class)->createQueryBuilder('a')
            ->where('a.course IN (:courseIds)')
            ->setParameter('courseIds', $courseIds)
            ->getQuery()
            ->getResult();
        
        $totalAssignments = count($assignments);
        $totalSubmissions = 0;
        $totalGraded = 0;
        $averageGrade = 0;
        $totalGrades = 0;
        
        foreach ($assignments as $assignment) {
            $submissions = $assignment->getSubmissions();
            $totalSubmissions += $submissions->count();
            
            foreach ($submissions as $submission) {
                if ($submission->getGrade() !== null) {
                    $totalGraded++;
                    $totalGrades += $submission->getGrade();
                }
            }
        }
        
        if ($totalGraded > 0) {
            $averageGrade = $totalGrades / $totalGraded;
        }
        
        return $this->json([
            'total_assignments' => $totalAssignments,
            'total_submissions' => $totalSubmissions,
            'total_graded' => $totalGraded,
            'pending_grading' => $totalSubmissions - $totalGraded,
            'average_grade' => round($averageGrade, 2),
            'submission_rate' => $totalAssignments > 0 ? round(($totalSubmissions / ($totalAssignments * count($courses))) * 100, 1) : 0
        ]);
    }
}