package uz.otabek.jpamashq.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uz.otabek.jpamashq.entity.User;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByTelegramPhone(String telegramPhone);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByTelegramPhone(String telegramPhone);

    // === OAuth metodlari ===

    /** Telegram Login Widget dan kelgan telegramId bo'yicha foydalanuvchi topish */
    Optional<User> findByTelegramId(Long telegramId);

    /** Google OAuth dan kelgan googleId (sub) bo'yicha foydalanuvchi topish */
    Optional<User> findByGoogleId(String googleId);

    /** Telegram ID mavjudligini tekshirish */
    boolean existsByTelegramId(Long telegramId);

    /** Google ID mavjudligini tekshirish */
    boolean existsByGoogleId(String googleId);
}
