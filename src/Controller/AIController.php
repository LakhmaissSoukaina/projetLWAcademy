<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\AISuggestion;
use App\Service\AIService;
use App\Service\GroqService;
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
    try {
        $user = $this->getUser();
        
        if (!$user) {
            return $this->json(['error' => 'Non authentifie'], 401);
        }
        
        $suggestions = $em->getRepository(AISuggestion::class)->findBy(
            ['user' => $user],
            ['generatedAt' => 'DESC'],
            20
        );
        
        $result = array_map(function($suggestion) {
            return [
                'id' => $suggestion->getId(),
                'type' => $suggestion->getType(),
                'content' => $suggestion->getContent(),
                'generatedAt' => $suggestion->getGeneratedAt()->format('Y-m-d H:i:s')
            ];
        }, $suggestions);
        
        return $this->json($result);
        
    } catch (\Exception $e) {
        return $this->json(['error' => $e->getMessage()], 500);
    }
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

    // ============ RAPPORT PERSONNEL ÉTUDIANT ============
    #[Route('/student/my-report', methods: ['GET'])]
    #[IsGranted('ROLE_ETUDIANT')]
    public function generateMyReport(): JsonResponse
    {
        try {
            $student = $this->getUser();
            
            $report = "**📊 RAPPORT DE PROGRESSION**\n\n";
            $report .= "Étudiant : " . $student->getNomComplet() . "\n";
            $report .= "Progression : " . $student->getOverallProgress() . "%\n";
            $report .= "Moyenne quiz : " . $student->getQuizAverage() . "/100\n\n";
            $report .= "**Points forts :**\n- Bonne progression générale\n- Participation active\n\n";
            $report .= "**Points à améliorer :**\n- Continuer les révisions régulières\n- Participer aux sessions de tutorat\n\n";
            $report .= "**Objectifs :** Atteindre 85% de progression dans 4 semaines";
            
            return $this->json([
                'success' => true,
                'report' => $report,
                'generated_at' => (new \DateTime())->format('Y-m-d H:i:s')
            ]);
        } catch (\Exception $e) {
            return $this->json(['error' => $e->getMessage()], 500);
        }
    }

    // ============ PLAN D'ÉTUDE ============
    // ============ PLAN D'ÉTUDE ==========
#[Route('/student/study-plan-ai', methods: ['POST'])]
#[IsGranted('ROLE_ETUDIANT')]
public function generateStudyPlanAI(): JsonResponse
{
    try {
        $student = $this->getUser();
        
        if (!$student) {
            return $this->json(['error' => 'Non authentifié'], 401);
        }
        
        $progress = $student->getOverallProgress();
        
        $plan = "========================================\n";
        $plan .= "        PLAN D'ETUDE PERSONNALISE        \n";
        $plan .= "========================================\n\n";
        $plan .= "Etudiant : " . $student->getNomComplet() . "\n";
        $plan .= "Progression actuelle : " . $progress . "%\n\n";
        $plan .= "----------------------------------------\n";
        $plan .= "OBJECTIF PRINCIPAL\n";
        $plan .= "----------------------------------------\n";
        
        if ($progress < 50) {
            $plan .= "Consolider les bases fondamentales\n\n";
            $plan .= "Semaine 1 : Revoir les chapitres 1 a 3\n";
            $plan .= "Semaine 2 : Exercices pratiques quotidiens\n";
            $plan .= "Semaine 3 : Sessions de tutorat obligatoires\n";
            $plan .= "Semaine 4 : Preparation examen\n";
        } elseif ($progress < 75) {
            $plan .= "Renforcer la comprehension\n\n";
            $plan .= "Semaine 1 : Revoir les chapitres 4 a 6\n";
            $plan .= "Semaine 2 : Cas pratiques avances\n";
            $plan .= "Semaine 3 : Revision ciblee\n";
            $plan .= "Semaine 4 : Simulations d'examen\n";
        } else {
            $plan .= "Excellence academique\n\n";
            $plan .= "Semaine 1 : Sujets avances\n";
            $plan .= "Semaine 2 : Recherche personnelle\n";
            $plan .= "Semaine 3 : Preparation certification\n";
            $plan .= "Semaine 4 : Revision finale\n";
        }
        
        $plan .= "\n----------------------------------------\n";
        $plan .= "CONSEILS QUOTIDIENS\n";
        $plan .= "----------------------------------------\n";
        $plan .= "- Revisez 30 minutes chaque matin\n";
        $plan .= "- Notez vos questions\n";
        $plan .= "- Participez aux sessions de tutorat\n";
        $plan .= "- Faites tous les quiz proposes\n\n";
        $plan .= "----------------------------------------\n";
        $plan .= "OBJECTIF : Atteindre " . min(100, $progress + 20) . "% de progression\n";
        $plan .= "----------------------------------------\n";
        
        return $this->json([
            'success' => true,
            'study_plan' => $plan,
            'generated_at' => (new \DateTime())->format('Y-m-d H:i:s')
        ]);
        
    } catch (\Exception $e) {
        return $this->json([
            'success' => false,
            'error' => $e->getMessage()
        ], 500);
    }
}
// ============ PROFESSEUR AI REPORTS ============
#[Route('/professor/class-report', methods: ['POST'])]
#[IsGranted('ROLE_PROF')]
public function professorClassReport(EntityManagerInterface $em): JsonResponse
{
    try {
        $professor = $this->getUser();
        
        // Récupérer tous les étudiants du professeur
        $students = $em->getRepository(User::class)->findStudentsByProfessor($professor);
        
        if (empty($students)) {
            return $this->json(['error' => 'Aucun étudiant trouvé'], 404);
        }
        
        // Calculer les statistiques
        $totalStudents = count($students);
        $totalProgress = 0;
        $totalQuiz = 0;
        $studentsAtRisk = 0;
        $topStudents = 0;
        
        foreach ($students as $student) {
            $progress = $student->getOverallProgress();
            $quizAvg = $student->getQuizAverage();
            
            $totalProgress += $progress;
            $totalQuiz += $quizAvg;
            
            if ($progress < 50) $studentsAtRisk++;
            if ($progress >= 85) $topStudents++;
        }
        
        $avgProgress = round($totalProgress / $totalStudents, 1);
        $avgQuiz = round($totalQuiz / $totalStudents, 1);
        
        $report = "========================================\n";
        $report .= "     RAPPORT DE CLASSE IA\n";
        $report .= "========================================\n\n";
        $report .= "Professeur: " . $professor->getNomComplet() . "\n";
        $report .= "Date: " . (new \DateTime())->format('d/m/Y H:i') . "\n\n";
        $report .= "--- STATISTIQUES GLOBALES ---\n";
        $report .= "Total étudiants: " . $totalStudents . "\n";
        $report .= "Progression moyenne: " . $avgProgress . "%\n";
        $report .= "Moyenne quiz: " . $avgQuiz . "/100\n";
        $report .= "Etudiants en difficulte: " . $studentsAtRisk . "\n";
        $report .= "Meilleurs etudiants: " . $topStudents . "\n\n";
        $report .= "--- RECOMMANDATIONS ---\n";
        
        if ($studentsAtRisk > 0) {
            $report .= "- Organiser des sessions de soutien pour les " . $studentsAtRisk . " etudiants en difficulte\n";
        }
        if ($avgProgress < 70) {
            $report .= "- Revoir les concepts cles en cours\n";
            $report .= "- Augmenter la frequence des quiz\n";
        }
        if ($avgProgress >= 70) {
            $report .= "- Maintenir le rythme actuel\n";
            $report .= "- Proposer des exercices avances\n";
        }
        
        $report .= "\n--- PERSPECTIVES ---\n";
        $report .= "Objectif: Atteindre 85% de progression moyenne d'ici 2 mois\n";
        
        return $this->json([
            'success' => true,
            'report' => $report,
            'statistics' => [
                'total_students' => $totalStudents,
                'avg_progress' => $avgProgress,
                'avg_quiz_score' => $avgQuiz,
                'students_at_risk' => $studentsAtRisk,
                'top_students' => $topStudents
            ],
            'generated_at' => (new \DateTime())->format('Y-m-d H:i:s')
        ]);
        
    } catch (\Exception $e) {
        return $this->json(['error' => $e->getMessage()], 500);
    }
}

