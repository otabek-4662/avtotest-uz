package uz.otabek.jpamashq.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_user_username", columnList = "username"),
    @Index(name = "idx_user_email", columnList = "email"),
    @Index(name = "idx_user_phone", columnList = "telegram_phone")
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

    @Column(nullable = false)
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
}
