<?php
// src/Entity/ProfessorApplication.php

namespace App\Entity;

use App\Repository\ProfessorApplicationRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProfessorApplicationRepository::class)]
#[ORM\Table(name: 'professor_application')]
class ProfessorApplication
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    private ?string $nom = null;

    #[ORM\Column(length: 100)]
    private ?string $prenom = null;

    #[ORM\Column(length: 255, unique: true)]
    private ?string $email = null;

    #[ORM\Column(length: 20, nullable: true)]
    private ?string $phone = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $diploma = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $experience = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $cvPath = null;

    #[ORM\Column(length: 50)]
    private ?string $status = 'pending';

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE)]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_IMMUTABLE, nullable: true)]
    private ?\DateTimeImmutable $processedAt = null;

    #[ORM\ManyToOne(targetEntity: User::class)]
    #[ORM\JoinColumn(name: 'processed_by_id', referencedColumnName: 'id', nullable: true)]
    private ?User $processedBy = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $adminNotes = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->status = 'pending';
    }

    public function getId(): ?int { return $this->id; }
    public function getNom(): ?string { return $this->nom; }
    public function setNom(string $nom): static { $this->nom = $nom; return $this; }
    public function getPrenom(): ?string { return $this->prenom; }
    public function setPrenom(string $prenom): static { $this->prenom = $prenom; return $this; }
    public function getEmail(): ?string { return $this->email; }
    public function setEmail(string $email): static { $this->email = $email; return $this; }
    public function getPhone(): ?string { return $this->phone; }
    public function setPhone(?string $phone): static { $this->phone = $phone; return $this; }
    public function getDiploma(): ?string { return $this->diploma; }
    public function setDiploma(?string $diploma): static { $this->diploma = $diploma; return $this; }
    public function getExperience(): ?string { return $this->experience; }
    public function setExperience(?string $experience): static { $this->experience = $experience; return $this; }
    public function getCvPath(): ?string { return $this->cvPath; }
    public function setCvPath(?string $cvPath): static { $this->cvPath = $cvPath; return $this; }
    public function getStatus(): ?string { return $this->status; }
    public function setStatus(string $status): static { $this->status = $status; return $this; }
    public function getCreatedAt(): ?\DateTimeImmutable { return $this->createdAt; }
    public function getProcessedAt(): ?\DateTimeImmutable { return $this->processedAt; }
    public function setProcessedAt(?\DateTimeImmutable $processedAt): static { $this->processedAt = $processedAt; return $this; }
    public function getProcessedBy(): ?User { return $this->processedBy; }
    public function setProcessedBy(?User $processedBy): static { $this->processedBy = $processedBy; return $this; }
    public function getAdminNotes(): ?string { return $this->adminNotes; }
    public function setAdminNotes(?string $adminNotes): static { $this->adminNotes = $adminNotes; return $this; }
}