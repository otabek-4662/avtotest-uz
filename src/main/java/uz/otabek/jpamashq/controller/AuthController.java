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
public class AuthController {

    private final UserRepository userRepository;

    @PostConstruct
    public void initSuperAdmin() {
        try {
            if (!userRepository.existsByEmail("otabeksotimov9@gmail.com")) {
                User superAdmin = User.builder()
                        .username("otabek")
                        .email("otabeksotimov9@gmail.com")
                        .password("otabek4662")
                        .role("SUPER_ADMIN")
                        .permissions("ALL,MANAGE_USERS,MANAGE_TESTS,ANNOUNCEMENTS")
                        .build();
                userRepository.save(superAdmin);
            }
        } catch (Exception e) {
            // Ignore if already seeded or database unavailable
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

        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body(
                AuthResponse.builder()
                    .success(false)
                    .message("Bu email manzili allaqachon ro'yxatdan o'tgan!")
                    .build()
            );
        }

        boolean isSuperAdmin = request.getEmail().equalsIgnoreCase("otabeksotimov9@gmail.com");
        String assignedRole = isSuperAdmin ? "SUPER_ADMIN" : (request.getUsername().equalsIgnoreCase("admin") ? "ADMIN" : "USER");
        String assignedPermissions = isSuperAdmin ? "ALL,MANAGE_USERS,MANAGE_TESTS,ANNOUNCEMENTS" : (assignedRole.equals("ADMIN") ? "MANAGE_USERS,MANAGE_TESTS" : "BASIC");

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
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
        Optional<User> userOptional = userRepository.findByUsername(request.getUsernameOrEmail());
        if (userOptional.isEmpty()) {
            userOptional = userRepository.findByEmail(request.getUsernameOrEmail());
        }

        if (userOptional.isEmpty() || !userOptional.get().getPassword().equals(request.getPassword())) {
            return ResponseEntity.badRequest().body(
                AuthResponse.builder()
                    .success(false)
                    .message("Foydalanuvchi nomi yoki parol noto'g'ri!")
                    .build()
            );
        }

        User user = userOptional.get();

        // Enforce SUPER_ADMIN role for otabeksotimov9@gmail.com
        if (user.getEmail().equalsIgnoreCase("otabeksotimov9@gmail.com") || user.getUsername().equalsIgnoreCase("otabek")) {
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
