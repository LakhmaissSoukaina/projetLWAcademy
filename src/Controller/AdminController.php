<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/admin')]
#[IsGranted('ROLE_ADMIN')]
class AdminController extends AbstractController
{
    // 🔵 LIST USERS (API JSON)
    #[Route('/users', name: 'api_admin_users', methods: ['GET'])]
    public function listUsers(EntityManagerInterface $em): JsonResponse
    {
        $users = $em->getRepository(User::class)->findAll();

        $data = [];

        foreach ($users as $user) {
            $data[] = [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'nom' => $user->getNom(),
                'prenom' => $user->getPrenom(),
                'roles' => $user->getRoles(),
            ];
        }

        return $this->json($data);
    }

    // 🔵 UPDATE USER ROLES (API JSON)
    #[Route('/user/{id}/roles', name: 'api_admin_edit_roles', methods: ['PUT'])]
    public function editRoles(User $user, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $roles = $data['roles'] ?? [];

        // 🔒 sécurité métier : tuteur = étudiant obligatoire
        if (in_array('ROLE_TUTEUR', $roles) && !in_array('ROLE_ETUDIANT', $roles)) {
            $roles[] = 'ROLE_ETUDIANT';
        }

        $user->setRoles($roles);

        $em->flush();

        return $this->json([
            'message' => 'Rôles mis à jour avec succès',
            'user' => [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'roles' => $user->getRoles(),
            ]
        ]);
    }
}