#[Route('/professor/student-report/{id}', methods: ['POST'])]
#[IsGranted('ROLE_PROF')]
public function professorStudentReport(int $id, EntityManagerInterface $em): JsonResponse
{
    try {
        $student = $em->getRepository(User::class)->find($id);
        
        if (!$student || !$student->isStudent()) {
            return $this->json(['error' => 'Etudiant non trouve'], 404);
        }
        
        $report = "========================================\n";
        $report .= "     RAPPORT INDIVIDUEL IA\n";
        $report .= "========================================\n\n";
        $report .= "Etudiant: " . $student->getNomComplet() . "\n";
        $report .= "Email: " . $student->getEmail() . "\n";
        $report .= "Date: " . (new \DateTime())->format('d/m/Y H:i') . "\n\n";
        $report .= "--- PERFORMANCES ---\n";
        $report .= "Progression globale: " . $student->getOverallProgress() . "%\n";
        $report .= "Moyenne quiz: " . $student->getQuizAverage() . "/100\n";
        $report .= "Moyenne devoirs: " . $student->getAssignmentAverage() . "/20\n";
        $report .= "Quiz completes: " . $student->getTotalCompletedQuizzes() . "\n";
        $report .= "Devoirs rendus: " . $student->getTotalSubmittedAssignments() . "\n\n";
        $report .= "--- ANALYSE ---\n";
        
        $progress = $student->getOverallProgress();
        if ($progress < 50) {
            $report .= "L'etudiant rencontre des difficultes significatives.\n";
            $report .= "Recommandations: Sessions de tutorat obligatoires\n";
        } elseif ($progress < 75) {
            $report .= "Progression correcte mais peut etre amelioree.\n";
            $report .= "Recommandations: Revisions regulieres\n";
        } else {
            $report .= "Excellent travail ! L'etudiant est sur la bonne voie.\n";
            $report .= "Recommandations: Maintenir le rythme\n";
        }
        
        $report .= "\n--- OBJECTIFS ---\n";
        $report .= "- Atteindre " . min(100, $progress + 20) . "% de progression\n";
        $report .= "- Participer aux sessions de tutorat\n";
        
        return $this->json([
            'success' => true,
            'report' => $report,
            'student' => [
                'id' => $student->getId(),
                'name' => $student->getNomComplet(),
                'quiz_average' => $student->getQuizAverage(),
                'overall_progress' => $student->getOverallProgress()
            ],
            'generated_at' => (new \DateTime())->format('Y-m-d H:i:s')
        ]);
        
    } catch (\Exception $e) {
        return $this->json(['error' => $e->getMessage()], 500);
    }
}
}