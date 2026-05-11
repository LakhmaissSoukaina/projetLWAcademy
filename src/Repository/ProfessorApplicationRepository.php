<?php
// src/Repository/ProfessorApplicationRepository.php

namespace App\Repository;

use App\Entity\ProfessorApplication;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class ProfessorApplicationRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ProfessorApplication::class);
    }

    public function findPending(): array
    {
        return $this->createQueryBuilder('p')
            ->where('p.status = :status')
            ->setParameter('status', 'pending')
            ->orderBy('p.createdAt', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findApproved(): array
    {
        return $this->createQueryBuilder('p')
            ->where('p.status = :status')
            ->setParameter('status', 'approved')
            ->orderBy('p.processedAt', 'DESC')
            ->getQuery()
            ->getResult();
    }

    public function findRejected(): array
    {
        return $this->createQueryBuilder('p')
            ->where('p.status = :status')
            ->setParameter('status', 'rejected')
            ->orderBy('p.processedAt', 'DESC')
            ->getQuery()
            ->getResult();
    }
}