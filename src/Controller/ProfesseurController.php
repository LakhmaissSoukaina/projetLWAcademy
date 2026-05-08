<?php

namespace App\Controller;

use App\Entity\Chapitre;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/professeur', name: 'prof_')]
#[IsGranted('ROLE_PROF')]
class ProfesseurController extends AbstractController
{
    #[Route('/promote-tuteur/{etudiant}/{chapitre}', name: 'promote_tuteur')]
    public function promoteTuteur(User $etudiant, EntityManagerInterface $em): Response
    {
        return $this->redirectToRoute('admin_users'); // redirection temporaire
    }
}