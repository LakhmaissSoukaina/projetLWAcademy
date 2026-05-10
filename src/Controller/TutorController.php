<?php

namespace App\Controller;

use App\Entity\User;
use App\Entity\Session;
use App\Entity\Course;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/student/tutors', name: 'tutor_')]
#[IsGranted('ROLE_ETUDIANT')]
class TutorController extends AbstractController
{
    private UserRepository $userRepository;

    public function __construct(UserRepository $userRepository)
    {
        $this->userRepository = $userRepository;
    }

    // ============ LISTE DES TUTEURS DISPONIBLES ==========
    #[Route('', name: 'available', methods: ['GET'])]
    public function getAvailableTutors(EntityManagerInterface $em): JsonResponse
    {
        // Récupérer tous les tuteurs (ROLE_PROF et ROLE_TUTEUR)
        $profTutors = $this->userRepository->findByRole('ROLE_PROF');
        $tuteurTutors = $this->userRepository->findByRole('ROLE_TUTEUR');
        
        // Fusionner les deux tableaux sans doublons
        $allTutors = array_merge($profTutors, $tuteurTutors);
        $uniqueTutors = [];
        foreach ($allTutors as $tutor) {
            $uniqueTutors[$tutor->getId()] = $tutor;
        }
        $tutors = array_values($uniqueTutors);
        
        // Organiser les tuteurs par matière/chapitre
        $tutorsByChapter = [];
        
        foreach ($tutors as $tutor) {
            // Pour chaque cours du tuteur, l'ajouter à la catégorie correspondante
            foreach ($tutor->getCourses() as $course) {
                $category = $course->getCategory();
                $chapterName = $this->getChapterNameFromCategory($category);
                
                if (!isset($tutorsByChapter[$chapterName])) {
                    $tutorsByChapter[$chapterName] = [];
                }
                
                // Éviter les doublons
                $exists = false;
                foreach ($tutorsByChapter[$chapterName] as $existing) {
                    if ($existing['id'] === $tutor->getId()) {
                        $exists = true;
                        break;
                    }
                }
                
                if (!$exists) {
                    $tutorsByChapter[$chapterName][] = [
                        'id' => $tutor->getId(),
                        'name' => $tutor->getNomComplet(),
                        'role' => $this->getTutorRole($tutor),
                        'rating' => $this->calculateTutorRating($tutor),
                        'price' => $this->getTutorPrice($tutor),
                        'description' => $this->getTutorDescription($tutor, $course),
                        'skills' => $this->getTutorSkills($tutor),
                        'image' => $tutor->getPhoto() ?? 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e',
                        'available' => $this->isTutorAvailable($tutor)
                    ];
                }
            }
        }
        
        // Si aucun tuteur n'est trouvé, retourner les données mockées
        if (empty($tutorsByChapter)) {
            return $this->getMockTutorsData();
        }
        
        return $this->json($tutorsByChapter);
    }

    // ============ TUTEURS ACTIFS ============
    #[Route('/active', name: 'active', methods: ['GET'])]
    public function getActiveTutors(): JsonResponse
    {
        // Récupérer tous les tuteurs (ROLE_PROF et ROLE_TUTEUR)
        $profTutors = $this->userRepository->findByRole('ROLE_PROF');
        $tuteurTutors = $this->userRepository->findByRole('ROLE_TUTEUR');
        
        // Fusionner les deux tableaux sans doublons
        $allTutors = array_merge($profTutors, $tuteurTutors);
        $uniqueTutors = [];
        foreach ($allTutors as $tutor) {
            $uniqueTutors[$tutor->getId()] = $tutor;
        }
        $tutors = array_values($uniqueTutors);
        
        $activeTutors = array_filter($tutors, function($tutor) {
            // Un tuteur est actif s'il a des sessions programmées dans le futur
            $now = new \DateTime();
            foreach ($tutor->getTutorSessions() as $session) {
                if ($session->getDate() > $now && $session->getStatus() === 'scheduled') {
                    return true;
                }
            }
            return false;
        });
        
        $result = [];
        foreach ($activeTutors as $tutor) {
            $result[] = [
                'id' => $tutor->getId(),
                'name' => $tutor->getNomComplet(),
                'email' => $tutor->getEmail(),
                'photo' => $tutor->getPhoto(),
                'next_session' => $this->getNextSessionDate($tutor)
            ];
        }
        
        return $this->json($result);
    }

