<?php
// src/Entity/Chapter.php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'chapter')]
class Chapter
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column]
    private ?int $number = null;

    #[ORM\ManyToOne(targetEntity: Course::class, inversedBy: 'chapters')]
    #[ORM\JoinColumn(nullable: false)]
    private ?Course $course = null;

    #[ORM\OneToMany(targetEntity: ChapterContent::class, mappedBy: 'chapter', cascade: ['persist', 'remove'])]
    private Collection $contents;

    public function __construct()
    {
        $this->contents = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;
        return $this;
    }

    public function getNumber(): ?int
    {
        return $this->number;
    }

    public function setNumber(int $number): static
    {
        $this->number = $number;
        return $this;
    }

    public function getCourse(): ?Course
    {
        return $this->course;
    }

    public function setCourse(?Course $course): static
    {
        $this->course = $course;
        return $this;
    }

    public function getContents(): Collection
    {
        return $this->contents;
    }

    public function addContent(ChapterContent $content): static
    {
        if (!$this->contents->contains($content)) {
            $this->contents->add($content);
            $content->setChapter($this);
        }
        return $this;
    }

    public function removeContent(ChapterContent $content): static
    {
        $this->contents->removeElement($content);
        return $this;
    }
}