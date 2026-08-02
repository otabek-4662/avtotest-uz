package uz.otabek.jpamashq.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Google Sign-In (GSI) dan qaytadigan ma'lumotlar.
 * Frontend Google One Tap / popup dan olingan credential JWT tokenni yuboradi.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GoogleAuthRequest {

    /**
     * Google Identity Services dan olingan JWT ID token (credential).
     * Backend bu tokenni Google tokeninfo API orqali tekshiradi.
     */
    private String idToken;

    /**
     * Frontend to'g'ridan-to'g'ri o'qigan Google sub (foydalanuvchi ID).
     * Agar idToken null bo'lsa fallback sifatida ishlatiladi.
     */
    private String googleId;

    /** Foydalanuvchi email manzili */
    private String email;

    /** To'liq ism */
    private String name;

    /** Profil rasm URL */
    private String pictureUrl;
}
