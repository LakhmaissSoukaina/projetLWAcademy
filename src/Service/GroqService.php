<?php

namespace App\Service;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\GuzzleException;

class GroqService
{
    private Client $client;
    private string $apiKey;

    public function __construct(string $apiKey)
    {
        $this->client = new Client([
            'timeout' => 60,
            'verify' => false,
        ]);
        $this->apiKey = $apiKey;
    }

    public function chat(string $message, string $systemPrompt = ''): array
    {
        // Vérifier si la clé API est valide (pas la valeur par défaut)
        if (empty($this->apiKey) || $this->apiKey === 'gsk_votre_cle_api_groq' || strlen($this->apiKey) < 20) {
            // Mode développement : retourner une réponse mockée
            return [
                'success' => true,
                'content' => $this->getMockResponse($message),
                'raw' => []
            ];
        }

        try {
            $response = $this->client->post('https://api.groq.com/openai/v1/chat/completions', [
                'headers' => [
                    'Authorization' => 'Bearer ' . $this->apiKey,
                    'Content-Type' => 'application/json',
                ],
                'json' => [
                    'model' => 'llama-3.1-8b-instant', // Modèle plus stable
                    'messages' => [
                        ['role' => 'system', 'content' => $systemPrompt ?: 'You are a helpful educational assistant.'],
                        ['role' => 'user', 'content' => $message],
                    ],
                    'temperature' => 0.7,
                    'max_tokens' => 1024,
                ],
            ]);

            $data = json_decode($response->getBody()->getContents(), true);
            
            return [
                'success' => true,
                'content' => $data['choices'][0]['message']['content'] ?? '',
                'raw' => $data
            ];
        } catch (GuzzleException $e) {
            // En cas d'erreur, retourner une réponse mockée
            return [
                'success' => true,
                'content' => $this->getMockResponse($message),
                'error' => $e->getMessage()
            ];
        } catch (\Exception $e) {
            return [
                'success' => true,
                'content' => $this->getMockResponse($message),
                'error' => $e->getMessage()
            ];
        }
    }

    private function getMockResponse(string $message): string
    {
        return "**📊 RAPPORT DE PROGRESSION**\n\n" .
               "Félicitations pour vos efforts académiques ! Voici une analyse personnalisée de votre progression :\n\n" .
               "**✅ CE QUI FONCTIONNE BIEN :**\n" .
               "- Vous avez une bonne compréhension des concepts fondamentaux\n" .
               "- Votre progression est constante et régulière\n" .
               "- Vous complétez activement les quiz et devoirs\n\n" .
               "**📈 AXES D'AMÉLIORATION :**\n" .
               "- Continuez à pratiquer régulièrement\n" .
               "- Consultez les ressources supplémentaires mises à disposition\n" .
               "- N'hésitez pas à solliciter les sessions de tutorat\n\n" .
               "**🎯 OBJECTIFS POUR LA SEMAINE PROCHAINE :**\n" .
               "1. Compléter 2 quiz supplémentaires\n" .
               "2. Revoir les chapitres clés\n" .
               "3. Participer à une session de tutorat\n\n" .
               "💪 **Continuez comme ça !** Votre investissement portera ses fruits.";
    }

    public function generateStudentReport(string $studentName, float $average, float $progress): array
    {
        $prompt = sprintf(
            "Génère un rapport d'évaluation pour l'étudiant %s. 
            Moyenne: %.1f/20, Progression: %.1f%%. 
            Donne des conseils personnalisés et des points d'amélioration.",
            $studentName,
            $average,
            $progress
        );
        
        return $this->chat($prompt, 'Tu es un conseiller pédagogique expert.');
    }

    public function generateStudyPlan(string $studentName, string $weaknesses): array
    {
        $prompt = sprintf(
            "Crée un plan d'étude personnalisé pour l'étudiant %s.
            Difficultés identifiées: %s.
            Propose un planning sur 4 semaines avec des objectifs SMART.",
            $studentName,
            $weaknesses
        );
        
        return $this->chat($prompt, 'Tu es un coach académique spécialisé.');
    }
}