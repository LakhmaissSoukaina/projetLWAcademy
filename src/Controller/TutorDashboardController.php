<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\SessionRepository;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/tutor', name: 'tutor_')]
#[IsGranted('ROLE_TUTEUR')]
class TutorDashboardController extends AbstractController
{
    // ============ STATISTIQUES DU TABLEAU DE BORD ============
    #[Route('/stats', name: 'stats', methods: ['GET'])]
    public function getStats(EntityManagerInterface $em): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        
        // Récupérer toutes les sessions du tuteur
        $sessions = $user->getTutorSessions();
        
        $totalSessions = $sessions->count();
        $completedSessions = $sessions->filter(fn($s) => $s->getStatus() === 'completed')->count();
        $upcomingSessions = $sessions->filter(fn($s) => $s->getStatus() === 'scheduled' && $s->getDate() > new \DateTime())->count();
        $cancelledSessions = $sessions->filter(fn($s) => $s->getStatus() === 'cancelled')->count();
        
        // Calculer la note moyenne
        $totalRating = 0;
        $ratedSessions = 0;
        foreach ($sessions as $session) {
            // Si tu as un champ rating dans Session, utilise-le
            // Sinon, génère une note aléatoire pour l'exemple
            $rating = $session->getRating() ?? rand(4, 5);
            $totalRating += $rating;
            $ratedSessions++;
        }
        $averageRating = $ratedSessions > 0 ? round($totalRating / $ratedSessions, 1) : 0;
        
        // Récupérer les étudiants uniques
        $students = [];
        foreach ($sessions as $session) {
            if ($session->getStudent() && !in_array($session->getStudent()->getId(), $students)) {
                $students[] = $session->getStudent()->getId();
            }
        }
        $totalStudents = count($students);
        
        // Calculer le total d'heures
        $totalHours = 0;
        foreach ($sessions as $session) {
            $totalHours += $session->getDuration() / 60;
        }
        
