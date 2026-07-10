<?php
// src/Entity/Course.php

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

    // ========== NOUVELLE RELATION AVEC ENROLLMENT ==========
    #[ORM\OneToMany(mappedBy: 'course', targetEntity: Enrollment::class, cascade: ['persist', 'remove'])]
    private Collection $enrollments;

    // ========== NOUVELLE RELATION AVEC CHAPTER ==========
    #[ORM\OneToMany(targetEntity: Chapter::class, mappedBy: 'course', cascade: ['persist', 'remove'])]
    private Collection $chapters;

    public function __construct()
    {
        $this->sessions = new ArrayCollection();
        $this->quizzes = new ArrayCollection();
        $this->assignments = new ArrayCollection();
        $this->enrollments = new ArrayCollection();  // ← NOUVEAU
        $this->chapters = new ArrayCollection();     // ← NOUVEAU
        $this->createdAt = new \DateTime();
        $this->status = 'draft';
    }

    // ========== GETTERS ET SETTERS EXISTANTS ==========
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

    // ========== NOUVEAUX GETTERS ==========
    
    /**
     * Récupère les inscriptions au cours
     */
    public function getEnrollments(): Collection
    {
        return $this->enrollments;
    }

    /**
     * Récupère les étudiants inscrits au cours
     */
    public function getStudents(): Collection
    {
        return $this->enrollments->map(fn($e) => $e->getStudent());
    }

    /**
     * Récupère le nombre d'étudiants inscrits
     */
    public function getStudentCount(): int
    {
        return $this->enrollments->count();
    }

    /**
     * Vérifie si un étudiant est inscrit au cours
     */
    public function isStudentEnrolled(User $student): bool
    {
        return $this->enrollments->exists(
            fn($key, $enrollment) => $enrollment->getStudent() === $student
        );
    }

    /**
     * Récupère les chapitres du cours
     */
    public function getChapters(): Collection
    {
        return $this->chapters;
    }

    /**
     * Ajoute un chapitre au cours
     */
    public function addChapter(Chapter $chapter): static
    {
        if (!$this->chapters->contains($chapter)) {
            $this->chapters->add($chapter);
            $chapter->setCourse($this);
        }
        return $this;
    }

    /**
     * Supprime un chapitre du cours
     */
    public function removeChapter(Chapter $chapter): static
    {
        $this->chapters->removeElement($chapter);
        return $this;
    }

    /**
     * Ajoute un étudiant au cours
     */
    public function enrollStudent(User $student): static
    {
        // Vérifier si déjà inscrit
        if ($this->isStudentEnrolled($student)) {
            return $this;
        }

        $enrollment = new Enrollment();
        $enrollment->setStudent($student);
        $enrollment->setCourse($this);
        $enrollment->setEnrolledAt(new \DateTimeImmutable());
        $enrollment->setStatus('active');

        $this->enrollments->add($enrollment);
        return $this;
    }

    /**
     * Désinscrit un étudiant du cours
     */
    public function unenrollStudent(User $student): static
    {
        foreach ($this->enrollments as $enrollment) {
            if ($enrollment->getStudent() === $student) {
                $enrollment->setStatus('inactive');
                break;
            }
        }
        return $this;
    }

    /**
     * Convertit le cours en tableau pour l'API
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'category' => $this->category,
            'level' => $this->level,
            'status' => $this->status,
            'createdAt' => $this->createdAt?->format('Y-m-d H:i:s'),
            'professor' => $this->professor?->getNomComplet(),
            'professorId' => $this->professor?->getId(),
            'studentCount' => $this->getStudentCount(),
            'chaptersCount' => $this->chapters->count(),
            'quizzesCount' => $this->quizzes->count(),
            'assignmentsCount' => $this->assignments->count()
        ];
    }
}