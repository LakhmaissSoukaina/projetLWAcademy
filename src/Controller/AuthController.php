<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;

class AuthController extends AbstractController
{
    #[Route('/api/register', methods: ['POST'])]
    public function register(
        Request $request,
        UserPasswordHasherInterface $hasher,
        EntityManagerInterface $em
    ): JsonResponse {

        // 1. récupérer données envoyées par React
        $data = json_decode($request->getContent(), true);

        // 2. vérifier champs obligatoires
        if (!isset($data['email'], $data['password'], $data['nom'], $data['prenom'])) {
            return $this->json([
                'error' => 'Champs manquants'
            ], 400);
        }

        // 3. vérifier si email existe déjà
        $existingUser = $em->getRepository(User::class)
            ->findOneBy(['email' => $data['email']]);

        if ($existingUser) {
            return $this->json([
                'error' => 'Email déjà utilisé'
            ], 409);
        }

        // 4. créer user
        $user = new User();
        $user->setEmail($data['email']);
        $user->setNom($data['nom']);
        $user->setPrenom($data['prenom']);

        // 5. hash password (IMPORTANT sécurité)
        $user->setPassword(
            $hasher->hashPassword($user, $data['password'])
        );

        // 6. rôle par défaut
        $user->setRoles(['ROLE_ETUDIANT']);

        // 7. sauvegarder en base
        $em->persist($user);
        $em->flush();

        // 8. réponse API
        return $this->json([
            'message' => 'Utilisateur créé avec succès'
        ]);
    }
}