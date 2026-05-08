<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;  // ← AJOUTE CETTE LIGNE
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class ApiController extends AbstractController  // ← AJOUTE "extends AbstractController"
{
    #[Route('/api/hello', name: 'api_hello', methods: ['GET'])]
    public function hello(): JsonResponse
    {
        return $this->json([  // ← Maintenant $this->json() fonctionne
            'message' => 'Hello from Symfony!',
            'status' => 'API is working perfectly!'
        ]);
    }
}