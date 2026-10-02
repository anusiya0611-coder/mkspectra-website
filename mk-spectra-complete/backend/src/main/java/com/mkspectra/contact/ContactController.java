package com.mkspectra.contact;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api")
public class ContactController {

    private final EmailService emailService;
    private final RateLimiter rateLimiter;

    public ContactController(EmailService emailService, RateLimiter rateLimiter) {
        this.emailService = emailService;
        this.rateLimiter = rateLimiter;
    }

    @PostMapping("/contact")
    public ResponseEntity<Map<String, String>> submit(@Valid @RequestBody ContactRequest req,
                                                      HttpServletRequest http) {
        // Honeypot filled => a bot. Pretend success, send nothing.
        if (req.website() != null && !req.website().isBlank()) {
            return ok();
        }
        if (!rateLimiter.allow(http.getRemoteAddr())) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .body(Map.of("message", "Too many messages. Please try again in a few minutes."));
        }
        emailService.sendEnquiry(req);
        return ok();
    }

    private static ResponseEntity<Map<String, String>> ok() {
        return ResponseEntity.ok(Map.of("message", "Thank you! Your message has been sent."));
    }
}
