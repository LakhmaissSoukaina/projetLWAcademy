<?php

namespace App\Entity;

use App\Repository\QuestionRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: QuestionRepository::class)]
class Question
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Quiz::class, inversedBy: 'questions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Quiz $quiz = null;

    #[ORM\Column(type: 'text')]
    private ?string $text = null;

    #[ORM\Column(length: 50)]
    private ?string $type = null;

    #[ORM\Column]
    private ?int $points = null;

    #[ORM\Column(type: 'json', nullable: true)]
    private ?array $options = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $correctAnswer = null;

    public function getId(): ?int { return $this->id; }
    public function getQuiz(): ?Quiz { return $this->quiz; }
    public function setQuiz(?Quiz $quiz): static { $this->quiz = $quiz; return $this; }
    public function getText(): ?string { return $this->text; }
    public function setText(string $text): static { $this->text = $text; return $this; }
    public function getType(): ?string { return $this->type; }
    public function setType(string $type): static { $this->type = $type; return $this; }
    public function getPoints(): ?int { return $this->points; }
    public function setPoints(int $points): static { $this->points = $points; return $this; }
    public function getOptions(): ?array { return $this->options; }
    public function setOptions(?array $options): static { $this->options = $options; return $this; }
    public function getCorrectAnswer(): ?string { return $this->correctAnswer; }
    public function setCorrectAnswer(?string $correctAnswer): static { $this->correctAnswer = $correctAnswer; return $this; }
}