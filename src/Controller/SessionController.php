<?php

namespace App\Controller;

use App\Entity\Session;
use App\Entity\Course;
use App\Entity\User;
use App\Repository\SessionRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/sessions')]
class SessionController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function index(SessionRepository $repository): JsonResponse
    {
        $user = $this->getUser();
        
        if ($user->isProfessor()) {
            $sessions = $repository->findBy(['tutor' => $user]);
        } elseif ($user->isStudent()) {
            $sessions = $repository->findBy(['student' => $user]);
        } else {
            $sessions = $repository->findAll();
        }
        
        return $this->json($sessions);
    }

    #[Route('/{id}', methods: ['GET'])]
    public function show(Session $session): JsonResponse
    {
        $user = $this->getUser();
        
        if ($session->getTutor() !== $user && $session->getStudent() !== $user && !$user->isAdmin()) {
            return $this->json(['error' => 'Accès non autorisé'], 403);
        }
        
        return $this->json($session);
    }

    #[Route('', methods: ['POST'])]
    #[IsGranted('ROLE_PROF')]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['title']) || !isset($data['date']) || !isset($data['duration'])) {
            return $this->json(['error' => 'Les champs title, date et duration sont requis'], 400);
        }
        
        $session = new Session();
        $session->setTitle($data['title']);
        $session->setDate(new \DateTime($data['date']));
        $session->setDuration($data['duration']);
        $session->setTutor($this->getUser());
        $session->setStatus($data['status'] ?? 'scheduled');
        $session->setMeetingLink($data['meetingLink'] ?? null);
        $session->setNotes($data['notes'] ?? null);
        
        if (isset($data['student'])) {
            $student = $em->getRepository(User::class)->find($data['student']);
            if ($student) {
                $session->setStudent($student);
            }
        }
        
        if (isset($data['course'])) {
            $course = $em->getRepository(Course::class)->find($data['course']);
            if ($course) {
                $session->setCourse($course);
            }
        }
        
        $em->persist($session);
        $em->flush();
        
        return $this->json($session, 201);
    }

    #[Route('/{id}', methods: ['PUT'])]
    #[IsGranted('ROLE_PROF')]
    public function update(Session $session, Request $request, EntityManagerInterface $em): JsonResponse
    {
        if ($session->getTutor() !== $this->getUser() && !$this->getUser()->isAdmin()) {
            return $this->json(['error' => 'Accès non autorisé'], 403);
        }
        
        $data = json_decode($request->getContent(), true);
        
        if (isset($data['title'])) $session->setTitle($data['title']);
        if (isset($data['date'])) $session->setDate(new \DateTime($data['date']));
        if (isset($data['duration'])) $session->setDuration($data['duration']);
        if (isset($data['status'])) $session->setStatus($data['status']);
        if (isset($data['meetingLink'])) $session->setMeetingLink($data['meetingLink']);
        if (isset($data['notes'])) $session->setNotes($data['notes']);
        
        $em->flush();
        
        return $this->json($session);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    #[IsGranted('ROLE_PROF')]
    public function delete(Session $session, EntityManagerInterface $em): JsonResponse
    {
        if ($session->getTutor() !== $this->getUser() && !$this->getUser()->isAdmin()) {
            return $this->json(['error' => 'Accès non autorisé'], 403);
        }
        
        $em->remove($session);
        $em->flush();
        
        return $this->json(['message' => 'Session deleted successfully']);
    }

    #[Route('/{id}/complete', methods: ['POST'])]
    #[IsGranted('ROLE_PROF')]
    public function complete(Session $session, EntityManagerInterface $em): JsonResponse
    {
        if ($session->getTutor() !== $this->getUser() && !$this->getUser()->isAdmin()) {
            return $this->json(['error' => 'Accès non autorisé'], 403);
        }
        
        $session->setStatus('completed');
        $em->flush();
        
        return $this->json(['message' => 'Session marked as completed']);
    }

    #[Route('/{id}/cancel', methods: ['POST'])]
    #[IsGranted('ROLE_PROF')]
    public function cancel(Session $session, EntityManagerInterface $em): JsonResponse
    {
        if ($session->getTutor() !== $this->getUser() && !$this->getUser()->isAdmin()) {
            return $this->json(['error' => 'Accès non autorisé'], 403);
        }
        
        $session->setStatus('cancelled');
        $em->flush();
        
        return $this->json(['message' => 'Session cancelled']);
    }
}