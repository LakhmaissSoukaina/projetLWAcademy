<?php

namespace App\Entity;

use App\Repository\SessionRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: SessionRepository::class)]
class Session
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(type: 'datetime')]
    private ?\DateTimeInterface $date = null;

    #[ORM\Column]
    private ?int $duration = null;

    #[ORM\Column(length: 50)]
    private ?string $status = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'tutorSessions')]
    private ?User $tutor = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'studentSessions')]
    private ?User $student = null;

    #[ORM\ManyToOne(targetEntity: Course::class, inversedBy: 'sessions')]
    private ?Course $course = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $meetingLink = null;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $notes = null;
    #[ORM\Column(type: 'float', nullable: true)]
private ?float $rating = null;


    public function getId(): ?int { return $this->id; }
    public function getTitle(): ?string { return $this->title; }
    public function setTitle(string $title): static { $this->title = $title; return $this; }
    public function getDate(): ?\DateTimeInterface { return $this->date; }
    public function setDate(\DateTimeInterface $date): static { $this->date = $date; return $this; }
    public function getDuration(): ?int { return $this->duration; }
    public function setDuration(int $duration): static { $this->duration = $duration; return $this; }
    public function getStatus(): ?string { return $this->status; }
    public function setStatus(string $status): static { $this->status = $status; return $this; }
    public function getTutor(): ?User { return $this->tutor; }
    public function setTutor(?User $tutor): static { $this->tutor = $tutor; return $this; }
    public function getStudent(): ?User { return $this->student; }
    public function setStudent(?User $student): static { $this->student = $student; return $this; }
    public function getCourse(): ?Course { return $this->course; }
    public function setCourse(?Course $course): static { $this->course = $course; return $this; }
    public function getMeetingLink(): ?string { return $this->meetingLink; }
    public function setMeetingLink(?string $meetingLink): static { $this->meetingLink = $meetingLink; return $this; }
    public function getNotes(): ?string { return $this->notes; }
    public function setNotes(?string $notes): static { $this->notes = $notes; return $this; }
    public function getRating(): ?float { return $this->rating; }
public function setRating(?float $rating): static { $this->rating = $rating; return $this; }
}