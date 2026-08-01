package uz.otabek.jpamashq.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import uz.otabek.jpamashq.entity.TelegramUser;

import java.util.Optional;

@Repository
public interface TelegramUserRepository extends JpaRepository<TelegramUser, Long> {
    Optional<TelegramUser> findByTelegramId(Long telegramId);
    Optional<TelegramUser> findByPhoneNumber(String phoneNumber);
    boolean existsByTelegramId(Long telegramId);
}
