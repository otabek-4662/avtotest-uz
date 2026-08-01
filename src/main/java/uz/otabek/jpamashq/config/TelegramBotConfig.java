package uz.otabek.jpamashq.config;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.telegram.telegrambots.meta.TelegramBotsApi;
import org.telegram.telegrambots.updatesreceivers.DefaultBotSession;
import uz.otabek.jpamashq.bot.TelegramBotHandler;

@Slf4j
@Configuration
public class TelegramBotConfig {

    @Bean
    public CommandLineRunner initTelegramBot(TelegramBotHandler botHandler) {
        return args -> {
            try {
                String token = botHandler.getBotToken();
                if (token != null && !token.equals("dummy_token") && !token.trim().isEmpty()) {
                    TelegramBotsApi botsApi = new TelegramBotsApi(DefaultBotSession.class);
                    botsApi.registerBot(botHandler);
                    log.info("Telegram Bot @{} successfully registered and started polling!", botHandler.getBotUsername());
                } else {
                    log.warn("Telegram Bot token is dummy_token or empty. Skipping bot startup.");
                }
            } catch (Exception e) {
                log.error("Failed to register Telegram Bot: {}", e.getMessage(), e);
            }
        };
    }
}
