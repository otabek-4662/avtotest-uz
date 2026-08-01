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
public class RegisterRequest {
    @NotBlank(message = "Foydalanuvchi nomi bo'sh bo'lishi mumkin emas")
    private String username;

    private String phone;

    private String email;

    @NotBlank(message = "Parol bo'sh bo'lishi mumkin emas")
    private String password;
}
