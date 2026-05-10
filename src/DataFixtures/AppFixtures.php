<?php

namespace App\DataFixtures;

use App\Entity\Assignment;
use App\Entity\AssignmentSubmission;
use App\Entity\AISuggestion;
use App\Entity\Course;
use App\Entity\Question;
use App\Entity\Quiz;
use App\Entity\QuizAttempt;
use App\Entity\Session;
use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class AppFixtures extends Fixture
{
    private UserPasswordHasherInterface $passwordHasher;

    public function __construct(UserPasswordHasherInterface $passwordHasher)
    {
        $this->passwordHasher = $passwordHasher;
    }

    public function load(ObjectManager $manager): void
    {
        // ========== 1. CRÉATION DES UTILISATEURS DE BASE ==========
        
        $emails = ['admin@wcentre.com', 'prof@wcentre.com', 'etudiant@wcentre.com', 'tuteur@wcentre.com'];
        $users = [];
        
        foreach ($emails as $email) {
            $existingUser = $manager->getRepository(User::class)->findOneBy(['email' => $email]);
            if (!$existingUser) {
                $user = new User();
                $user->setEmail($email);
                
                // Définir le mot de passe selon l'email
                if ($email === 'admin@wcentre.com') {
                    $user->setPassword($this->passwordHasher->hashPassword($user, 'admin123'));
                    $user->setRoles(['ROLE_ADMIN']);
                    $user->setNom('Admin');
                    $user->setPrenom('Global');
                } elseif ($email === 'prof@wcentre.com') {
                    $user->setPassword($this->passwordHasher->hashPassword($user, 'prof123'));
                    $user->setRoles(['ROLE_PROF']);
                    $user->setNom('Prof');
                    $user->setPrenom('Test');
                } elseif ($email === 'etudiant@wcentre.com') {
                    $user->setPassword($this->passwordHasher->hashPassword($user, 'etud123'));
                    $user->setRoles(['ROLE_ETUDIANT']);
                    $user->setNom('Dupont');
                    $user->setPrenom('Jean');
                    $user->setPhoto('https://randomuser.me/api/portraits/men/1.jpg');
                } elseif ($email === 'tuteur@wcentre.com') {
                    $user->setPassword($this->passwordHasher->hashPassword($user, 'tuteur123'));
                    $user->setRoles(['ROLE_ETUDIANT', 'ROLE_PROF']);
                    $user->setNom('Tuteur');
                    $user->setPrenom('Expert');
                    $user->setPhoto('https://randomuser.me/api/portraits/men/2.jpg');
                }
                
                $user->setIsVerified(true);
                $user->setCreatedAt(new \DateTimeImmutable());
                $manager->persist($user);
                $users[$email] = $user;
            } else {
                $users[$email] = $existingUser;
            }
        }
        
        $manager->flush();
        
        // Récupérer les utilisateurs créés
        $admin = $users['admin@wcentre.com'];
        $prof = $users['prof@wcentre.com'];
        $etudiant = $users['etudiant@wcentre.com'];
        $tuteur = $users['tuteur@wcentre.com'];
        
        // Ajouter quelques étudiants supplémentaires
        $etudiants = [$etudiant];
        $etudiantsData = [
            ['nom' => 'Martin', 'prenom' => 'Sophie', 'email' => 'sophie.martin@eleve.fr'],
            ['nom' => 'Bernard', 'prenom' => 'Lucas', 'email' => 'lucas.bernard@eleve.fr'],
            ['nom' => 'Petit', 'prenom' => 'Emma', 'email' => 'emma.petit@eleve.fr'],
        ];
        
        foreach ($etudiantsData as $data) {
            $existing = $manager->getRepository(User::class)->findOneBy(['email' => $data['email']]);
            if (!$existing) {
                $nouvelEtudiant = new User();
                $nouvelEtudiant->setEmail($data['email']);
                $nouvelEtudiant->setNom($data['nom']);
                $nouvelEtudiant->setPrenom($data['prenom']);
                $nouvelEtudiant->setRoles(['ROLE_ETUDIANT']);
                $nouvelEtudiant->setPassword($this->passwordHasher->hashPassword($nouvelEtudiant, 'password'));
                $nouvelEtudiant->setIsVerified(true);
                $nouvelEtudiant->setCreatedAt(new \DateTimeImmutable());
                $manager->persist($nouvelEtudiant);
                $etudiants[] = $nouvelEtudiant;
            }
        }
        
        // ========== 2. CRÉATION DES COURS ==========
        
        $cours = [];
        $coursData = [
            [
                'titre' => 'Introduction à Symfony 6',
                'description' => 'Découvrez le framework Symfony 6 et ses concepts fondamentaux.',
                'categorie' => 'Programmation',
                'niveau' => 'Beginner',
                'prof' => $prof
            ],
            [
                'titre' => 'React.js Moderne',
                'description' => 'Maîtrisez React.js avec les hooks, context API et plus.',
                'categorie' => 'Programmation',
                'niveau' => 'Intermediate',
                'prof' => $prof
            ],
            [
                'titre' => 'Base de données SQL',
                'description' => 'Apprenez à concevoir et manipuler des bases de données SQL.',
                'categorie' => 'Base de données',
                'niveau' => 'Beginner',
                'prof' => $tuteur
            ],
            [
                'titre' => 'API Platform',
                'description' => 'Créez des API REST puissantes avec API Platform.',
                'categorie' => 'Programmation',
                'niveau' => 'Advanced',
                'prof' => $prof
            ],
            [
                'titre' => 'JavaScript ES2024',
                'description' => 'Maîtrisez les dernières fonctionnalités de JavaScript.',
                'categorie' => 'Programmation',
                'niveau' => 'Intermediate',
                'prof' => $tuteur
            ],
        ];
        
        foreach ($coursData as $data) {
            $course = new Course();
            $course->setTitle($data['titre']);
            $course->setDescription($data['description']);
            $course->setCategory($data['categorie']);
            $course->setLevel($data['niveau']);
            $course->setProfessor($data['prof']);
            $course->setStatus('published');
            $manager->persist($course);
            $cours[] = $course;
        }
        
        $manager->flush();
        
        // ========== 3. CRÉATION DES QUIZZ ET QUESTIONS ==========
        
        $quizzes = [];
        foreach ($cours as $courseIndex => $course) {
            for ($q = 1; $q <= 2; $q++) {
                $quiz = new Quiz();
                $quiz->setTitle("Quiz {$q} - {$course->getTitle()}");
                $quiz->setDescription("Testez vos connaissances sur {$course->getTitle()} - Partie {$q}");
                $quiz->setCourse($course);
                $quiz->setTotalPoints(100);
                $quiz->setDuration(30);
                $quiz->setStatus('published');
                $quiz->setCreatedBy($course->getProfessor());
                $manager->persist($quiz);
                $quizzes[] = $quiz;
                
                // Ajouter des questions
                // Ajouter des questions
$questions = [
    [
        'text' => 'Quelle est la principale caractéristique de ' . $course->getTitle() . ' ?',
        'type' => 'multiple_choice',
        'points' => 25,
        'options' => ['Option A', 'Option B', 'Option C', 'Option D'],
        'correct' => 'Option A'
    ],
    [
        'text' => 'La technologie ' . $course->getTitle() . ' est-elle adaptée aux débutants ?',
        'type' => 'true_false',
        'points' => 25,
        'options' => null,
        'correct' => 'Vrai'
    ],
    [
        'text' => 'Expliquez en quelques lignes ce que vous avez appris dans ce cours.',
        'type' => 'essay',
        'points' => 50,
        'options' => null,
        'correct' => null
    ],
];
                
                foreach ($questions as $qData) {
                    $question = new Question();
                    $question->setQuiz($quiz);
                    $question->setText($qData['text']);
                    $question->setType($qData['type']);
                    $question->setPoints($qData['points']);
                    $question->setOptions($qData['options']);
                    $question->setCorrectAnswer($qData['correct']);
                    $manager->persist($question);
                }
            }
        }
        
        $manager->flush();
        // ========== SESSIONS POUR LE PROFESSEUR ==========
// Ajouter des sessions où le professeur est tuteur
$prof = $users['prof@wcentre.com'];
$etudiantsList = $etudiants;

for ($i = 0; $i < 5; $i++) {
    $session = new Session();
    $session->setTitle("Session de tutorat avec Professeur - Cours " . ($i + 1));
    $date = new \DateTime('+' . ($i + 5) . ' days');
    $date->setTime(15, 0, 0);
    $session->setDate($date);
    $session->setDuration(60);
    $session->setTutor($prof);  // Professeur comme tuteur
    $session->setStudent($etudiantsList[$i % count($etudiantsList)]);
    $session->setCourse($cours[$i % count($cours)]);
    $session->setStatus('scheduled');
    $session->setMeetingLink("https://meet.google.com/prof-session-" . uniqid());
    $session->setNotes("Session de révision avec le Professeur");
    $manager->persist($session);
}
        // ========== 4. CRÉATION DES SESSIONS (COURS/TUTEUR) ==========
        
        for ($i = 0; $i < 10; $i++) {
            $session = new Session();
            $session->setTitle("Session de tutorat - " . $cours[$i % count($cours)]->getTitle());
            $date = new \DateTime('+' . ($i + 1) . ' days');
            $date->setTime(14, 0, 0);
            $session->setDate($date);
            $session->setDuration(60);
            $session->setTutor($i % 2 === 0 ? $prof : $tuteur);
            $session->setStudent($etudiants[$i % count($etudiants)]);
            $session->setCourse($cours[$i % count($cours)]);
            $session->setStatus($i < 7 ? 'scheduled' : 'completed');
            $session->setMeetingLink("https://meet.google.com/session-" . uniqid());
            $session->setNotes("Session sur les concepts avancés de " . $cours[$i % count($cours)]->getTitle());
            $manager->persist($session);
        }
        
        $manager->flush();
        
        // ========== 5. CRÉATION DES TENTATIVES DE QUIZ POUR L'ÉTUDIANT ==========
        
        foreach ($etudiants as $etudiant) {
            foreach ($quizzes as $quiz) {
                // 70% de chance d'avoir tenté le quiz
                if (rand(1, 100) <= 70) {
                    $attempt = new QuizAttempt();
                    $attempt->setQuiz($quiz);
                    $attempt->setStudent($etudiant);
                    
                    // Générer des réponses aléatoires
                    $answers = [];
                    foreach ($quiz->getQuestions() as $question) {
                        if ($question->getType() === 'multiple_choice') {
                            $answers[$question->getId()] = 'Option A';
                        } elseif ($question->getType() === 'true_false') {
                            $answers[$question->getId()] = rand(0, 1) ? 'Vrai' : 'Faux';
                        } else {
                            $answers[$question->getId()] = 'Ceci est une réponse exemple pour le quiz ' . $quiz->getTitle();
                        }
                    }
                    $attempt->setAnswers($answers);
                    
                    // Calculer le score
                    $score = 0;
                    foreach ($quiz->getQuestions() as $question) {
                        if (isset($answers[$question->getId()]) && $answers[$question->getId()] === $question->getCorrectAnswer()) {
                            if ($question->getType() !== 'essay') {
                                $score += $question->getPoints();
                            }
                        }
                    }
                    $attempt->setScore($score);
                    $attempt->setStartedAt(new \DateTime('- ' . rand(1, 30) . ' days'));
                    $attempt->setCompletedAt(new \DateTime('- ' . rand(1, 30) . ' days + 30 minutes'));
                    $attempt->setStatus('completed');
                    $manager->persist($attempt);
                }
            }
        }
        
        // ========== 6. CRÉATION DES ASSIGNMENTS (DEVOIRS) ==========
        
        $assignments = [];
        foreach ($cours as $course) {
            for ($a = 1; $a <= 2; $a++) {
                $assignment = new Assignment();
                $assignment->setTitle("Devoir {$a} - " . $course->getTitle());
                $assignment->setDescription("Rédigez un document sur " . $course->getTitle() . " en détaillant les concepts clés.");
                $assignment->setCourse($course);
                $assignment->setDeadline(new \DateTime('+' . ($a * 7) . ' days'));
                $assignment->setMaxPoints(20);
                $assignment->setStatus('published');
                $manager->persist($assignment);
                $assignments[] = $assignment;
            }
        }
        
        $manager->flush();
        
        // ========== 7. CRÉATION DES SOUMISSIONS DE DEVOIRS ==========
        
        foreach ($etudiants as $etudiant) {
            foreach ($assignments as $assignment) {
                // 60% de chance d'avoir soumis le devoir
                if (rand(1, 100) <= 60) {
                    $submission = new AssignmentSubmission();
                    $submission->setAssignment($assignment);
                    $submission->setStudent($etudiant);
                    $submission->setContent("Voici ma réponse pour le devoir " . $assignment->getTitle() . ". J'ai bien compris les concepts.");
                    $submission->setSubmittedAt(new \DateTime('- ' . rand(1, 14) . ' days'));
                    
                    // 80% des soumissions sont notées
                    if (rand(1, 100) <= 80) {
                        $submission->setGrade(rand(10, 20));
                        $submission->setFeedback("Bon travail ! Continuez comme ça.");
                        $submission->setGradedAt(new \DateTime('- ' . rand(1, 7) . ' days'));
                        $submission->setGradedBy($prof);
                        $submission->setStatus('graded');
                    } else {
                        $submission->setStatus('pending');
                    }
                    
                    $manager->persist($submission);
                }
            }
        }
        
        // ========== 8. CRÉATION DES SUGGESTIONS IA ==========
        
        $iaSuggestions = [
    [
        'user' => $etudiant,
        'type' => 'study_plan',
        'content' => "Plan d'étude recommandé : Révisez Symfony 6 cette semaine, concentrez-vous sur les contrôleurs et les entités.",
        'context' => ['difficulty' => 'medium', 'recommended_hours' => 5]
    ],
    [
        'user' => $etudiant,
        'type' => 'student_report',
        'content' => "Rapport de progression : L'étudiant a complété 70% des quiz avec une moyenne de 75/100.",
        'context' => ['progress' => 70, 'average' => 75]
    ],
    [
        'user' => $prof,
        'type' => 'global_report',
        'content' => "Rapport global de la classe : La promotion progresse bien, 85% des étudiants ont réussi leurs examens.",
        'context' => ['success_rate' => 85, 'total_students' => 10]
    ],
];
        
        foreach ($iaSuggestions as $suggestionData) {
            $suggestion = new AISuggestion();
            $suggestion->setUser($suggestionData['user']);
            $suggestion->setType($suggestionData['type']);
            $suggestion->setContent($suggestionData['content']);
            $suggestion->setContext($suggestionData['context']);
            $suggestion->setGeneratedAt(new \DateTime('- ' . rand(1, 15) . ' days'));
            $manager->persist($suggestion);
        }
        
        $manager->flush();
        
        echo "\n✅ Fixtures chargées avec succès !\n";
        echo "📧 Comptes créés :\n";
        echo "   - Admin: admin@wcentre.com / admin123\n";
        echo "   - Professeur: prof@wcentre.com / prof123\n";
        echo "   - Étudiant: etudiant@wcentre.com / etud123\n";
        echo "   - Tuteur: tuteur@wcentre.com / tuteur123\n";
    }
}