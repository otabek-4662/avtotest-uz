package uz.otabek.jpamashq.controller;

import jakarta.annotation.PostConstruct;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uz.otabek.jpamashq.dto.AuthResponse;
import uz.otabek.jpamashq.dto.LoginRequest;
import uz.otabek.jpamashq.dto.RegisterRequest;
import uz.otabek.jpamashq.entity.User;
import uz.otabek.jpamashq.repository.UserRepository;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@SuppressWarnings("null")
public class AuthController {

    private final UserRepository userRepository;

    private String normalizePhone(String raw) {
        if (raw == null) return null;
        String digits = raw.replaceAll("[^0-9]", "");
        if (digits.length() == 9) return "+998" + digits;
        if (digits.length() == 12 && digits.startsWith("998")) return "+" + digits;
        return raw.trim();
    }

    @PostConstruct
    public void initSuperAdmin() {
        try {
            Optional<User> superAdminOpt = userRepository.findByUsername("otabek");
            if (superAdminOpt.isEmpty()) {
                superAdminOpt = userRepository.findByTelegramPhone("+998504554662");
            }

            if (superAdminOpt.isEmpty()) {
                User superAdmin = User.builder()
                        .username("otabek")
                        .email("otabeksotimov9@gmail.com")
                        .telegramPhone("+998504554662")
                        .password("otabek4662")
                        .role("SUPER_ADMIN")
                        .permissions("ALL,MANAGE_USERS,MANAGE_TESTS,ANNOUNCEMENTS")
                        .build();
                userRepository.save(superAdmin);
            } else {
                User superAdmin = superAdminOpt.get();
                superAdmin.setTelegramPhone("+998504554662");
                superAdmin.setPassword("otabek4662");
                superAdmin.setRole("SUPER_ADMIN");
                superAdmin.setPermissions("ALL,MANAGE_USERS,MANAGE_TESTS,ANNOUNCEMENTS");
                userRepository.save(superAdmin);
            }
        } catch (Exception e) {
            // Ignore if database unavailable during init
        }
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body(
                AuthResponse.builder()
                    .success(false)
                    .message("Bu foydalanuvchi nomi allaqachon mavjud!")
                    .build()
            );
        }

        String phone = normalizePhone(request.getPhone());
        String email = request.getEmail() != null ? request.getEmail().trim() : null;

        // If phone is given instead of email in frontend
        if (phone != null && !phone.isEmpty()) {
            if (userRepository.existsByTelegramPhone(phone)) {
                return ResponseEntity.badRequest().body(
                    AuthResponse.builder()
                        .success(false)
                        .message("Bu telefon raqami allaqachon ro'yxatdan o'tgan!")
                        .build()
                );
            }
        }

        if (email != null && !email.isEmpty() && !email.contains("@autotest.uz")) {
            if (userRepository.existsByEmail(email)) {
                return ResponseEntity.badRequest().body(
                    AuthResponse.builder()
                        .success(false)
                        .message("Bu email manzili allaqachon ro'yxatdan o'tgan!")
                        .build()
                );
            }
        }

        String finalEmail = (email != null && !email.isEmpty()) ? email : (phone != null ? phone + "@autotest.uz" : request.getUsername() + "@autotest.uz");
        boolean isSuperAdmin = finalEmail.equalsIgnoreCase("otabeksotimov9@gmail.com") || request.getUsername().equalsIgnoreCase("otabek") || (phone != null && phone.contains("504554662"));
        String assignedRole = isSuperAdmin ? "SUPER_ADMIN" : (request.getUsername().equalsIgnoreCase("admin") ? "ADMIN" : "USER");
        String assignedPermissions = isSuperAdmin ? "ALL,MANAGE_USERS,MANAGE_TESTS,ANNOUNCEMENTS" : (assignedRole.equals("ADMIN") ? "MANAGE_USERS,MANAGE_TESTS" : "BASIC");

        User user = User.builder()
                .username(request.getUsername())
                .email(finalEmail)
                .telegramPhone(phone)
                .password(request.getPassword())
                .role(assignedRole)
                .permissions(assignedPermissions)
                .build();

        userRepository.save(user);

        String generatedToken = UUID.randomUUID().toString();

        return ResponseEntity.ok(
            AuthResponse.builder()
                .success(true)
                .message("Ro'yxatdan muvaffaqiyatli o'tdingiz!")
                .username(user.getUsername())
                .token(generatedToken)
                .role(user.getRole())
                .permissions(user.getPermissions())
                .build()
        );
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        String input = request.getUsernameOrEmail().trim();
        String normalizedPhone = normalizePhone(input);

        Optional<User> userOptional = userRepository.findByUsername(input);
        if (userOptional.isEmpty()) {
            userOptional = userRepository.findByEmail(input);
        }
        if (userOptional.isEmpty()) {
            userOptional = userRepository.findByTelegramPhone(input);
        }
        if (userOptional.isEmpty() && normalizedPhone != null) {
            userOptional = userRepository.findByTelegramPhone(normalizedPhone);
        }

        if (userOptional.isEmpty() || !userOptional.get().getPassword().equals(request.getPassword())) {
            return ResponseEntity.badRequest().body(
                AuthResponse.builder()
                    .success(false)
                    .message("Foydalanuvchi nomi, telefon raqami yoki parol noto'g'ri!")
                    .build()
            );
        }

        User user = userOptional.get();

        // Enforce SUPER_ADMIN role for Super Admin accounts
        if (user.getUsername().equalsIgnoreCase("otabek") || (user.getTelegramPhone() != null && user.getTelegramPhone().contains("504554662")) || (user.getEmail() != null && user.getEmail().equalsIgnoreCase("otabeksotimov9@gmail.com"))) {
            user.setRole("SUPER_ADMIN");
            user.setPermissions("ALL,MANAGE_USERS,MANAGE_TESTS,ANNOUNCEMENTS");
            userRepository.save(user);
        }

        String generatedToken = UUID.randomUUID().toString();

        return ResponseEntity.ok(
            AuthResponse.builder()
                .success(true)
                .message("Xush kelibsiz, " + user.getUsername() + "!")
                .username(user.getUsername())
                .token(generatedToken)
                .role(user.getRole() != null ? user.getRole() : "USER")
                .permissions(user.getPermissions() != null ? user.getPermissions() : "BASIC")
                .build()
        );
    }

    @PostMapping("/link-telegram")
    public ResponseEntity<AuthResponse> linkTelegram(@RequestBody java.util.Map<String, String> request) {
        String username = request.get("username");
        String code = request.get("code");
        
        if (username == null || code == null) {
            return ResponseEntity.badRequest().body(AuthResponse.builder().success(false).message("Ma'lumotlar to'liq emas!").build());
        }
        
        String phone = uz.otabek.jpamashq.bot.TelegramUpdateProcessor.LINK_CODES.remove(code.toUpperCase());
        if (phone == null) {
            return ResponseEntity.badRequest().body(AuthResponse.builder().success(false).message("Kod noto'g'ri yoki muddati o'tgan!").build());
        }
        
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(AuthResponse.builder().success(false).message("Foydalanuvchi topilmadi!").build());
        }
        
        User user = userOpt.get();
        user.setTelegramPhone(phone);
        userRepository.save(user);
        
        return ResponseEntity.ok(AuthResponse.builder().success(true).message("Telegram akkauntingiz muvaffaqiyatli ulandi!").build());
    }
}
