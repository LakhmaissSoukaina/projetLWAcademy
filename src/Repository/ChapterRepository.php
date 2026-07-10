<?php
// src/Repository/ChapterRepository.php

namespace App\Repository;

use App\Entity\Chapter;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class ChapterRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Chapter::class);
    }

    public function findByCourseOrdered(int $courseId): array
    {
        return $this->createQueryBuilder('c')
            ->where('c.course = :courseId')
            ->setParameter('courseId', $courseId)
            ->orderBy('c.number', 'ASC')
            ->getQuery()
            ->getResult();
    }
}