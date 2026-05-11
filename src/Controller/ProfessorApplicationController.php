<?php
// src/Controller/ProfessorApplicationController.php

namespace App\Controller;

use App\Entity\ProfessorApplication;
use App\Entity\User;
use App\Repository\ProfessorApplicationRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api')]
class ProfessorApplicationController extends AbstractController
{
    #[Route('/auth/professor-application', name: 'professor_application_submit', methods: ['POST'])]
    public function submitApplication(Request $request, EntityManagerInterface $em): JsonResponse
    {
                error_log("=== ProfessorApplicationController submitApplication called ===");
        error_log("Request content: " . $request->getContent());
        $data = json_decode($request->getContent(), true);

        // Validation des champs obligatoires
        if (!isset($data['nom']) || !isset($data['prenom']) || !isset($data['email'])) {
            return $this->json(['error' => 'Nom, prénom et email sont requis'], 400);
        }

        // Validation email
        if (!filter_var($data['email'], FILTER_VALIDATE_EMAIL)) {
            return $this->json(['error' => 'Email invalide'], 400);
        }

        // Vérifier si l'email existe déjà dans User
        $existingUser = $em->getRepository(User::class)->findOneBy(['email' => $data['email']]);
        if ($existingUser) {
            return $this->json(['error' => 'Un compte existe déjà avec cet email'], 400);
        }

        // Vérifier si une candidature est déjà en attente
        $existingApplication = $em->getRepository(ProfessorApplication::class)->findOneBy([
            'email' => $data['email'],
            'status' => 'pending'
        ]);
        if ($existingApplication) {
            return $this->json(['error' => 'Vous avez déjà une candidature en attente'], 400);
        }

        $application = new ProfessorApplication();
        $application->setNom($data['nom']);
        $application->setPrenom($data['prenom']);
        $application->setEmail($data['email']);
        $application->setPhone($data['phone'] ?? null);
        $application->setDiploma($data['diploma'] ?? null);
        $application->setExperience($data['experience'] ?? null);
        $application->setStatus('pending');

        $em->persist($application);
        $em->flush();

        // TODO: Envoyer une notification email à l'admin

        return $this->json([
            'success' => true,
            'message' => 'Votre candidature a été envoyée. Vous serez notifié une fois approuvée.',
            'application_id' => $application->getId()
        ], 201);
    }

    #[Route('/admin/professor-applications', name: 'admin_professor_applications_list', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function getApplications(ProfessorApplicationRepository $repository): JsonResponse
    {
        $applications = $repository->findPending();
        
        return $this->json(array_map(function($app) {
            return [
                'id' => $app->getId(),
                'nom' => $app->getNom(),
                'prenom' => $app->getPrenom(),
                'nomComplet' => $app->getPrenom() . ' ' . $app->getNom(),
                'email' => $app->getEmail(),
                'phone' => $app->getPhone(),
                'diploma' => $app->getDiploma(),
                'experience' => $app->getExperience(),
                'status' => $app->getStatus(),
                'createdAt' => $app->getCreatedAt()->format('Y-m-d H:i:s'),
                'createdAtFormatted' => $app->getCreatedAt()->format('d/m/Y H:i')
            ];
        }, $applications));
    }

    #[Route('/admin/professor-applications/all', name: 'admin_professor_applications_all', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function getAllApplications(ProfessorApplicationRepository $repository): JsonResponse
    {
        $pending = $repository->findPending();
        $approved = $repository->findApproved();
        $rejected = $repository->findRejected();
        
        return $this->json([
            'pending' => array_map(function($app) {
                return [
                    'id' => $app->getId(),
                    'nomComplet' => $app->getPrenom() . ' ' . $app->getNom(),
                    'email' => $app->getEmail(),
                    'createdAt' => $app->getCreatedAt()->format('d/m/Y H:i'),
                    'status' => $app->getStatus()
                ];
            }, $pending),
            'approved' => array_map(function($app) {
                return [
                    'id' => $app->getId(),
                    'nomComplet' => $app->getPrenom() . ' ' . $app->getNom(),
                    'email' => $app->getEmail(),
                    'processedAt' => $app->getProcessedAt()?->format('d/m/Y H:i'),
                    'status' => $app->getStatus()
                ];
            }, $approved),
            'rejected' => array_map(function($app) {
                return [
                    'id' => $app->getId(),
                    'nomComplet' => $app->getPrenom() . ' ' . $app->getNom(),
                    'email' => $app->getEmail(),
                    'processedAt' => $app->getProcessedAt()?->format('d/m/Y H:i'),
                    'status' => $app->getStatus()
                ];
            }, $rejected)
        ]);
    }

