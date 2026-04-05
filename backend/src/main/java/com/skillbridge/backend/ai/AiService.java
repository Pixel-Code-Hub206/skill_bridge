package com.skillbridge.backend.ai;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
public class AiService {

    @Value("${ai.api.key:YOUR_GEMINI_API_KEY_HERE}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    @SuppressWarnings("unchecked")
    public String analyzeSkills(String skillLines) {
        if (apiKey == null || apiKey.equals("YOUR_GEMINI_API_KEY_HERE")) {
            throw new RuntimeException(
                    "Gemini API key is missing. Please configure ai.api.key in application.properties or ENV.");
        }

        String prompt = "You are a technical skill analyser for an academic project platform. A teacher is viewing a student's profile.\n\n"
                +
                "Your job: Look at the student's listed skills and their proficiency levels, then produce 3 to 5 SHORT analysis cards that describe:\n"
                +
                "- What technical DOMAINS or ROLES this student is strong in (e.g. \"Frontend Development\", \"Java Backend\", \"UI/UX Design\")\n"
                +
                "- Where they might need support or are less experienced (e.g. \"Database Design\", \"DevOps\", \"Mobile Development\")\n\n"
                +
                "RULES:\n" +
                "- Base analysis ONLY on the skills listed. Do not invent or assume anything.\n" +
                "- \"type\" must be \"strong\" if the student has at least one relevant skill at level 3+ in that domain, otherwise \"weak\".\n"
                +
                "- \"title\" = the tech domain or role (e.g. \"Frontend Developer\", \"Backend with Java\", \"UI/UX Design\")\n"
                +
                "- \"reason\" = one concrete sentence referencing actual skill names and levels. Max 15 words.\n" +
                "- Return ONLY a raw JSON array. No markdown, no explanation, no extra text.\n\n" +
                "Student skills:\n" +
                skillLines + "\n\n" +
                "Output format (example only — adapt to real skills above):\n" +
                "[{\"type\":\"strong\",\"title\":\"Frontend Development\",\"reason\":\"Strong React and CSS skills at Advanced and Intermediate levels.\"},{\"type\":\"weak\",\"title\":\"Database & SQL\",\"reason\":\"No database skills listed; may need support here.\"}]";

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key="
                + apiKey;

        Map<String, Object> requestBody = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt)))),
                "generationConfig", Map.of("temperature", 0.3));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, request, Map.class);
            Map<String, Object> body = response.getBody();
            if (body != null && body.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> partsList = (List<Map<String, Object>>) content.get("parts");
                    if (!partsList.isEmpty()) {
                        return (String) partsList.get(0).get("text");
                    }
                }
            }
            return "[]";
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to analyze skills with Gemini API: " + e.getMessage());
        }
    }
}
