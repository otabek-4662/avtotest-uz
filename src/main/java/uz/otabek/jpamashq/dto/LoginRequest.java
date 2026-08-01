package uz.otabek.jpamashq.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {
    @NotBlank(message = "Foydalanuvchi nomi, telefon yoki email bo'sh bo'lishi mumkin emas")
    private String usernameOrEmail;

    @NotBlank(message = "Parol bo'sh bo'lishi mumkin emas")
    private String password;
}
