<?php
// src/Controller/CourseController.php

namespace App\Controller;

use App\Entity\Course;
use App\Entity\Chapter;
use App\Entity\ChapterContent;
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
    public function index(CourseRepository $repository): JsonResponse
    {
        $courses = $repository->findAll();
        return $this->json($courses, 200, [], ['groups' => 'course:read']);
    }

    #[Route('/{id}', methods: ['GET'])]
    public function show(Course $course): JsonResponse
    {
        // Vérifier si le cours a des chapitres
        $chapters = $course->getChapters();
        
        return $this->json([
            'id' => $course->getId(),
            'title' => $course->getTitle(),
            'description' => $course->getDescription(),
            'category' => $course->getCategory(),
            'level' => $course->getLevel(),
            'status' => $course->getStatus(),
            'professor' => $course->getProfessor()?->getNomComplet(),
            'chapters' => array_map(function($chapter) {
                return [
                    'id' => $chapter->getId(),
                    'number' => $chapter->getNumber(),
                    'title' => $chapter->getTitle(),
                    'contents' => array_map(function($content) {
                        return [
                            'id' => $content->getId(),
                            'title' => $content->getTitle(),
                            'type' => $content->getType(),
                            'filePath' => $content->getFilePath(),
                            'fileSize' => $content->getFileSize(),
                            'duration' => $content->getDuration()
                        ];
                    }, $chapter->getContents()->toArray())
                ];
            }, $chapters->toArray())
        ]);
    }

    #[Route('', methods: ['POST'])]
    #[IsGranted('ROLE_PROF')]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['title']) || !isset($data['category']) || !isset($data['level'])) {
            return $this->json(['error' => 'Title, category and level are required'], 400);
        }
        
        $course = new Course();
        $course->setTitle($data['title']);
        $course->setDescription($data['description'] ?? null);
        $course->setCategory($data['category']);
        $course->setLevel($data['level']);
        $course->setStatus($data['status'] ?? 'draft');
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

    #[Route('/{id}/add-chapter', methods: ['POST'])]
    #[IsGranted('ROLE_PROF')]
    public function addChapter(int $id, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $course = $em->getRepository(Course::class)->find($id);
        
        if (!$course) {
            return $this->json(['error' => 'Course not found'], 404);
        }

        if ($course->getProfessor() !== $this->getUser()) {
            return $this->json(['error' => 'Unauthorized'], 403);
        }

        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['title'])) {
            return $this->json(['error' => 'Chapter title is required'], 400);
        }

        $chapter = new Chapter();
        $chapter->setTitle($data['title']);
        $chapter->setNumber($course->getChapters()->count() + 1);
        $chapter->setCourse($course);
        
        $em->persist($chapter);
        $em->flush();
        
        return $this->json(['message' => 'Chapter added successfully', 'chapter' => $chapter], 201);
    }

// src/Controller/CourseController.php

#[Route('/{id}/add-content', methods: ['POST'])]
#[IsGranted('ROLE_PROF')]
public function addContent(int $id, Request $request, EntityManagerInterface $em): JsonResponse
{
    try {
        $course = $em->getRepository(Course::class)->find($id);
        
        if (!$course) {
            return $this->json(['error' => 'Course not found'], 404);
        }

        if ($course->getProfessor() !== $this->getUser()) {
            return $this->json(['error' => 'Unauthorized'], 403);
        }

        // Récupérer les données du formulaire
        $chapterId = $request->request->get('chapterId');
        $title = $request->request->get('title');
        $type = $request->request->get('type');
        $duration = $request->request->get('duration');
        $file = $request->files->get('file');

        // Valider les données
        if (!$chapterId || !$title || !$type) {
            return $this->json(['error' => 'chapterId, title and type are required'], 400);
        }

        if (!$file) {
            return $this->json(['error' => 'No file uploaded'], 400);
        }

        // Vérifier le chapitre
        $chapter = $em->getRepository(Chapter::class)->find($chapterId);
        
        if (!$chapter || $chapter->getCourse()->getId() !== $course->getId()) {
            return $this->json(['error' => 'Chapter not found or not part of this course'], 404);
        }

        // ===== SAUVEGARDER LE FICHIER =====
        $uploadDir = $this->getParameter('kernel.project_dir') . '/public/uploads/' . $type . 's/';
        
        // Créer le dossier s'il n'existe pas
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }
        
        // Récupérer la taille AVANT de déplacer le fichier
        $fileSize = $file->getSize();
        $fileSizeFormatted = round($fileSize / (1024 * 1024), 1) . ' MB';
        
        // Générer un nom unique
        $originalName = $file->getClientOriginalName();
        $extension = $file->guessExtension() ?: $file->getClientOriginalExtension();
        $fileName = time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', pathinfo($originalName, PATHINFO_FILENAME)) . '.' . $extension;
        $filePath = $uploadDir . $fileName;
        
        // Déplacer le fichier
        $file->move($uploadDir, $fileName);
        
        $filePathDb = '/uploads/' . $type . 's/' . $fileName;
        // ===== FIN SAUVEGARDE =====

        // Créer le contenu
        $content = new ChapterContent();
        $content->setTitle($title);
        $content->setType($type);
        $content->setFilePath($filePathDb);
        $content->setFileSize($fileSizeFormatted);
        $content->setDuration($duration ?? null);
        $content->setChapter($chapter);
        
        $em->persist($content);
        $em->flush();
        
        return $this->json([
            'message' => 'Content added successfully',
            'content' => [
                'id' => $content->getId(),
                'title' => $content->getTitle(),
                'type' => $content->getType(),
                'filePath' => $content->getFilePath(),
                'fileSize' => $content->getFileSize(),
                'duration' => $content->getDuration(),
                'chapterId' => $content->getChapter()->getId()
            ]
        ], 201);
        
    } catch (\Exception $e) {
        return $this->json(['error' => $e->getMessage()], 500);
    }
}
// ========== SUPPRIMER UN CONTENU ==========
#[Route('/{courseId}/content/{contentId}', methods: ['DELETE'])]
#[IsGranted('ROLE_PROF')]
public function deleteContent(int $courseId, int $contentId, EntityManagerInterface $em): JsonResponse
{
    $course = $em->getRepository(Course::class)->find($courseId);
    if (!$course || $course->getProfessor() !== $this->getUser()) {
        return $this->json(['error' => 'Unauthorized'], 403);
    }

    $content = $em->getRepository(ChapterContent::class)->find($contentId);
    if (!$content) {
        return $this->json(['error' => 'Content not found'], 404);
    }

    $em->remove($content);
    $em->flush();

    return $this->json(['message' => 'Content deleted successfully']);
}

