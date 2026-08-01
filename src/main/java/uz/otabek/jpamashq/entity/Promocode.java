package uz.otabek.jpamashq.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "promocodes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Promocode {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(name = "duration_days", nullable = false)
    private Integer durationDays; // default 30 days

    @Column(name = "is_used", nullable = false)
    private Boolean isUsed;

    @Column(name = "used_by_username")
    private String usedByUsername;

    @Column(name = "used_at")
    private LocalDateTime usedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "created_by")
    private String createdBy;
}
