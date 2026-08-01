package uz.otabek.jpamashq.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.telegram.telegrambots.meta.TelegramBotsApi;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import org.telegram.telegrambots.updatesreceivers.DefaultBotSession;
import uz.otabek.jpamashq.bot.TelegramBotHandler;

@Configuration
public class TelegramBotConfig {

    @Bean
    public TelegramBotsApi telegramBotsApi(TelegramBotHandler botHandler) throws TelegramApiException {
        TelegramBotsApi botsApi = new TelegramBotsApi(DefaultBotSession.class);
        try {
            botsApi.registerBot(botHandler);
            System.out.println("🤖 Telegram Bot (" + botHandler.getBotUsername() + ") successfully registered and listening!");
        } catch (TelegramApiException e) {
            System.err.println("❌ Telegram Bot registration error: " + e.getMessage());
        }
        return botsApi;
    }
}