// ========== MODIFIER UN CONTENU ==========
#[Route('/{courseId}/content/{contentId}', methods: ['PUT'])]
#[IsGranted('ROLE_PROF')]
public function updateContent(int $courseId, int $contentId, Request $request, EntityManagerInterface $em): JsonResponse
{
    $course = $em->getRepository(Course::class)->find($courseId);
    if (!$course || $course->getProfessor() !== $this->getUser()) {
        return $this->json(['error' => 'Unauthorized'], 403);
    }

    $content = $em->getRepository(ChapterContent::class)->find($contentId);
    if (!$content) {
        return $this->json(['error' => 'Content not found'], 404);
    }

    $data = json_decode($request->getContent(), true);
    
    if (isset($data['title'])) $content->setTitle($data['title']);
    if (isset($data['type'])) $content->setType($data['type']);
    if (isset($data['filePath'])) $content->setFilePath($data['filePath']);
    if (isset($data['fileSize'])) $content->setFileSize($data['fileSize']);
    if (isset($data['duration'])) $content->setDuration($data['duration']);
    
    $em->flush();

    return $this->json(['message' => 'Content updated successfully', 'content' => $content]);
}

// ========== SUPPRIMER UN CHAPITRE ==========
#[Route('/{courseId}/chapter/{chapterId}', methods: ['DELETE'])]
#[IsGranted('ROLE_PROF')]
public function deleteChapter(int $courseId, int $chapterId, EntityManagerInterface $em): JsonResponse
{
    $course = $em->getRepository(Course::class)->find($courseId);
    if (!$course || $course->getProfessor() !== $this->getUser()) {
        return $this->json(['error' => 'Unauthorized'], 403);
    }

    $chapter = $em->getRepository(Chapter::class)->find($chapterId);
    if (!$chapter || $chapter->getCourse()->getId() !== $course->getId()) {
        return $this->json(['error' => 'Chapter not found'], 404);
    }

    $em->remove($chapter);
    $em->flush();

    return $this->json(['message' => 'Chapter deleted successfully']);
}

// ========== MODIFIER UN CHAPITRE ==========
#[Route('/{courseId}/chapter/{chapterId}', methods: ['PUT'])]
#[IsGranted('ROLE_PROF')]
public function updateChapter(int $courseId, int $chapterId, Request $request, EntityManagerInterface $em): JsonResponse
{
    $course = $em->getRepository(Course::class)->find($courseId);
    if (!$course || $course->getProfessor() !== $this->getUser()) {
        return $this->json(['error' => 'Unauthorized'], 403);
    }

    $chapter = $em->getRepository(Chapter::class)->find($chapterId);
    if (!$chapter || $chapter->getCourse()->getId() !== $course->getId()) {
        return $this->json(['error' => 'Chapter not found'], 404);
    }

    $data = json_decode($request->getContent(), true);
    
    if (isset($data['title'])) $chapter->setTitle($data['title']);
    if (isset($data['number'])) $chapter->setNumber($data['number']);
    
    $em->flush();

    return $this->json(['message' => 'Chapter updated successfully', 'chapter' => $chapter]);
}

}