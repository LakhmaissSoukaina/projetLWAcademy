<?php

namespace App\Entity;

use App\Repository\CourseRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: CourseRepository::class)]
class Course
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $description = null;

    #[ORM\Column(length: 100)]
    private ?string $category = null;

    #[ORM\Column(length: 50)]
    private ?string $level = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'courses')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $professor = null;

    #[ORM\Column(type: 'datetime')]
    private ?\DateTimeInterface $createdAt = null;

    #[ORM\Column(length: 20)]
    private ?string $status = null;

    #[ORM\OneToMany(targetEntity: Session::class, mappedBy: 'course')]
    private Collection $sessions;

    #[ORM\OneToMany(targetEntity: Quiz::class, mappedBy: 'course')]
    private Collection $quizzes;

    #[ORM\OneToMany(targetEntity: Assignment::class, mappedBy: 'course')]
    private Collection $assignments;

    public function __construct()
    {
        $this->sessions = new ArrayCollection();
        $this->quizzes = new ArrayCollection();
        $this->assignments = new ArrayCollection();
        $this->createdAt = new \DateTime();
        $this->status = 'draft';
    }

    public function getId(): ?int { return $this->id; }
    public function getTitle(): ?string { return $this->title; }
    public function setTitle(string $title): static { $this->title = $title; return $this; }
    public function getDescription(): ?string { return $this->description; }
    public function setDescription(?string $description): static { $this->description = $description; return $this; }
    public function getCategory(): ?string { return $this->category; }
    public function setCategory(string $category): static { $this->category = $category; return $this; }
    public function getLevel(): ?string { return $this->level; }
    public function setLevel(string $level): static { $this->level = $level; return $this; }
    public function getProfessor(): ?User { return $this->professor; }
    public function setProfessor(?User $professor): static { $this->professor = $professor; return $this; }
    public function getCreatedAt(): ?\DateTimeInterface { return $this->createdAt; }
    public function setCreatedAt(\DateTimeInterface $createdAt): static { $this->createdAt = $createdAt; return $this; }
    public function getStatus(): ?string { return $this->status; }
    public function setStatus(string $status): static { $this->status = $status; return $this; }
    public function getSessions(): Collection { return $this->sessions; }
    public function getQuizzes(): Collection { return $this->quizzes; }
    public function getAssignments(): Collection { return $this->assignments; }
}