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
        $progress = $student->getOverallProgress();
        $quizAvg = $student->getQuizAverage();
        
        $report = "RAPPORT DE PROGRESSION\n\n";
        $report .= "Étudiant : " . $student->getNomComplet() . "\n";
        $report .= "Date : " . (new \DateTime())->format('d/m/Y H:i') . "\n\n";
        
        $report .= "Synthèse des performances :\n";
        $report .= "Votre progression globale est de " . $progress . "% et votre moyenne aux quiz est de " . $quizAvg . "/100.\n\n";
        
        if ($progress >= 70) {
            $report .= "Points forts : Vous avez une excellente progression. Continuez sur cette lancée, vous maîtrisez bien les concepts clés.\n\n";
        } elseif ($progress >= 50) {
            $report .= "Points forts : Vous avez une progression correcte. Votre compréhension des fondamentaux est satisfaisante.\n\n";
        } else {
            $report .= "Points à améliorer : Votre progression nécessite plus d'attention. Il serait bénéfique de revoir les chapitres précédents.\n\n";
        }
        
        $report .= "Recommandations :\n";
        $report .= "- Révisez quotidiennement les chapitres en cours.\n";
        $report .= "- Participez aux sessions de tutorat disponibles.\n";
        $report .= "- Complétez tous les quiz d'auto-évaluation.\n\n";
        
        $report .= "Objectifs : Atteindre un score minimum de 75/100 dans les prochains quiz et augmenter votre progression de 15% d'ici la fin du mois.\n";
        
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
        $progress = $student->getOverallProgress();
        
        $plan = "PLAN D'ETUDE PERSONNALISE\n\n";
        $plan .= "Étudiant : " . $student->getNomComplet() . "\n";
        $plan .= "Progression actuelle : " . $progress . "%\n\n";
        
        $plan .= "Objectif principal : ";
        if ($progress < 50) {
            $plan .= "Consolider les bases fondamentales.\n\n";
            $plan .= "Semaine 1 : Revoir les chapitres 1 à 3.\n";
            $plan .= "Semaine 2 : Effectuer les exercices pratiques quotidiens.\n";
            $plan .= "Semaine 3 : Participer aux sessions de tutorat obligatoires.\n";
            $plan .= "Semaine 4 : Préparer l'examen final.\n\n";
        } elseif ($progress < 75) {
            $plan .= "Renforcer la compréhension des concepts avancés.\n\n";
            $plan .= "Semaine 1 : Revoir les chapitres 4 à 6.\n";
            $plan .= "Semaine 2 : Traiter les cas pratiques avancés.\n";
            $plan .= "Semaine 3 : Effectuer une révision ciblée.\n";
            $plan .= "Semaine 4 : Réaliser des simulations d'examen.\n\n";
        } else {
            $plan .= "Atteindre l'excellence académique.\n\n";
            $plan .= "Semaine 1 : Explorer les sujets avancés.\n";
            $plan .= "Semaine 2 : Mener des recherches personnelles.\n";
            $plan .= "Semaine 3 : Préparer les certifications.\n";
            $plan .= "Semaine 4 : Effectuer une révision finale approfondie.\n\n";
        }
        
        $plan .= "Conseils quotidiens :\n";
        $plan .= "- Révisez 30 minutes chaque matin.\n";
        $plan .= "- Notez vos questions pour les sessions de tutorat.\n";
        $plan .= "- Complétez tous les quiz proposés.\n\n";
        
        $plan .= "Objectif final : Atteindre " . min(100, $progress + 20) . "% de progression d'ici 4 semaines.\n";
        
        return $this->json([
            'success' => true,
            'study_plan' => $plan,
            'generated_at' => (new \DateTime())->format('Y-m-d H:i:s')
        ]);
    } catch (\Exception $e) {
        return $this->json(['error' => $e->getMessage()], 500);
    }
}
// ============ PROFESSEUR AI REPORTS ============
#[Route('/professor/class-report', methods: ['POST'])]
#[IsGranted('ROLE_PROF')]
public function professorClassReport(EntityManagerInterface $em): JsonResponse
{
    try {
        $professor = $this->getUser();
        $students = $em->getRepository(User::class)->findStudentsByProfessor($professor);
        
        if (empty($students)) {
            return $this->json(['error' => 'Aucun étudiant trouvé'], 404);
        }
        
        $totalStudents = count($students);
        $totalProgress = 0;
        $studentsAtRisk = 0;
        
        foreach ($students as $student) {
            $progress = $student->getOverallProgress();
            $totalProgress += $progress;
            if ($progress < 50) $studentsAtRisk++;
        }
        
        $avgProgress = round($totalProgress / $totalStudents, 1);
        
        $report = "RAPPORT DE CLASSE\n\n";
        $report .= "Professeur : " . $professor->getNomComplet() . "\n";
        $report .= "Date : " . (new \DateTime())->format('d/m/Y H:i') . "\n";
        $report .= "Total étudiants : " . $totalStudents . "\n";
        $report .= "Progression moyenne de la classe : " . $avgProgress . "%\n";
        $report .= "Étudiants en difficulté : " . $studentsAtRisk . "\n\n";
        
        if ($avgProgress >= 70) {
            $report .= "Analyse : La classe affiche une très bonne progression globale. Les résultats sont satisfaisants.\n\n";
        } elseif ($avgProgress >= 50) {
            $report .= "Analyse : La classe a une progression correcte mais des efforts supplémentaires sont nécessaires.\n\n";
        } else {
            $report .= "Analyse : La classe rencontre des difficultés significatives. Une attention particulière est requise.\n\n";
        }
        
        $report .= "Recommandations pédagogiques :\n";
        if ($studentsAtRisk > 0) {
            $report .= "- Organiser des sessions de soutien pour les " . $studentsAtRisk . " étudiants en difficulté.\n";
        }
        if ($avgProgress < 70) {
            $report .= "- Revoir les concepts clés en cours collectif.\n";
            $report .= "- Augmenter la fréquence des quiz d'évaluation.\n";
        } else {
            $report .= "- Maintenir le rythme actuel.\n";
            $report .= "- Proposer des exercices avancés pour les meilleurs étudiants.\n";
        }
        
        $report .= "\nObjectif : Atteindre 85% de progression moyenne d'ici 2 mois.\n";
        
        return $this->json([
            'success' => true,
            'report' => $report,
            'statistics' => [
                'total_students' => $totalStudents,
                'avg_progress' => $avgProgress,
                'students_at_risk' => $studentsAtRisk
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
            return $this->json(['error' => 'Étudiant non trouvé'], 404);
        }
        
        $progress = $student->getOverallProgress();
        $quizAvg = $student->getQuizAverage();
        
        $report = "RAPPORT INDIVIDUEL\n\n";
        $report .= "Étudiant : " . $student->getNomComplet() . "\n";
        $report .= "Email : " . $student->getEmail() . "\n";
        $report .= "Date : " . (new \DateTime())->format('d/m/Y H:i') . "\n\n";
        $report .= "Progression globale : " . $progress . "%\n";
        $report .= "Moyenne aux quiz : " . $quizAvg . "/100\n\n";
        
        if ($progress < 50) {
            $report .= "Analyse : L'étudiant rencontre des difficultés significatives dans son apprentissage.\n";
            $report .= "Recommandations : Mettre en place des sessions de tutorat obligatoires et un suivi personnalisé.\n\n";
        } elseif ($progress < 75) {
            $report .= "Analyse : La progression de l'étudiant est correcte mais peut être améliorée.\n";
            $report .= "Recommandations : Encourager des révisions régulières et la participation aux sessions de tutorat.\n\n";
        } else {
            $report .= "Analyse : Excellent travail ! L'étudiant est sur la bonne voie et maîtrise bien les concepts.\n";
            $report .= "Recommandations : Maintenir le rythme actuel et proposer des défis supplémentaires.\n\n";
        }
        
        $report .= "Objectifs :\n";
        $report .= "- Atteindre " . min(100, $progress + 20) . "% de progression globale.\n";
        $report .= "- Participer aux sessions de tutorat.\n";
        $report .= "- Compléter tous les quiz et devoirs restants.\n";
        
        return $this->json([
            'success' => true,
            'report' => $report,
            'student' => [
                'id' => $student->getId(),
                'name' => $student->getNomComplet(),
                'quiz_average' => $quizAvg,
                'overall_progress' => $progress
            ],
            'generated_at' => (new \DateTime())->format('Y-m-d H:i:s')
        ]);
    } catch (\Exception $e) {
        return $this->json(['error' => $e->getMessage()], 500);
    }
}
}