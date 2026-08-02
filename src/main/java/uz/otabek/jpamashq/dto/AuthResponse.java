package uz.otabek.jpamashq.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {
    private boolean success;
    private String message;
    private String username;
    private String token;
    private String role;
    private String permissions;

    /** Telegram yoki Google dan olingan profil rasm URL */
    private String avatarUrl;

    /** To'liq ism (Telegram/Google dan) */
    private String displayName;
}
