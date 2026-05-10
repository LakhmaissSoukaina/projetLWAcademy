<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\AISuggestion;
use App\Service\AIService;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/ai')]
class AIController extends AbstractController
{
    #[Route('/report/student/{id}', methods: ['GET'])]
    #[IsGranted('ROLE_PROF')]
    public function studentReport(int $id, EntityManagerInterface $em, AIService $ai): JsonResponse
    {
        $student = $em->getRepository(User::class)->find($id);
        
        if (!$student || !$student->isStudent()) {
            return $this->json(['error' => 'Étudiant non trouvé'], 404);
        }
        
        try {
            $report = $ai->generateStudentReport($student);
            
            // Sauvegarder la suggestion
            $suggestion = new AISuggestion();
            $suggestion->setUser($this->getUser());
            $suggestion->setType('student_report');
            $suggestion->setContent($report['report']);
            $suggestion->setContext(['student_id' => $student->getId()]);
            
            $em->persist($suggestion);
            $em->flush();
            
            return $this->json($report);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Erreur IA: ' . $e->getMessage()], 500);
        }
    }
    
    #[Route('/study-plan', methods: ['GET'])]
    #[IsGranted('ROLE_ETUDIANT')]
    public function studyPlan(AIService $ai, EntityManagerInterface $em): JsonResponse
    {
        $student = $this->getUser();
        
        try {
            $plan = $ai->generateStudyPlan($student);
            
            // Sauvegarder la suggestion
            $suggestion = new AISuggestion();
            $suggestion->setUser($student);
            $suggestion->setType('study_plan');
            $suggestion->setContent($plan['study_plan']);
            $suggestion->setContext(['plan' => $plan]);
            
            $em->persist($suggestion);
            $em->flush();
            
            return $this->json($plan);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Erreur IA: ' . $e->getMessage()], 500);
        }
    }
    
    #[Route('/report/global', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function globalReport(EntityManagerInterface $em, AIService $ai): JsonResponse
    {
        $students = $em->getRepository(User::class)->findByRole('ROLE_ETUDIANT');
        
        if (empty($students)) {
            return $this->json(['error' => 'Aucun étudiant trouvé'], 404);
        }
        
        try {
            $report = $ai->generateGlobalReport($students);
            
            // Sauvegarder la suggestion
            $suggestion = new AISuggestion();
            $suggestion->setUser($this->getUser());
            $suggestion->setType('global_report');
            $suggestion->setContent($report['analysis']);
            $suggestion->setContext(['statistics' => $report['statistics']]);
            
            $em->persist($suggestion);
            $em->flush();
            
            return $this->json($report);
        } catch (\Exception $e) {
            return $this->json(['error' => 'Erreur IA: ' . $e->getMessage()], 500);
        }
    }

    #[Route('/suggestions', methods: ['GET'])]
    public function getSuggestions(EntityManagerInterface $em): JsonResponse
    {
        $user = $this->getUser();
        
        $suggestions = $em->getRepository(AISuggestion::class)->findBy(
            ['user' => $user],
            ['generatedAt' => 'DESC'],
            20
        );
        
        return $this->json($suggestions);
    }

    #[Route('/suggestions/{id}', methods: ['GET'])]
    public function getSuggestion(AISuggestion $suggestion): JsonResponse
    {
        if ($suggestion->getUser() !== $this->getUser() && !$this->getUser()->isAdmin()) {
            return $this->json(['error' => 'Accès non autorisé'], 403);
        }
        
        return $this->json($suggestion);
    }

    #[Route('/quick-report', methods: ['GET'])]
    #[IsGranted('ROLE_ETUDIANT')]
    public function quickReport(AIService $ai): JsonResponse
    {
        $student = $this->getUser();
        
        $data = [
            'quiz_average' => $student->getQuizAverage(),
            'assignment_average' => $student->getAssignmentAverage(),
            'progress' => $student->getOverallProgress(),
            'completed_quizzes' => $student->getTotalCompletedQuizzes(),
            'best_quiz_score' => $student->getBestQuizScore(),
            'best_assignment_grade' => $student->getBestAssignmentGrade()
        ];
        
        return $this->json($data);
    }
}