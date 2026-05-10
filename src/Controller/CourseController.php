<?php

namespace App\Controller;

use App\Entity\Course;
use App\Repository\CourseRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/courses')]
class CourseController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function index(CourseRepository $repository, SerializerInterface $serializer): JsonResponse
    {
        $courses = $repository->findAll();
        return $this->json($courses, 200, [], ['groups' => 'course:read']);
    }

    #[Route('/{id}', methods: ['GET'])]
    public function show(Course $course): JsonResponse
    {
        return $this->json($course, 200, [], ['groups' => 'course:read']);
    }

    #[Route('', methods: ['POST'])]
    #[IsGranted('ROLE_PROF')]
    public function create(Request $request, EntityManagerInterface $em, SerializerInterface $serializer): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $course = $serializer->deserialize(json_encode($data), Course::class, 'json');
        $course->setProfessor($this->getUser());
        
        $em->persist($course);
        $em->flush();
        
        return $this->json($course, 201, [], ['groups' => 'course:read']);
    }

    #[Route('/{id}', methods: ['PUT'])]
    #[IsGranted('ROLE_PROF')]
    public function update(Course $course, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        if (isset($data['title'])) $course->setTitle($data['title']);
        if (isset($data['description'])) $course->setDescription($data['description']);
        if (isset($data['category'])) $course->setCategory($data['category']);
        if (isset($data['level'])) $course->setLevel($data['level']);
        if (isset($data['status'])) $course->setStatus($data['status']);
        
        $em->flush();
        
        return $this->json($course, 200, [], ['groups' => 'course:read']);
    }

    #[Route('/{id}', methods: ['DELETE'])]
    #[IsGranted('ROLE_PROF')]
    public function delete(Course $course, EntityManagerInterface $em): JsonResponse
    {
        $em->remove($course);
        $em->flush();
        
        return $this->json(['message' => 'Course deleted successfully']);
    }
}