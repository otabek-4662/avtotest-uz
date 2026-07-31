package uz.otabek.jpamashq.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RegisterRequest {
    @NotBlank(message = "Foydalanuvchi nomi bo'sh bo'lishi mumkin emas")
    private String username;

    @NotBlank(message = "Email bo'sh bo'lishi mumkin emas")
    @Email(message = "Noto'g'ri email formati")
    private String email;

    @NotBlank(message = "Parol bo'sh bo'lishi mumkin emas")
    private String password;
}
