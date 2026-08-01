package uz.otabek.jpamashq.bot;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.objects.Update;

@Slf4j
@Component
@Lazy(false)
public class TelegramBotHandler extends TelegramLongPollingBot implements TelegramBotSender {

    private final TelegramUpdateProcessor updateProcessor;
    private final String botUsername;
    private final String botToken;

    public TelegramBotHandler(
            TelegramUpdateProcessor updateProcessor,
            @Value("${telegram.bot.username:testautouz_bot}") String botUsername,
            @Value("${telegram.bot.token:dummy_token}") String botToken) {
        this.updateProcessor = updateProcessor;
        this.botUsername = botUsername;
        this.botToken = botToken;
        log.info("TelegramBotHandler initialized for {}", botUsername);
    }

    @Override
    public String getBotUsername() {
        return botUsername;
    }

    @Override
    public String getBotToken() {
        return botToken;
    }

    @Override
    public void onUpdateReceived(Update update) {
        // Hand off to the async processor
        updateProcessor.processUpdate(update, this);
    }
}
