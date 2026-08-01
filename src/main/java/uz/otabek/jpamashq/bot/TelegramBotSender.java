package uz.otabek.jpamashq.bot;

import org.telegram.telegrambots.meta.api.methods.BotApiMethod;
import org.telegram.telegrambots.meta.api.methods.send.SendPhoto;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import java.io.Serializable;

public interface TelegramBotSender {
    <T extends Serializable, Method extends BotApiMethod<T>> T execute(Method method) throws TelegramApiException;
    org.telegram.telegrambots.meta.api.objects.Message execute(SendPhoto sendPhoto) throws TelegramApiException;
}
