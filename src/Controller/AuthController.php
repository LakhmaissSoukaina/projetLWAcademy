<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Google\Client as GoogleClient;

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

    // ============ AJOUTER LA MÉTHODE GOOGLE LOGIN ICI ============
    #[Route('/api/login/google', name: 'api_login_google', methods: ['POST'])]
    public function googleLogin(
        Request $request,
        EntityManagerInterface $em,
        JWTTokenManagerInterface $jwtManager
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        $credential = $data['credential'] ?? null;

        if (!$credential) {
            return $this->json(['error' => 'No credential provided'], 400);
        }

        try {
            // Vérifier le token Google
            $client = new GoogleClient();
            $client->setClientId($_ENV['GOOGLE_CLIENT_ID']);
            $payload = $client->verifyIdToken($credential);

            if (!$payload) {
                return $this->json(['error' => 'Invalid Google token'], 400);
            }

            $email = $payload['email'];
            $name = $payload['name'] ?? '';
            $googleId = $payload['sub'];

            // Chercher ou créer l'utilisateur
            $user = $em->getRepository(User::class)->findOneBy(['email' => $email]);

            if (!$user) {
                $user = new User();
                $user->setEmail($email);
                $user->setRoles(['ROLE_ETUDIANT']);
                $user->setIsVerified(true);
                $user->setCreatedAt(new \DateTimeImmutable());

                // Séparer le prénom et nom
                $nameParts = explode(' ', $name, 2);
                $user->setPrenom($nameParts[0] ?? '');
                $user->setNom($nameParts[1] ?? '');

                $em->persist($user);
                $em->flush();
            }

            // Générer le token JWT
            $token = $jwtManager->create($user);

            return $this->json(['token' => $token]);

        } catch (\Exception $e) {
            return $this->json(['error' => 'Authentication failed: ' . $e->getMessage()], 400);
        }
    }
}