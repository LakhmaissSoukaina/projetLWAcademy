<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
#[UniqueEntity(fields: ['email'], message: 'There is already an account with this email')]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180)]
    #[Assert\NotBlank]
    #[Assert\Email]
    private ?string $email = null;

    /**
     * @var list<string> The user roles
     */
    #[ORM\Column]
    private array $roles = [];

    /**
     * @var string The hashed password
     */
    #[ORM\Column]
    private ?string $password = null;

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank(message: 'Le nom est obligatoire')]
    private ?string $nom = null;

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank(message: 'Le prénom est obligatoire')]
    private ?string $prenom = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $photo = null;

    #[ORM\Column(type: 'boolean')]
    private bool $isVerified = false;

    #[ORM\Column(type: 'datetime_immutable')]
    private ?\DateTimeImmutable $createdAt = null;

    // ========== RELATIONS ==========

    #[ORM\OneToMany(targetEntity: Session::class, mappedBy: 'tutor')]
    private Collection $tutorSessions;

    #[ORM\OneToMany(targetEntity: Session::class, mappedBy: 'student')]
    private Collection $studentSessions;

    #[ORM\OneToMany(targetEntity: QuizAttempt::class, mappedBy: 'student')]
    private Collection $quizAttempts;

    #[ORM\OneToMany(targetEntity: AssignmentSubmission::class, mappedBy: 'student')]
    private Collection $submissions;

    #[ORM\OneToMany(targetEntity: Course::class, mappedBy: 'professor')]
    private Collection $courses;

    #[ORM\OneToMany(targetEntity: AISuggestion::class, mappedBy: 'user')]
    private Collection $aiSuggestions;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->roles = ['ROLE_ETUDIANT'];
        
        // Initialisation des collections
        $this->tutorSessions = new ArrayCollection();
        $this->studentSessions = new ArrayCollection();
        $this->quizAttempts = new ArrayCollection();
        $this->submissions = new ArrayCollection();
        $this->courses = new ArrayCollection();
        $this->aiSuggestions = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;
        return $this;
    }

    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;
        $roles[] = 'ROLE_USER';
        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;
        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): static
    {
        $this->password = $password;
        return $this;
    }

    public function eraseCredentials(): void
    {
        // Supprime les données sensibles temporaires
    }

    public function getNom(): ?string
    {
        return $this->nom;
    }

    public function setNom(string $nom): static
    {
        $this->nom = $nom;
        return $this;
    }

    public function getPrenom(): ?string
    {
        return $this->prenom;
    }

    public function setPrenom(string $prenom): static
    {
        $this->prenom = $prenom;
        return $this;
    }

    public function getPhoto(): ?string
    {
        return $this->photo;
    }

    public function setPhoto(?string $photo): static
    {
        $this->photo = $photo;
        return $this;
    }

    public function isVerified(): bool
    {
        return $this->isVerified;
    }

    public function setIsVerified(bool $isVerified): static
    {
        $this->isVerified = $isVerified;
        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(?\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;
        return $this;
    }

    public function getNomComplet(): string
    {
        return $this->prenom . ' ' . $this->nom;
    }

    // ========== GETTERS POUR LES RELATIONS ==========

    public function getTutorSessions(): Collection
    {
        return $this->tutorSessions;
    }

    public function getStudentSessions(): Collection
    {
        return $this->studentSessions;
    }

    public function getQuizAttempts(): Collection
    {
        return $this->quizAttempts;
    }

    public function getSubmissions(): Collection
    {
        return $this->submissions;
    }

    public function getCourses(): Collection
    {
        return $this->courses;
    }

    public function getAiSuggestions(): Collection
    {
        return $this->aiSuggestions;
    }

    // ========== MÉTHODES DE CALCUL ==========

    /**
     * Calcule la moyenne des quiz de l'étudiant
     */
    public function getQuizAverage(): float
    {
        $completedAttempts = $this->quizAttempts->filter(
            fn($attempt) => $attempt->getStatus() === 'completed' && $attempt->getScore() !== null
        );
        
        if ($completedAttempts->isEmpty()) {
            return 0;
        }
        
        $total = array_sum($completedAttempts->map(fn($a) => $a->getScore())->toArray());
        return round($total / $completedAttempts->count(), 2);
    }

    /**
     * Calcule la moyenne des devoirs de l'étudiant
     */
    public function getAssignmentAverage(): float
    {
        $gradedSubmissions = $this->submissions->filter(
            fn($sub) => $sub->getStatus() === 'graded' && $sub->getGrade() !== null
        );
        
        if ($gradedSubmissions->isEmpty()) {
            return 0;
        }
        
        $total = array_sum($gradedSubmissions->map(fn($s) => $s->getGrade())->toArray());
        return round($total / $gradedSubmissions->count(), 2);
    }

    /**
     * Calcule la progression globale de l'étudiant (en pourcentage)
     */
    public function getOverallProgress(): float
    {
        $totalQuizzes = $this->quizAttempts->count();
        $completedQuizzes = $this->quizAttempts->filter(fn($a) => $a->getStatus() === 'completed')->count();
        
        $totalAssignments = $this->submissions->count();
        $completedAssignments = $this->submissions->filter(fn($s) => $s->getStatus() === 'graded')->count();
        
        $quizProgress = $totalQuizzes > 0 ? ($completedQuizzes / $totalQuizzes) * 100 : 0;
        $assignmentProgress = $totalAssignments > 0 ? ($completedAssignments / $totalAssignments) * 100 : 0;
        
        // Si aucun quiz ni devoir, retourner 0
        if ($totalQuizzes === 0 && $totalAssignments === 0) {
            return 0;
        }
        
        // Si un seul type d'activité existe
        if ($totalQuizzes === 0) {
            return round($assignmentProgress, 1);
        }
        
        if ($totalAssignments === 0) {
            return round($quizProgress, 1);
        }
        
        return round(($quizProgress + $assignmentProgress) / 2, 1);
    }

    /**
     * Vérifie si l'utilisateur est un professeur
     */
    public function isProfessor(): bool
    {
        return in_array('ROLE_PROF', $this->roles);
    }

    /**
     * Vérifie si l'utilisateur est un étudiant
     */
    public function isStudent(): bool
    {
        return in_array('ROLE_ETUDIANT', $this->roles);
    }

    /**
     * Vérifie si l'utilisateur est un admin
     */
    public function isAdmin(): bool
    {
        return in_array('ROLE_ADMIN', $this->roles);
    }

    /**
     * Récupère le nombre total de quiz complétés
     */
    public function getTotalCompletedQuizzes(): int
    {
        return $this->quizAttempts->filter(fn($a) => $a->getStatus() === 'completed')->count();
    }

    /**
     * Récupère le nombre total de devoirs rendus
     */
    public function getTotalSubmittedAssignments(): int
    {
        return $this->submissions->count();
    }

    /**
     * Récupère le nombre total de devoirs notés
     */
    public function getTotalGradedAssignments(): int
    {
        return $this->submissions->filter(fn($s) => $s->getStatus() === 'graded')->count();
    }

    /**
     * Récupère les meilleurs scores de quiz
     */
    public function getBestQuizScore(): float
    {
        $completedAttempts = $this->quizAttempts->filter(
            fn($a) => $a->getStatus() === 'completed' && $a->getScore() !== null
        );
        
        if ($completedAttempts->isEmpty()) {
            return 0;
        }
        
        return max($completedAttempts->map(fn($a) => $a->getScore())->toArray());
    }

    /**
     * Récupère la meilleure note de devoir
     */
    public function getBestAssignmentGrade(): float
    {
        $gradedSubmissions = $this->submissions->filter(
            fn($s) => $s->getStatus() === 'graded' && $s->getGrade() !== null
        );
        
        if ($gradedSubmissions->isEmpty()) {
            return 0;
        }
        
        return max($gradedSubmissions->map(fn($s) => $s->getGrade())->toArray());
    }

    /**
     * Convertit l'utilisateur en tableau pour l'API
     */
    public function toArray(): array
    {
        return [
            'id' => $this->id,
            'email' => $this->email,
            'nom' => $this->nom,
            'prenom' => $this->prenom,
            'nomComplet' => $this->getNomComplet(),
            'photo' => $this->photo,
            'roles' => $this->roles,
            'isVerified' => $this->isVerified,
            'createdAt' => $this->createdAt?->format('Y-m-d H:i:s'),
            'quizAverage' => $this->getQuizAverage(),
            'assignmentAverage' => $this->getAssignmentAverage(),
            'overallProgress' => $this->getOverallProgress(),
            'totalCompletedQuizzes' => $this->getTotalCompletedQuizzes(),
            'totalSubmittedAssignments' => $this->getTotalSubmittedAssignments(),
            'bestQuizScore' => $this->getBestQuizScore(),
            'bestAssignmentGrade' => $this->getBestAssignmentGrade(),
        ];
    }
}