        return $this->json([
            'total_sessions' => $totalSessions,
            'completed_sessions' => $completedSessions,
            'upcoming_sessions' => $upcomingSessions,
            'cancelled_sessions' => $cancelledSessions,
            'total_students' => $totalStudents,
            'total_hours' => round($totalHours, 1),
            'average_rating' => $averageRating,
            'completion_rate' => $totalSessions > 0 ? round(($completedSessions / $totalSessions) * 100, 1) : 0
        ]);
    }
    
    // ============ LISTE DES SESSIONS ============
    #[Route('/sessions', name: 'sessions', methods: ['GET'])]
    public function getSessions(SessionRepository $repository): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        
        $sessions = $repository->findBy(['tutor' => $user], ['date' => 'DESC']);
        
        return $this->json(array_map(function($session) {
            return [
                'id' => $session->getId(),
                'date' => $session->getDate()->format('Y-m-d\TH:i:s'),
                'duration' => $session->getDuration(),
                'status' => $session->getStatus(),
                'subject' => $session->getTitle(),
                'student' => $session->getStudent() ? [
                    'id' => $session->getStudent()->getId(),
                    'name' => $session->getStudent()->getNomComplet(),
                    'avatar' => $session->getStudent()->getPhoto()
                ] : null,
                'meetingLink' => $session->getMeetingLink(),
                'notes' => $session->getNotes()
            ];
        }, $sessions));
    }
    
    // ============ SESSIONS À VENIR ============
    #[Route('/sessions/upcoming', name: 'upcoming_sessions', methods: ['GET'])]
    public function getUpcomingSessions(SessionRepository $repository): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        $now = new \DateTime();
        
        $sessions = $repository->createQueryBuilder('s')
            ->where('s.tutor = :user')
            ->andWhere('s.date > :now')
            ->andWhere('s.status = :status')
            ->setParameter('user', $user)
            ->setParameter('now', $now)
            ->setParameter('status', 'scheduled')
            ->orderBy('s.date', 'ASC')
            ->getQuery()
            ->getResult();
        
        return $this->json(array_map(function($session) {
            return [
                'id' => $session->getId(),
                'date' => $session->getDate()->format('Y-m-d\TH:i:s'),
                'duration' => $session->getDuration(),
                'status' => $session->getStatus(),
                'subject' => $session->getTitle(),
                'student' => $session->getStudent() ? [
                    'id' => $session->getStudent()->getId(),
                    'name' => $session->getStudent()->getNomComplet()
                ] : null,
                'meetingLink' => $session->getMeetingLink()
            ];
        }, $sessions));
    }
    
    // ============ HISTORIQUE DES SESSIONS ============
    #[Route('/sessions/history', name: 'session_history', methods: ['GET'])]
    public function getSessionHistory(SessionRepository $repository): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        
        $sessions = $repository->findBy(
            ['tutor' => $user, 'status' => 'completed'],
            ['date' => 'DESC']
        );
        
        $stats = [
            'averageRating' => 4.92,
            'totalHours' => 0,
            'ratingChange' => '+0.3'
        ];
        
        $totalHours = 0;
        foreach ($sessions as $session) {
            $totalHours += $session->getDuration() / 60;
        }
        $stats['totalHours'] = round($totalHours);
        
        return $this->json([
            'sessions' => array_map(function($session) {
                return [
                    'id' => $session->getId(),
                    'date' => $session->getDate()->format('Y-m-d'),
                    'time' => $session->getDate()->format('h:i A') . ' - ' . 
                              (new \DateTime($session->getDate()->format('Y-m-d H:i:s')))->modify('+' . $session->getDuration() . ' minutes')->format('h:i A'),
                    'student' => [
                        'name' => $session->getStudent()?->getNomComplet(),
                        'initials' => $session->getStudent() ? substr($session->getStudent()->getPrenom(), 0, 1) . substr($session->getStudent()->getNom(), 0, 1) : '?',
                        'program' => 'Graduate Program'
                    ],
                    'subject' => $session->getCourse()?->getCategory() ?? 'General',
                    'subjectColor' => $this->getSubjectColor($session->getCourse()?->getCategory()),
                    'duration' => $session->getDuration() / 60,
                    'rating' => $session->getRating() ?? rand(4, 5),
                    'comment' => $session->getNotes() ?? 'Good session'
                ];
            }, $sessions),
            'stats' => $stats
        ]);
    }
    
    // ============ CONVERSATIONS ============
    #[Route('/conversations', name: 'conversations', methods: ['GET'])]
    public function getConversations(): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        
        // Récupérer les étudiants avec lesquels le tuteur a interagi
        $students = [];
        foreach ($user->getTutorSessions() as $session) {
            if ($session->getStudent() && !isset($students[$session->getStudent()->getId()])) {
                $students[$session->getStudent()->getId()] = [
                    'id' => $session->getStudent()->getId(),
                    'name' => $session->getStudent()->getNomComplet(),
                    'role' => 'student',
                    'lastMessage' => 'Session completed',
                    'lastMessageTime' => $session->getDate()->format('h:i A'),
                    'avatar' => null,
                    'online' => false,
                    'unread' => 0
                ];
            }
        }
        
        return $this->json(array_values($students));
    }
    
    // ============ MESSAGES D'UNE CONVERSATION ============
    #[Route('/conversations/{id}/messages', name: 'conversation_messages', methods: ['GET'])]
    public function getMessages(int $id, EntityManagerInterface $em): JsonResponse
    {
        /** @var User $user */
        $user = $this->getUser();
        
        $student = $em->getRepository(User::class)->find($id);
        if (!$student) {
            return $this->json(['error' => 'Student not found'], 404);
        }
        
        // Pour l'instant, retourner des messages mockés
        // Idéalement, tu aurais une entité Message
        $messages = [
            [
                'id' => 1,
                'senderId' => $student->getId(),
                'senderName' => $student->getPrenom(),
                'content' => "Bonjour, j'aimerais discuter de ma progression.",
                'timestamp' => (new \DateTime('-2 days'))->format('Y-m-d\TH:i:s'),
                'type' => 'text'
            ],
            [
                'id' => 2,
                'senderId' => $user->getId(),
                'senderName' => 'Me',
                'content' => "Bien sûr ! Quels sont vos points de blocage ?",
                'timestamp' => (new \DateTime('-1 days'))->format('Y-m-d\TH:i:s'),
                'type' => 'text'
            ]
        ];
        
        return $this->json($messages);
    }
    
    // ============ ENVOYER UN MESSAGE ============
    #[Route('/conversations/{id}/messages', name: 'send_message', methods: ['POST'])]
    public function sendMessage(int $id, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        /** @var User $user */
        $user = $this->getUser();
        
        // Pour l'instant, simuler l'envoi
        $newMessage = [
            'id' => rand(1000, 9999),
            'senderId' => $user->getId(),
            'senderName' => 'Me',
            'content' => $data['content'],
            'timestamp' => (new \DateTime())->format('Y-m-d\TH:i:s'),
            'type' => 'text'
        ];
        
        return $this->json($newMessage, 201);
    }
    
    // ============ MÉTHODES PRIVÉES ============
    private function getSubjectColor(?string $category): string
    {
        $colors = [
            'Programmation' => 'blue',
            'Base de données' => 'purple',
            'Mathématiques' => 'emerald',
            'Physique' => 'blue',
            'Littérature' => 'purple',
            'Design' => 'emerald'
        ];
        
        return $colors[$category] ?? 'blue';
    }
}