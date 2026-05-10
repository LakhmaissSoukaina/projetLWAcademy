<?php

namespace App\Entity;

use App\Repository\AssignmentRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AssignmentRepository::class)]
class Assignment
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(type: 'text')]
    private ?string $description = null;

    #[ORM\ManyToOne(targetEntity: Course::class, inversedBy: 'assignments')]
    private ?Course $course = null;

    #[ORM\Column(type: 'datetime')]
    private ?\DateTimeInterface $deadline = null;

    #[ORM\Column]
    private ?int $maxPoints = null;

    #[ORM\Column(length: 20)]
    private ?string $status = null;

    #[ORM\OneToMany(targetEntity: AssignmentSubmission::class, mappedBy: 'assignment')]
    private Collection $submissions;

    public function __construct()
    {
        $this->submissions = new ArrayCollection();
        $this->status = 'draft';
    }

    public function getId(): ?int { return $this->id; }
    public function getTitle(): ?string { return $this->title; }
    public function setTitle(string $title): static { $this->title = $title; return $this; }
    public function getDescription(): ?string { return $this->description; }
    public function setDescription(string $description): static { $this->description = $description; return $this; }
    public function getCourse(): ?Course { return $this->course; }
    public function setCourse(?Course $course): static { $this->course = $course; return $this; }
    public function getDeadline(): ?\DateTimeInterface { return $this->deadline; }
    public function setDeadline(\DateTimeInterface $deadline): static { $this->deadline = $deadline; return $this; }
    public function getMaxPoints(): ?int { return $this->maxPoints; }
    public function setMaxPoints(int $maxPoints): static { $this->maxPoints = $maxPoints; return $this; }
    public function getStatus(): ?string { return $this->status; }
    public function setStatus(string $status): static { $this->status = $status; return $this; }
    public function getSubmissions(): Collection { return $this->submissions; }
}