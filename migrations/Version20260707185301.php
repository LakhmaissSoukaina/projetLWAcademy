<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260707185301 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE aisuggestion (id INT AUTO_INCREMENT NOT NULL, type VARCHAR(50) NOT NULL, content LONGTEXT NOT NULL, generated_at DATETIME NOT NULL, context JSON DEFAULT NULL, user_id INT NOT NULL, INDEX IDX_DDB1D5D8A76ED395 (user_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE assignment (id INT AUTO_INCREMENT NOT NULL, title VARCHAR(255) NOT NULL, description LONGTEXT NOT NULL, deadline DATETIME NOT NULL, max_points INT NOT NULL, status VARCHAR(20) NOT NULL, course_id INT DEFAULT NULL, INDEX IDX_30C544BA591CC992 (course_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE assignment_submission (id INT AUTO_INCREMENT NOT NULL, submitted_at DATETIME NOT NULL, file VARCHAR(255) DEFAULT NULL, content LONGTEXT DEFAULT NULL, grade DOUBLE PRECISION DEFAULT NULL, feedback LONGTEXT DEFAULT NULL, graded_at DATETIME DEFAULT NULL, status VARCHAR(20) NOT NULL, assignment_id INT NOT NULL, student_id INT NOT NULL, graded_by_id INT DEFAULT NULL, INDEX IDX_E5A63E2CD19302F8 (assignment_id), INDEX IDX_E5A63E2CCB944F1A (student_id), INDEX IDX_E5A63E2CC814BC2E (graded_by_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE chapter (id INT AUTO_INCREMENT NOT NULL, title VARCHAR(255) NOT NULL, number INT NOT NULL, course_id INT NOT NULL, INDEX IDX_F981B52E591CC992 (course_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE chapter_content (id INT AUTO_INCREMENT NOT NULL, title VARCHAR(255) NOT NULL, type VARCHAR(50) NOT NULL, file_path VARCHAR(255) DEFAULT NULL, file_size VARCHAR(50) DEFAULT NULL, duration VARCHAR(50) DEFAULT NULL, chapter_id INT NOT NULL, INDEX IDX_84F434E6579F4768 (chapter_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE course (id INT AUTO_INCREMENT NOT NULL, title VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, category VARCHAR(100) NOT NULL, level VARCHAR(50) NOT NULL, created_at DATETIME NOT NULL, status VARCHAR(20) NOT NULL, professor_id INT NOT NULL, INDEX IDX_169E6FB97D2D84D5 (professor_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE professor_application (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(100) NOT NULL, prenom VARCHAR(100) NOT NULL, email VARCHAR(255) NOT NULL, phone VARCHAR(20) DEFAULT NULL, diploma LONGTEXT DEFAULT NULL, experience LONGTEXT DEFAULT NULL, cv_path VARCHAR(255) DEFAULT NULL, status VARCHAR(50) NOT NULL, created_at DATETIME NOT NULL, processed_at DATETIME DEFAULT NULL, admin_notes LONGTEXT DEFAULT NULL, processed_by_id INT DEFAULT NULL, UNIQUE INDEX UNIQ_4A77BD21E7927C74 (email), INDEX IDX_4A77BD212FFD4FD3 (processed_by_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE question (id INT AUTO_INCREMENT NOT NULL, text LONGTEXT NOT NULL, type VARCHAR(50) NOT NULL, points INT NOT NULL, options JSON DEFAULT NULL, correct_answer LONGTEXT DEFAULT NULL, quiz_id INT NOT NULL, INDEX IDX_B6F7494E853CD175 (quiz_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE quiz (id INT AUTO_INCREMENT NOT NULL, title VARCHAR(255) NOT NULL, description LONGTEXT DEFAULT NULL, total_points INT NOT NULL, duration INT NOT NULL, status VARCHAR(20) NOT NULL, course_id INT DEFAULT NULL, created_by_id INT DEFAULT NULL, INDEX IDX_A412FA92591CC992 (course_id), INDEX IDX_A412FA92B03A8386 (created_by_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE quiz_attempt (id INT AUTO_INCREMENT NOT NULL, score DOUBLE PRECISION DEFAULT NULL, answers JSON NOT NULL, started_at DATETIME NOT NULL, completed_at DATETIME DEFAULT NULL, status VARCHAR(20) NOT NULL, quiz_id INT NOT NULL, student_id INT NOT NULL, INDEX IDX_AB6AFC6853CD175 (quiz_id), INDEX IDX_AB6AFC6CB944F1A (student_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE session (id INT AUTO_INCREMENT NOT NULL, title VARCHAR(255) NOT NULL, date DATETIME NOT NULL, duration INT NOT NULL, status VARCHAR(50) NOT NULL, meeting_link VARCHAR(255) DEFAULT NULL, notes LONGTEXT DEFAULT NULL, rating DOUBLE PRECISION DEFAULT NULL, tutor_id INT DEFAULT NULL, student_id INT DEFAULT NULL, course_id INT DEFAULT NULL, INDEX IDX_D044D5D4208F64F1 (tutor_id), INDEX IDX_D044D5D4CB944F1A (student_id), INDEX IDX_D044D5D4591CC992 (course_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, email VARCHAR(180) NOT NULL, roles JSON NOT NULL, password VARCHAR(255) NOT NULL, nom VARCHAR(100) NOT NULL, prenom VARCHAR(100) NOT NULL, photo VARCHAR(255) DEFAULT NULL, is_verified TINYINT NOT NULL, created_at DATETIME NOT NULL, UNIQUE INDEX UNIQ_IDENTIFIER_EMAIL (email), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE aisuggestion ADD CONSTRAINT FK_DDB1D5D8A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE assignment ADD CONSTRAINT FK_30C544BA591CC992 FOREIGN KEY (course_id) REFERENCES course (id)');
        $this->addSql('ALTER TABLE assignment_submission ADD CONSTRAINT FK_E5A63E2CD19302F8 FOREIGN KEY (assignment_id) REFERENCES assignment (id)');
        $this->addSql('ALTER TABLE assignment_submission ADD CONSTRAINT FK_E5A63E2CCB944F1A FOREIGN KEY (student_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE assignment_submission ADD CONSTRAINT FK_E5A63E2CC814BC2E FOREIGN KEY (graded_by_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE chapter ADD CONSTRAINT FK_F981B52E591CC992 FOREIGN KEY (course_id) REFERENCES course (id)');
        $this->addSql('ALTER TABLE chapter_content ADD CONSTRAINT FK_84F434E6579F4768 FOREIGN KEY (chapter_id) REFERENCES chapter (id)');
        $this->addSql('ALTER TABLE course ADD CONSTRAINT FK_169E6FB97D2D84D5 FOREIGN KEY (professor_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE professor_application ADD CONSTRAINT FK_4A77BD212FFD4FD3 FOREIGN KEY (processed_by_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE question ADD CONSTRAINT FK_B6F7494E853CD175 FOREIGN KEY (quiz_id) REFERENCES quiz (id)');
        $this->addSql('ALTER TABLE quiz ADD CONSTRAINT FK_A412FA92591CC992 FOREIGN KEY (course_id) REFERENCES course (id)');
        $this->addSql('ALTER TABLE quiz ADD CONSTRAINT FK_A412FA92B03A8386 FOREIGN KEY (created_by_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE quiz_attempt ADD CONSTRAINT FK_AB6AFC6853CD175 FOREIGN KEY (quiz_id) REFERENCES quiz (id)');
        $this->addSql('ALTER TABLE quiz_attempt ADD CONSTRAINT FK_AB6AFC6CB944F1A FOREIGN KEY (student_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE session ADD CONSTRAINT FK_D044D5D4208F64F1 FOREIGN KEY (tutor_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE session ADD CONSTRAINT FK_D044D5D4CB944F1A FOREIGN KEY (student_id) REFERENCES user (id)');
        $this->addSql('ALTER TABLE session ADD CONSTRAINT FK_D044D5D4591CC992 FOREIGN KEY (course_id) REFERENCES course (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE aisuggestion DROP FOREIGN KEY FK_DDB1D5D8A76ED395');
        $this->addSql('ALTER TABLE assignment DROP FOREIGN KEY FK_30C544BA591CC992');
        $this->addSql('ALTER TABLE assignment_submission DROP FOREIGN KEY FK_E5A63E2CD19302F8');
        $this->addSql('ALTER TABLE assignment_submission DROP FOREIGN KEY FK_E5A63E2CCB944F1A');
        $this->addSql('ALTER TABLE assignment_submission DROP FOREIGN KEY FK_E5A63E2CC814BC2E');
        $this->addSql('ALTER TABLE chapter DROP FOREIGN KEY FK_F981B52E591CC992');
        $this->addSql('ALTER TABLE chapter_content DROP FOREIGN KEY FK_84F434E6579F4768');
        $this->addSql('ALTER TABLE course DROP FOREIGN KEY FK_169E6FB97D2D84D5');
        $this->addSql('ALTER TABLE professor_application DROP FOREIGN KEY FK_4A77BD212FFD4FD3');
        $this->addSql('ALTER TABLE question DROP FOREIGN KEY FK_B6F7494E853CD175');
        $this->addSql('ALTER TABLE quiz DROP FOREIGN KEY FK_A412FA92591CC992');
        $this->addSql('ALTER TABLE quiz DROP FOREIGN KEY FK_A412FA92B03A8386');
        $this->addSql('ALTER TABLE quiz_attempt DROP FOREIGN KEY FK_AB6AFC6853CD175');
        $this->addSql('ALTER TABLE quiz_attempt DROP FOREIGN KEY FK_AB6AFC6CB944F1A');
        $this->addSql('ALTER TABLE session DROP FOREIGN KEY FK_D044D5D4208F64F1');
        $this->addSql('ALTER TABLE session DROP FOREIGN KEY FK_D044D5D4CB944F1A');
        $this->addSql('ALTER TABLE session DROP FOREIGN KEY FK_D044D5D4591CC992');
        $this->addSql('DROP TABLE aisuggestion');
        $this->addSql('DROP TABLE assignment');
        $this->addSql('DROP TABLE assignment_submission');
        $this->addSql('DROP TABLE chapter');
        $this->addSql('DROP TABLE chapter_content');
        $this->addSql('DROP TABLE course');
        $this->addSql('DROP TABLE professor_application');
        $this->addSql('DROP TABLE question');
        $this->addSql('DROP TABLE quiz');
        $this->addSql('DROP TABLE quiz_attempt');
        $this->addSql('DROP TABLE session');
        $this->addSql('DROP TABLE user');
    }
}
