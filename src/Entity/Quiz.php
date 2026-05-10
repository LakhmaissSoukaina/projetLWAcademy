<?php

namespace App\Entity;

use App\Repository\QuizRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: QuizRepository::class)]
class Quiz
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $description = null;

    #[ORM\ManyToOne(targetEntity: Course::class, inversedBy: 'quizzes')]
    private ?Course $course = null;

    #[ORM\Column]
    private ?int $totalPoints = null;

    #[ORM\Column]
    private ?int $duration = null;

    #[ORM\Column(length: 20)]
    private ?string $status = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    private ?User $createdBy = null;

    #[ORM\OneToMany(targetEntity: Question::class, mappedBy: 'quiz', cascade: ['persist', 'remove'])]
    private Collection $questions;

    #[ORM\OneToMany(targetEntity: QuizAttempt::class, mappedBy: 'quiz')]
    private Collection $attempts;

    public function __construct()
    {
        $this->questions = new ArrayCollection();
        $this->attempts = new ArrayCollection();
        $this->status = 'draft';
    }

    public function getId(): ?int { return $this->id; }
    public function getTitle(): ?string { return $this->title; }
    public function setTitle(string $title): static { $this->title = $title; return $this; }
    public function getDescription(): ?string { return $this->description; }
    public function setDescription(?string $description): static { $this->description = $description; return $this; }
    public function getCourse(): ?Course { return $this->course; }
    public function setCourse(?Course $course): static { $this->course = $course; return $this; }
    public function getTotalPoints(): ?int { return $this->totalPoints; }
    public function setTotalPoints(int $totalPoints): static { $this->totalPoints = $totalPoints; return $this; }
    public function getDuration(): ?int { return $this->duration; }
    public function setDuration(int $duration): static { $this->duration = $duration; return $this; }
    public function getStatus(): ?string { return $this->status; }
    public function setStatus(string $status): static { $this->status = $status; return $this; }
    public function getCreatedBy(): ?User { return $this->createdBy; }
    public function setCreatedBy(?User $createdBy): static { $this->createdBy = $createdBy; return $this; }
    public function getQuestions(): Collection { return $this->questions; }
    public function getAttempts(): Collection { return $this->attempts; }
}