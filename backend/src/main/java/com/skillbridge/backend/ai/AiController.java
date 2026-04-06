package com.skillbridge.backend.ai;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "*")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/analyze-skills")
    public ResponseEntity<String> analyzeSkills(@RequestBody Map<String, String> request) {
        String skillLines = request.get("skills");
        if (skillLines == null || skillLines.trim().isEmpty()) {
            return ResponseEntity.badRequest().body("{\"error\": \"Skills data is required\"}");
        }

        try {
            String analysisResultJson = aiService.analyzeSkills(skillLines);
            return ResponseEntity.ok(analysisResultJson);
        } catch (Exception e) {
            if (e.getMessage() != null && e.getMessage().contains("Gemini API key is missing")) {
                return ResponseEntity.status(503).body("{\"error\": \"Gemini API key is missing on the server.\"}");
            }
            return ResponseEntity.internalServerError().body("{\"error\": \"Failed to analyze skills\"}");
        }
    }
}
