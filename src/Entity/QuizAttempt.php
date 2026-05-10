<?php

namespace App\Entity;

use App\Repository\QuizAttemptRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: QuizAttemptRepository::class)]
class QuizAttempt
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Quiz::class, inversedBy: 'attempts')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Quiz $quiz = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'quizAttempts')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $student = null;

    #[ORM\Column(type: 'float', nullable: true)]
    private ?float $score = null;

    #[ORM\Column(type: 'json')]
    private ?array $answers = null;

    #[ORM\Column(type: 'datetime')]
    private ?\DateTimeInterface $startedAt = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?\DateTimeInterface $completedAt = null;

    #[ORM\Column(length: 20)]
    private ?string $status = null;

    public function __construct()
    {
        $this->startedAt = new \DateTime();
        $this->status = 'in_progress';
        $this->answers = [];
    }

    public function getId(): ?int { return $this->id; }
    public function getQuiz(): ?Quiz { return $this->quiz; }
    public function setQuiz(?Quiz $quiz): static { $this->quiz = $quiz; return $this; }
    public function getStudent(): ?User { return $this->student; }
    public function setStudent(?User $student): static { $this->student = $student; return $this; }
    public function getScore(): ?float { return $this->score; }
    public function setScore(?float $score): static { $this->score = $score; return $this; }
    public function getAnswers(): ?array { return $this->answers; }
    public function setAnswers(array $answers): static { $this->answers = $answers; return $this; }
    public function getStartedAt(): ?\DateTimeInterface { return $this->startedAt; }
    public function setStartedAt(\DateTimeInterface $startedAt): static { $this->startedAt = $startedAt; return $this; }
    public function getCompletedAt(): ?\DateTimeInterface { return $this->completedAt; }
    public function setCompletedAt(?\DateTimeInterface $completedAt): static { $this->completedAt = $completedAt; return $this; }
    public function getStatus(): ?string { return $this->status; }
    public function setStatus(string $status): static { $this->status = $status; return $this; }
}