<?php

namespace App\Controller;

use App\Entity\Quiz;
use App\Entity\Question;
use App\Entity\QuizAttempt;
use App\Repository\QuizRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Http\Attribute\IsGranted;

#[Route('/api/quizzes')]
class QuizController extends AbstractController
{
    #[Route('', methods: ['GET'])]
    public function index(QuizRepository $repository): JsonResponse
    {
        return $this->json($repository->findAll());
    }

    #[Route('/{id}', methods: ['GET'])]
    public function show(Quiz $quiz): JsonResponse
    {
        return $this->json($quiz);
    }

    #[Route('', methods: ['POST'])]
    #[IsGranted('ROLE_PROF')]
    public function create(Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        $quiz = new Quiz();
        $quiz->setTitle($data['title']);
        $quiz->setDescription($data['description'] ?? null);
        $quiz->setTotalPoints($data['totalPoints']);
        $quiz->setDuration($data['duration']);
        $quiz->setCreatedBy($this->getUser());
        
        if (isset($data['course'])) {
            $course = $em->getRepository(Course::class)->find($data['course']);
            $quiz->setCourse($course);
        }
        
        // Ajouter les questions
        if (isset($data['questions'])) {
            foreach ($data['questions'] as $qData) {
                $question = new Question();
                $question->setText($qData['text']);
                $question->setType($qData['type']);
                $question->setPoints($qData['points']);
                $question->setOptions($qData['options'] ?? null);
                $question->setCorrectAnswer($qData['correctAnswer'] ?? null);
                $question->setQuiz($quiz);
                $em->persist($question);
            }
        }
        
        $em->persist($quiz);
        $em->flush();
        
        return $this->json($quiz, 201);
    }

    #[Route('/{id}/attempt', methods: ['POST'])]
    #[IsGranted('ROLE_ETUDIANT')]
    public function submitAttempt(Quiz $quiz, Request $request, EntityManagerInterface $em): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        $attempt = new QuizAttempt();
        $attempt->setQuiz($quiz);
        $attempt->setStudent($this->getUser());
        $attempt->setAnswers($data['answers']);
        $attempt->setCompletedAt(new \DateTime());
        $attempt->setStatus('completed');
        
        // Calculer le score
        $score = $this->calculateScore($quiz, $data['answers']);
        $attempt->setScore($score);
        
        $em->persist($attempt);
        $em->flush();
        
        return $this->json(['score' => $score, 'total' => $quiz->getTotalPoints()]);
    }

    private function calculateScore(Quiz $quiz, array $answers): float
    {
        $totalEarned = 0;
        
        foreach ($quiz->getQuestions() as $question) {
            $questionId = $question->getId();
            if (isset($answers[$questionId])) {
                if ($question->getCorrectAnswer() === $answers[$questionId]) {
                    $totalEarned += $question->getPoints();
                }
            }
        }
        
        return ($totalEarned / $quiz->getTotalPoints()) * 100;
    }
}