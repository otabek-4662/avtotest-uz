package uz.otabek.jpamashq.controller;

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

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(request.getPassword()) // Note: In production, encode with BCryptPasswordEncoder
                .role("USER")
                .build();

        userRepository.save(user);

        String generatedToken = UUID.randomUUID().toString();

        return ResponseEntity.ok(
            AuthResponse.builder()
                .success(true)
                .message("Ro'yxatdan muvaffaqiyatli o'tdingiz!")
                .username(user.getUsername())
                .token(generatedToken)
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
        String generatedToken = UUID.randomUUID().toString();

        return ResponseEntity.ok(
            AuthResponse.builder()
                .success(true)
                .message("Xush kelibsiz, " + user.getUsername() + "!")
                .username(user.getUsername())
                .token(generatedToken)
                .build()
        );
    }
}
