<?php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        // 1. Administrateur
        $admin = new User();
        $admin->setEmail('admin@wcentre.com');
        $admin->setPassword($this->passwordHasher->hashPassword($admin, 'admin123'));
        $admin->setRoles(['ROLE_ADMIN']);
        $admin->setNom('Admin');
        $admin->setPrenom('Global');
        $admin->setIsVerified(true);
        $manager->persist($admin);

        // 2. Professeur
        $prof = new User();
        $prof->setEmail('prof@wcentre.com');
        $prof->setPassword($this->passwordHasher->hashPassword($prof, 'prof123'));
        $prof->setRoles(['ROLE_PROF']);
        $prof->setNom('Prof');
        $prof->setPrenom('Test');
        $prof->setIsVerified(true);
        $manager->persist($prof);

        // 3. Étudiant simple
        $etudiant = new User();
        $etudiant->setEmail('etudiant@wcentre.com');
        $etudiant->setPassword($this->passwordHasher->hashPassword($etudiant, 'etud123'));
        $etudiant->setRoles(['ROLE_ETUDIANT']);
        $etudiant->setNom('Dupont');
        $etudiant->setPrenom('Jean');
        $etudiant->setIsVerified(true);
        $manager->persist($etudiant);

        // 4. Tuteur (étudiant + rôle tuteur)
        $tuteur = new User();
        $tuteur->setEmail('tuteur@wcentre.com');
        $tuteur->setPassword($this->passwordHasher->hashPassword($tuteur, 'tuteur123'));
        $tuteur->setRoles(['ROLE_ETUDIANT', 'ROLE_TUTEUR']);
        $tuteur->setNom('Tuteur');
        $tuteur->setPrenom('Expert');
        $tuteur->setIsVerified(true);
        $manager->persist($tuteur);

        $manager->flush();
    }
}