package uz.otabek.jpamashq.bot;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import uz.otabek.jpamashq.entity.TelegramUser;
import uz.otabek.jpamashq.repository.TelegramUserRepository;

import java.util.List;
import java.util.Random;

@Slf4j
@Component
@RequiredArgsConstructor
public class DailyQuizScheduler {

    private final TelegramUserRepository telegramUserRepository;
    private final TelegramBotSender botSender;
    
    private final Random random = new Random();

    // Runs every day at 09:00 AM server time
    @Scheduled(cron = "0 0 9 * * ?")
    public void sendDailyPddQuiz() {
        log.info("Starting to send daily PDD quiz to all users...");
        
        List<TelegramUser> allUsers = telegramUserRepository.findAll();
        
        String[] tips = {
            "🚗 Har doim xavfsizlik kamarini taqing!",
            "🛑 Qizil chiroqda harakatlanish qat'iyan man etiladi.",
            "🚦 Piyodalar yo'lagiga yaqinlashganda tezlikni pasaytiring.",
            "🌧 Yomg'irli havoda tormozlash masofasi uzayishini unutmang.",
            "📱 Rulda telefondan foydalanish xavfli va jarimaga tortiladi!"
        };
        
        String dailyTip = tips[random.nextInt(tips.length)];
        
        String messageText = "🌅 <b>Xayrli tong, hurmatli haydovchi!</b>\n\n"
                + "Kunlik PDD eslatmasi:\n"
                + "<b>" + dailyTip + "</b>\n\n"
                + "<i>O'z ustingizda ishlashni unutmang. Saytimiz orqali bilimingizni sinab ko'ring!</i>\n"
                + "👉 /start - Bosh menyu";

        int successCount = 0;
        
        for (TelegramUser user : allUsers) {
            if (user.getTelegramId() != null) {
                SendMessage message = new SendMessage();
                message.setChatId(user.getTelegramId().toString());
                message.setText(messageText);
                message.setParseMode("HTML");
                
                try {
                    botSender.execute(message);
                    successCount++;
                } catch (Exception e) {
                    log.error("Failed to send daily quiz to user: " + user.getTelegramId(), e.getMessage());
                }
            }
        }
        
        log.info("Finished sending daily quizzes. Success count: {}", successCount);
    }
}