    // ============ RÉSERVER UNE SESSION ============
    #[Route('/{id}/request', name: 'request', methods: ['POST'])]
    public function requestTutorSession(User $tutor, Request $request, EntityManagerInterface $em): JsonResponse
    {
        // Vérifier si l'utilisateur est professeur ou tuteur
        if (!$tutor->isProfessor() && !$tutor->isTuteur()) {
            return $this->json(['error' => 'Invalid tutor'], 400);
        }
        
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['date']) || !isset($data['time'])) {
            return $this->json(['error' => 'Date and time are required'], 400);
        }
        
        // Combiner date et heure
        $dateTime = new \DateTime($data['date'] . ' ' . $data['time']);
        
        $session = new Session();
        $session->setTitle('Session avec ' . $tutor->getNomComplet());
        $session->setDate($dateTime);
        $session->setDuration(60);
        $session->setTutor($tutor);
        $session->setStudent($this->getUser());
        $session->setStatus('scheduled');
        $session->setNotes($data['message'] ?? null);
        
        $em->persist($session);
        $em->flush();
        
        return $this->json([
            'message' => 'Session requested successfully',
            'session' => [
                'id' => $session->getId(),
                'date' => $session->getDate()->format('Y-m-d H:i:s'),
                'status' => $session->getStatus()
            ]
        ], 201);
    }

    // ============ MÉTHODES PRIVÉES ============
    
    private function getChapterNameFromCategory(string $category): string
    {
        $mapping = [
            'Programmation' => 'Chapter 04: Modern Programming',
            'Base de données' => 'Chapter 05: Database Systems',
            'DevOps' => 'Chapter 06: DevOps & Infrastructure',
            'Design' => 'Chapter 07: UI/UX Design',
            'Littérature' => 'Chapter 08: Comparative Linguistics',
            'Sciences sociales' => 'Chapter 09: Social Sciences',
            'Mathématiques' => 'Chapter 03: Advanced Mathematics',
            'Physique' => 'Chapter 02: Quantum Mechanics',
            'Science' => 'Chapter 01: Natural Sciences'
        ];
        
        return $mapping[$category] ?? 'Chapter 01: General Studies';
    }
    
    private function getTutorRole(User $tutor): string
    {
        $courseCount = $tutor->getCourses()->count();
        $firstCourse = $tutor->getCourses()->first();
        
        if ($tutor->isTuteur()) {
            return 'Academic Tutor, ' . ($firstCourse ? $firstCourse->getCategory() : 'General Studies');
        }
        
        if ($courseCount >= 3) {
            return 'Senior Fellow, ' . ($firstCourse ? $firstCourse->getCategory() : 'Academic Studies');
        } elseif ($courseCount >= 1) {
            return 'Associate Professor, ' . ($firstCourse ? $firstCourse->getCategory() : 'Academic Studies');
        }
        
        return 'Academic Tutor';
    }
    
    private function calculateTutorRating(User $tutor): float
    {
        // Calcul basé sur le nombre de sessions complétées
        $completedSessions = $tutor->getTutorSessions()->filter(
            fn($s) => $s->getStatus() === 'completed'
        )->count();
        
        if ($completedSessions === 0) {
            return 4.5; // Note par défaut
        }
        
        // 4.5 + bonus basé sur le nombre de sessions (max 5.0)
        $rating = 4.5 + min(0.5, $completedSessions / 100);
        return round($rating, 1);
    }
    
    private function getTutorPrice(User $tutor): int
    {
        // Prix basé sur l'expérience (nombre de cours)
        $courseCount = $tutor->getCourses()->count();
        $basePrice = $tutor->isTuteur() ? 70 : 80;
        return $basePrice + ($courseCount * 10);
    }
    
    private function getTutorDescription(User $tutor, Course $course): string
    {
        $sessionCount = $tutor->getTutorSessions()->count();
        $roleText = $tutor->isTuteur() ? 'Tuteur expert' : 'Professeur expert';
        
        return sprintf(
            "%s en %s avec %d années d'expérience dans l'enseignement. 
            Spécialisé dans %s et les concepts avancés. 
            %d sessions de tutorat dispensées avec succès.",
            $roleText,
            $course->getCategory(),
            max(1, floor($sessionCount / 10)),
            $course->getTitle(),
            $sessionCount
        );
    }
    
    private function getTutorSkills(User $tutor): array
    {
        $skills = [];
        foreach ($tutor->getCourses() as $course) {
            $skills[] = $course->getCategory();
        }
        return array_unique($skills);
    }
    
    private function isTutorAvailable(User $tutor): bool
    {
        // Vérifier si le tuteur a des disponibilités dans les 7 prochains jours
        $now = new \DateTime();
        $weekLater = (new \DateTime())->modify('+7 days');
        
        foreach ($tutor->getTutorSessions() as $session) {
            if ($session->getDate() > $now && $session->getDate() < $weekLater && $session->getStatus() === 'scheduled') {
                return true;
            }
        }
        return true; // Par défaut, disponible
    }
    
    private function getNextSessionDate(User $tutor): ?string
    {
        $now = new \DateTime();
        $nearestSession = null;
        
        foreach ($tutor->getTutorSessions() as $session) {
            if ($session->getDate() > $now && $session->getStatus() === 'scheduled') {
                if ($nearestSession === null || $session->getDate() < $nearestSession) {
                    $nearestSession = $session->getDate();
                }
            }
        }
        
        return $nearestSession?->format('Y-m-d H:i:s');
    }
    
    private function getMockTutorsData(): JsonResponse
    {
        // Données mockées pour le développement (si aucun tuteur en base)
        $mockData = [
            "Chapter 04: Quantum Mechanics" => [
                [
                    "id" => 1,
                    "name" => "Dr. Julian Vane",
                    "role" => "Senior Fellow, Physics",
                    "rating" => 4.9,
                    "price" => 120,
                    "description" => "Specializing in the mathematical foundations of non-linear dynamics and quantum field theory.",
                    "skills" => ["Theoretical Physics", "Calculus"],
                    "image" => "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
                    "available" => true
                ],
                [
                    "id" => 2,
                    "name" => "Prof. Elena Moretti",
                    "role" => "Director of Research",
                    "rating" => 5.0,
                    "price" => 145,
                    "description" => "Focused on interactive learning models and multi-dimensional analysis within Chapter 04.",
                    "skills" => ["Quantum Dynamics", "Linear Algebra"],
                    "image" => "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
                    "available" => true
                ]
            ],
            "Chapter 08: Comparative Linguistics" => [
                [
                    "id" => 3,
                    "name" => "Sarah Jenkins",
                    "rating" => 4.8,
                    "description" => "Master of Arts in Comparative Literature, Sorbonne.",
                    "skills" => ["French", "Arabic"],
                    "image" => "https://images.unsplash.com/photo-1580489944761-15a19d654956",
                    "price" => 95,
                    "available" => true,
                    "role" => "Language Specialist"
                ],
                [
                    "id" => 4,
                    "name" => "Marc Dubois",
                    "rating" => 4.9,
                    "description" => "PhD in Phonetics. Specialist in Semitic and Romance language evolution.",
                    "skills" => ["Phonology", "Linguistics"],
                    "image" => "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
                    "price" => 110,
                    "available" => true,
                    "role" => "Linguistics Expert"
                ],
                [
                    "id" => 5,
                    "name" => "Leila Mansour",
                    "rating" => 5.0,
                    "description" => "Expert in Arabic dialectology and classical French poetry.",
                    "skills" => ["Poetry", "Dialects", "Arabic Literature"],
                    "image" => "https://images.unsplash.com/photo-1531123897727-8f129e1688ce",
                    "price" => 130,
                    "available" => true,
                    "role" => "Senior Lecturer"
                ]
            ]
        ];
        
        return $this->json($mockData);
    }
}