package uz.otabek.jpamashq.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class LoginRequest {
    @NotBlank(message = "Foydalanuvchi nomi yoki email bo'sh bo'lishi mumkin emas")
    private String usernameOrEmail;

    @NotBlank(message = "Parol bo'sh bo'lishi mumkin emas")
    private String password;
}
