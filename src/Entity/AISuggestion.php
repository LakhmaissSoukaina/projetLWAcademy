<?php

namespace App\Entity;

use App\Repository\AISuggestionRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: AISuggestionRepository::class)]
class AISuggestion
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: 'aiSuggestions')]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\Column(length: 50)]
    private ?string $type = null;

    #[ORM\Column(type: 'text')]
    private ?string $content = null;

    #[ORM\Column(type: 'datetime')]
    private ?\DateTimeInterface $generatedAt = null;

    #[ORM\Column(type: 'json', nullable: true)]
    private ?array $context = null;

    public function __construct()
    {
        $this->generatedAt = new \DateTime();
    }

    public function getId(): ?int { return $this->id; }
    public function getUser(): ?User { return $this->user; }
    public function setUser(?User $user): static { $this->user = $user; return $this; }
    public function getType(): ?string { return $this->type; }
    public function setType(string $type): static { $this->type = $type; return $this; }
    public function getContent(): ?string { return $this->content; }
    public function setContent(string $content): static { $this->content = $content; return $this; }
    public function getGeneratedAt(): ?\DateTimeInterface { return $this->generatedAt; }
    public function setGeneratedAt(\DateTimeInterface $generatedAt): static { $this->generatedAt = $generatedAt; return $this; }
    public function getContext(): ?array { return $this->context; }
    public function setContext(?array $context): static { $this->context = $context; return $this; }
}