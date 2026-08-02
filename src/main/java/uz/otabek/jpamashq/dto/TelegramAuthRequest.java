package uz.otabek.jpamashq.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Telegram Login Widget dan qaytadigan ma'lumotlar.
 * Telegram docs: https://core.telegram.org/widgets/login
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TelegramAuthRequest {

    /** Telegram foydalanuvchi ID si */
    private Long id;

    /** Foydalanuvchi ismi */
    private String first_name;

    /** Foydalanuvchi familiyasi (ixtiyoriy) */
    private String last_name;

    /** Telegram username (@username, ixtiyoriy) */
    private String username;

    /** Profil rasm URL (ixtiyoriy) */
    private String photo_url;

    /** Unix timestamp — avtorizatsiya vaqti */
    private Long auth_date;

    /**
     * HMAC-SHA256 hash — xavfsizlikni tekshirish uchun.
     * BOT_TOKEN yordamida backend da tekshiriladi.
     */
    private String hash;
}
