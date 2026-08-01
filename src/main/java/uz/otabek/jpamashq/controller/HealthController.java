package uz.otabek.jpamashq.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@CrossOrigin(origins = "*")
public class HealthController {

    private final RestTemplate restTemplate = new RestTemplate();

    @GetMapping
    public ResponseEntity<Map<String, Object>> checkHealth() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("service", "AvtoTest UZ API");
        response.put("timestamp", System.currentTimeMillis());
        return ResponseEntity.ok(response);
    }

    // Keep-Alive Self-Ping every 10 minutes to prevent Render free instance from sleeping
    @Scheduled(fixedRate = 10 * 60 * 1000)
    public void keepAlivePing() {
        try {
            String targetUrl = "https://avtotest-uz.onrender.com/api/health";
            restTemplate.getForObject(targetUrl, String.class);
            System.out.println("⚡ Render Keep-Alive self-ping sent successfully!");
        } catch (Exception e) {
            // Silently ignore if offline or starting up
        }
    }
}
