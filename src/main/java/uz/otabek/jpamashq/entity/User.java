package uz.otabek.jpamashq.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "users")
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

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String role; // "USER", "ADMIN", "SUPER_ADMIN"

    @Column(nullable = true)
    private String permissions; // e.g. "MANAGE_USERS,MANAGE_TESTS,ANNOUNCEMENTS,ALL"
}