    #[Route('/admin/professor-applications/{id}/approve', name: 'admin_approve_application', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function approveApplication(int $id, Request $request, EntityManagerInterface $em, UserPasswordHasherInterface $passwordHasher): JsonResponse
    {
        $application = $em->getRepository(ProfessorApplication::class)->find($id);
        
        if (!$application) {
            return $this->json(['error' => 'Candidature non trouvée'], 404);
        }

        if ($application->getStatus() !== 'pending') {
            return $this->json(['error' => 'Cette candidature a déjà été traitée'], 400);
        }

        $data = json_decode($request->getContent(), true);
        $adminNotes = $data['adminNotes'] ?? null;

        // Générer un mot de passe temporaire
        $tempPassword = substr(bin2hex(random_bytes(8)), 0, 10);
        
        // Créer l'utilisateur professeur
        $user = new User();
        $user->setEmail($application->getEmail());
        $user->setNom($application->getNom());
        $user->setPrenom($application->getPrenom());
        $user->setRoles(['ROLE_PROF', 'ROLE_USER']);
        $user->setIsVerified(true);
        $user->setPassword($passwordHasher->hashPassword($user, $tempPassword));
        
        $em->persist($user);
        
        // Mettre à jour la candidature
        $application->setStatus('approved');
        $application->setProcessedAt(new \DateTimeImmutable());
        $application->setProcessedBy($this->getUser());
        $application->setAdminNotes($adminNotes);
        
        $em->flush();

        // TODO: Envoyer un email au professeur avec ses identifiants
        // mail($application->getEmail(), "Compte professeur approuvé", "Votre compte a été créé. Mot de passe temporaire: " . $tempPassword);

        return $this->json([
            'success' => true,
            'message' => 'Professeur approuvé avec succès.',
            'temp_password' => $tempPassword
        ]);
    }

    #[Route('/admin/professor-applications/{id}/reject', name: 'admin_reject_application', methods: ['POST'])]
    #[IsGranted('ROLE_ADMIN')]
    public function rejectApplication(int $id, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $application = $em->getRepository(ProfessorApplication::class)->find($id);
        
        if (!$application) {
            return $this->json(['error' => 'Candidature non trouvée'], 404);
        }

        if ($application->getStatus() !== 'pending') {
            return $this->json(['error' => 'Cette candidature a déjà été traitée'], 400);
        }

        $data = json_decode($request->getContent(), true);
        $rejectionReason = $data['reason'] ?? null;

        $application->setStatus('rejected');
        $application->setProcessedAt(new \DateTimeImmutable());
        $application->setProcessedBy($this->getUser());
        $application->setAdminNotes($rejectionReason);
        
        $em->flush();

        // TODO: Envoyer un email de rejet au candidat

        return $this->json([
            'success' => true,
            'message' => 'Candidature rejetée'
        ]);
    }

    #[Route('/admin/professor-applications/{id}', name: 'admin_get_application', methods: ['GET'])]
    #[IsGranted('ROLE_ADMIN')]
    public function getApplication(int $id, EntityManagerInterface $em): JsonResponse
    {
        $application = $em->getRepository(ProfessorApplication::class)->find($id);
        
        if (!$application) {
            return $this->json(['error' => 'Candidature non trouvée'], 404);
        }

        return $this->json([
            'id' => $application->getId(),
            'nom' => $application->getNom(),
            'prenom' => $application->getPrenom(),
            'nomComplet' => $application->getPrenom() . ' ' . $application->getNom(),
            'email' => $application->getEmail(),
            'phone' => $application->getPhone(),
            'diploma' => $application->getDiploma(),
            'experience' => $application->getExperience(),
            'status' => $application->getStatus(),
            'createdAt' => $application->getCreatedAt()->format('Y-m-d H:i:s'),
            'adminNotes' => $application->getAdminNotes()
        ]);
    }
}