<?php

namespace App\Entity;

use App\Repository\AssignmentSubmissionRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AssignmentSubmissionRepository::class)]
class AssignmentSubmission
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Assignment::class, inversedBy: 'submissions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Assignment $assignment = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'submissions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $student = null;

    #[ORM\Column(type: 'datetime')]
    private ?\DateTimeInterface $submittedAt = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $file = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $content = null;

    #[ORM\Column(type: 'float', nullable: true)]
    private ?float $grade = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $feedback = null;

    #[ORM\Column(type: 'datetime', nullable: true)]
    private ?\DateTimeInterface $gradedAt = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    private ?User $gradedBy = null;

    #[ORM\Column(length: 20)]
    private ?string $status = null;

    public function __construct()
    {
        $this->submittedAt = new \DateTime();
        $this->status = 'pending';
    }

    public function getId(): ?int { return $this->id; }
    public function getAssignment(): ?Assignment { return $this->assignment; }
    public function setAssignment(?Assignment $assignment): static { $this->assignment = $assignment; return $this; }
    public function getStudent(): ?User { return $this->student; }
    public function setStudent(?User $student): static { $this->student = $student; return $this; }
    public function getSubmittedAt(): ?\DateTimeInterface { return $this->submittedAt; }
    public function setSubmittedAt(\DateTimeInterface $submittedAt): static { $this->submittedAt = $submittedAt; return $this; }
    public function getFile(): ?string { return $this->file; }
    public function setFile(?string $file): static { $this->file = $file; return $this; }
    public function getContent(): ?string { return $this->content; }
    public function setContent(?string $content): static { $this->content = $content; return $this; }
    public function getGrade(): ?float { return $this->grade; }
    public function setGrade(?float $grade): static { $this->grade = $grade; return $this; }
    public function getFeedback(): ?string { return $this->feedback; }
    public function setFeedback(?string $feedback): static { $this->feedback = $feedback; return $this; }
    public function getGradedAt(): ?\DateTimeInterface { return $this->gradedAt; }
    public function setGradedAt(?\DateTimeInterface $gradedAt): static { $this->gradedAt = $gradedAt; return $this; }
    public function getGradedBy(): ?User { return $this->gradedBy; }
    public function setGradedBy(?User $gradedBy): static { $this->gradedBy = $gradedBy; return $this; }
    public function getStatus(): ?string { return $this->status; }
    public function setStatus(string $status): static { $this->status = $status; return $this; }
}