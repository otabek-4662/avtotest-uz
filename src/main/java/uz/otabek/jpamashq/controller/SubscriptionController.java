package uz.otabek.jpamashq.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uz.otabek.jpamashq.entity.Promocode;
import uz.otabek.jpamashq.entity.User;
import uz.otabek.jpamashq.repository.PromocodeRepository;
import uz.otabek.jpamashq.repository.UserRepository;

import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;

@RestController
@RequestMapping("/api/subscription")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SubscriptionController {

    private final UserRepository userRepository;
    private final PromocodeRepository promocodeRepository;

    @PostMapping("/activate-promo")
    @CacheEvict(value = "subscriptionStatus", key = "#payload.get('username')")
    public ResponseEntity<Map<String, Object>> activatePromoCode(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String code = payload.get("code");

        Map<String, Object> response = new HashMap<>();

        if (username == null || username.trim().isEmpty() || code == null || code.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Foydalanuvchi nomi va Promokod kiritilishi shart!");
            return ResponseEntity.badRequest().body(response);
        }

        Optional<User> optUser = userRepository.findByUsername(username);
        if (optUser.isEmpty()) {
            optUser = userRepository.findByEmail(username);
        }

        if (optUser.isEmpty()) {
            response.put("success", false);
            response.put("message", "Foydalanuvchi topilmadi!");
            return ResponseEntity.badRequest().body(response);
        }

        User user = optUser.get();

        Optional<Promocode> optPromo = promocodeRepository.findByCode(code.trim().toUpperCase());
        if (optPromo.isEmpty()) {
            response.put("success", false);
            response.put("message", "Kiritilgan promokod mavjud emas yoki xato!");
            return ResponseEntity.badRequest().body(response);
        }

        Promocode promo = optPromo.get();

        if (Boolean.TRUE.equals(promo.getIsUsed())) {
            response.put("success", false);
            response.put("message", "Ushbu promokod allaqachon ishlatilgan!");
            return ResponseEntity.badRequest().body(response);
        }

        int durationDays = promo.getDurationDays() != null ? promo.getDurationDays() : 30;
        LocalDateTime currentExpiry = user.getProExpiresAt();
        LocalDateTime newExpiry;

        if (currentExpiry != null && currentExpiry.isAfter(LocalDateTime.now())) {
            newExpiry = currentExpiry.plusDays(durationDays);
        } else {
            newExpiry = LocalDateTime.now().plusDays(durationDays);
        }

        // Update Promocode status
        promo.setIsUsed(true);
        promo.setUsedByUsername(user.getUsername());
        promo.setUsedAt(LocalDateTime.now());
        promocodeRepository.save(promo);

        // Update User PRO status
        user.setIsPro(true);
        user.setProExpiresAt(newExpiry);
        userRepository.save(user);

        response.put("success", true);
        response.put("message", "🎉 Tabriklaymiz! PRO obunangiz " + durationDays + " kunga muvaffaqiyatli faollashtirildi!");
        response.put("isPro", true);
        response.put("proExpiresAt", newExpiry.toString());
        response.put("daysLeft", ChronoUnit.DAYS.between(LocalDateTime.now(), newExpiry));

        return ResponseEntity.ok(response);
    }

    @GetMapping("/status/{username}")
    @Transactional(readOnly = true)
    @Cacheable(value = "subscriptionStatus", key = "#username")
    public ResponseEntity<Map<String, Object>> getSubscriptionStatus(@PathVariable String username) {
        Map<String, Object> response = new HashMap<>();

        Optional<User> optUser = userRepository.findByUsername(username);
        if (optUser.isEmpty()) {
            optUser = userRepository.findByEmail(username);
        }

        if (optUser.isEmpty()) {
            response.put("success", false);
            response.put("message", "Foydalanuvchi topilmadi!");
            return ResponseEntity.badRequest().body(response);
        }

        User user = optUser.get();
        boolean isProActive = Boolean.TRUE.equals(user.getIsPro()) &&
                user.getProExpiresAt() != null &&
                user.getProExpiresAt().isAfter(LocalDateTime.now());

        long daysLeft = 0;
        if (isProActive && user.getProExpiresAt() != null) {
            daysLeft = ChronoUnit.DAYS.between(LocalDateTime.now(), user.getProExpiresAt());
        }

        response.put("success", true);
        response.put("username", user.getUsername());
        response.put("isPro", isProActive);
        response.put("proExpiresAt", user.getProExpiresAt() != null ? user.getProExpiresAt().toString() : null);
        response.put("daysLeft", Math.max(0, daysLeft));

        return ResponseEntity.ok(response);
    }
}
