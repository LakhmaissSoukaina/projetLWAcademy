<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260510235607 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE professor_application (id INT AUTO_INCREMENT NOT NULL, nom VARCHAR(100) NOT NULL, prenom VARCHAR(100) NOT NULL, email VARCHAR(255) NOT NULL, phone VARCHAR(20) DEFAULT NULL, diploma LONGTEXT DEFAULT NULL, experience LONGTEXT DEFAULT NULL, cv_path VARCHAR(255) DEFAULT NULL, status VARCHAR(50) NOT NULL, created_at DATETIME NOT NULL, processed_at DATETIME DEFAULT NULL, admin_notes LONGTEXT DEFAULT NULL, processed_by_id INT DEFAULT NULL, UNIQUE INDEX UNIQ_4A77BD21E7927C74 (email), INDEX IDX_4A77BD212FFD4FD3 (processed_by_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci`');
        $this->addSql('ALTER TABLE professor_application ADD CONSTRAINT FK_4A77BD212FFD4FD3 FOREIGN KEY (processed_by_id) REFERENCES user (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE professor_application DROP FOREIGN KEY FK_4A77BD212FFD4FD3');
        $this->addSql('DROP TABLE professor_application');
    }
}
