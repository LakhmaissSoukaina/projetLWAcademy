<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\Security\Core\Exception\UnsupportedUserException;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\PasswordUpgraderInterface;

/**
 * @extends ServiceEntityRepository<User>
 */
class UserRepository extends ServiceEntityRepository implements PasswordUpgraderInterface
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    /**
     * Used to upgrade (rehash) the user's password automatically over time.
     */
    public function upgradePassword(PasswordAuthenticatedUserInterface $user, string $newHashedPassword): void
    {
        if (!$user instanceof User) {
            throw new UnsupportedUserException(sprintf('Instances of "%s" are not supported.', $user::class));
        }

        $user->setPassword($newHashedPassword);
        $this->getEntityManager()->persist($user);
        $this->getEntityManager()->flush();
    }

    /**
     * Trouve les utilisateurs par rôle
     */
    public function findByRole(string $role): array
    {
        $qb = $this->createQueryBuilder('u')
            ->where('u.roles LIKE :role')
            ->setParameter('role', '%' . $role . '%');
        
        return $qb->getQuery()->getResult();
    }

    /**
     * Compte les utilisateurs par rôle
     */
    public function countByRole(string $role): int
    {
        $qb = $this->createQueryBuilder('u')
            ->select('COUNT(u.id)')
            ->where('u.roles LIKE :role')
            ->setParameter('role', '%' . $role . '%');
        
        return (int) $qb->getQuery()->getSingleScalarResult();
    }

    /**
     * Trouve les étudiants d'un professeur spécifique
     */
    public function findStudentsByProfessor(User $professor): array
    {
        $qb = $this->createQueryBuilder('u')
            ->innerJoin('u.studentSessions', 's')
            ->innerJoin('s.course', 'c')
            ->where('c.professor = :professor')
            ->setParameter('professor', $professor)
            ->distinct();
        
        return $qb->getQuery()->getResult();
    }

    /**
     * Trouve les étudiants avec progression faible
     */
    public function findStrugglingStudents(float $threshold = 50): array
    {
        $allStudents = $this->findByRole('ROLE_ETUDIANT');
        
        return array_filter($allStudents, function($student) use ($threshold) {
            return $student->getOverallProgress() < $threshold;
        });
    }

    /**
     * Trouve les étudiants par cours
     */
    public function findStudentsByCourse(int $courseId): array
    {
        $qb = $this->createQueryBuilder('u')
            ->innerJoin('u.studentSessions', 's')
            ->innerJoin('s.course', 'c')
            ->where('c.id = :courseId')
            ->setParameter('courseId', $courseId)
            ->distinct();
        
        return $qb->getQuery()->getResult();
    }

    //    /**
    //     * @return User[] Returns an array of User objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('u')
    //            ->andWhere('u.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('u.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?User
    //    {
    //        return $this->createQueryBuilder('u')
    //            ->andWhere('u.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }
}