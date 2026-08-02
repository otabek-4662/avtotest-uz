package uz.otabek.jpamashq.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_user_username", columnList = "username"),
    @Index(name = "idx_user_email", columnList = "email"),
    @Index(name = "idx_user_phone", columnList = "telegram_phone"),
    @Index(name = "idx_user_telegram_id", columnList = "telegram_id"),
    @Index(name = "idx_user_google_id", columnList = "google_id")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    @Column(nullable = true)
    private String email;

    // nullable=true: Telegram/Google orqali kirgan foydalanuvchilar uchun parol shart emas
    @Column(nullable = true)
    private String password;

    @Column(nullable = false)
    private String role; // "USER", "ADMIN", "SUPER_ADMIN"

    @Column(nullable = true)
    private String permissions; // e.g. "MANAGE_USERS,MANAGE_TESTS,ANNOUNCEMENTS,ALL"

    @Column(name = "is_pro")
    private Boolean isPro;

    @Column(name = "pro_expires_at")
    private LocalDateTime proExpiresAt;

    @Column(name = "telegram_phone")
    private String telegramPhone;

    // === OAuth maydonlari ===

    /** Telegram Login Widget orqali olingan Telegram foydalanuvchi ID si */
    @Column(name = "telegram_id", nullable = true, unique = true)
    private Long telegramId;

    /** Google OAuth orqali olingan Google foydalanuvchi ID (sub) */
    @Column(name = "google_id", nullable = true, unique = true)
    private String googleId;

    /** Telegram yoki Google dan olingan profil rasm URL */
    @Column(name = "avatar_url", nullable = true, length = 512)
    private String avatarUrl;

    /** Telegram/Google dan olingan to'liq ism (first_name + last_name yoki name) */
    @Column(name = "display_name", nullable = true, length = 200)
    private String displayName;

    /** Foydalanuvchi qaysi usul bilan ro'yxatdan o'tgan: "LOCAL", "TELEGRAM", "GOOGLE" */
    @Column(name = "auth_provider", nullable = true)
    private String authProvider;
}
