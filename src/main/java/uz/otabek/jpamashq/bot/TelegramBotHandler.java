package uz.otabek.jpamashq.bot;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.telegram.telegrambots.bots.TelegramLongPollingBot;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.methods.send.SendPhoto;
import org.telegram.telegrambots.meta.api.objects.Contact;
import org.telegram.telegrambots.meta.api.objects.InputFile;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.api.objects.PhotoSize;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardMarkup;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.ReplyKeyboardRemove;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardButton;
import org.telegram.telegrambots.meta.api.objects.replykeyboard.buttons.KeyboardRow;
import org.telegram.telegrambots.meta.exceptions.TelegramApiException;
import uz.otabek.jpamashq.entity.Promocode;
import uz.otabek.jpamashq.entity.TelegramUser;
import uz.otabek.jpamashq.repository.PromocodeRepository;
import uz.otabek.jpamashq.repository.TelegramUserRepository;

import java.time.LocalDateTime;
import java.util.*;

@Component
public class TelegramBotHandler extends TelegramLongPollingBot {

    private final TelegramUserRepository telegramUserRepository;
    private final PromocodeRepository promocodeRepository;
    private final String botUsername;
    private final String botToken;
    private final Long adminId;

    public TelegramBotHandler(
            TelegramUserRepository telegramUserRepository,
            PromocodeRepository promocodeRepository,
            @Value("${telegram.bot.username:avtotest_uz_bot}") String botUsername,
            @Value("${telegram.bot.token:dummy_token}") String botToken,
            @Value("${telegram.bot.admin-id:123456789}") Long adminId) {
        this.telegramUserRepository = telegramUserRepository;
        this.promocodeRepository = promocodeRepository;
        this.botUsername = botUsername;
        this.botToken = botToken;
        this.adminId = adminId;
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
        if (update.hasMessage()) {
            Message message = update.getMessage();

            if (message.hasContact()) {
                handleContactReceived(message);
            } else if (message.hasPhoto()) {
                handlePhotoReceived(message);
            } else if (message.hasText()) {
                handleTextMessage(message);
            }
        }
    }

    private void handlePhotoReceived(Message message) {
        Long telegramId = message.getFrom().getId();
        String firstName = message.getFrom().getFirstName();
        String username = message.getFrom().getUserName();
        Optional<TelegramUser> optUser = telegramUserRepository.findByTelegramId(telegramId);
        String phoneNumber = optUser.map(TelegramUser::getPhoneNumber).orElse("Noma'lum");

        // Get highest resolution photo
        List<PhotoSize> photos = message.getPhoto();
        PhotoSize photo = photos.stream().max(Comparator.comparing(PhotoSize::getFileSize)).orElse(null);

        if (photo != null && adminId != null) {
            String caption = String.format(
                "💳 **YANGI TO'LOV CHEKI!**\n\n" +
                "👤 Foydalanuvchi: %s (@%s)\n" +
                "📲 Tel: %s\n" +
                "🆔 Telegram ID: `%d`\n\n" +
                "👉 Promokod berish uchun: `/create_promo` deb yozing.",
                firstName != null ? firstName : "Foydalanuvchi",
                username != null ? username : "username_yoq",
                phoneNumber,
                telegramId
            );

            SendPhoto sendPhoto = new SendPhoto();
            sendPhoto.setChatId(adminId.toString());
            sendPhoto.setPhoto(new InputFile(photo.getFileId()));
            sendPhoto.setCaption(caption);
            sendPhoto.setParseMode("Markdown");

            try {
                execute(sendPhoto);
            } catch (TelegramApiException e) {
                e.printStackTrace();
            }
        }

        // Reply to user
        SendMessage replyMsg = new SendMessage();
        replyMsg.setChatId(message.getChatId().toString());
        replyMsg.setText("✅ To'lov chekingiz Super Adminga muvaffaqiyatli yuborildi!\n\nTez orada to'lovingiz tasdiqlanib, sizga 1 oylik PRO-KOD taqdim etiladi.");
        try {
            execute(replyMsg);
        } catch (TelegramApiException e) {
            e.printStackTrace();
        }
    }

    private void handleContactReceived(Message message) {
        Contact contact = message.getContact();
        Long telegramId = message.getFrom().getId();
        String phoneNumber = contact.getPhoneNumber();

        if (phoneNumber != null && !phoneNumber.startsWith("+")) {
            phoneNumber = "+" + phoneNumber;
        }

        String firstName = message.getFrom().getFirstName();
        String lastName = message.getFrom().getLastName();
        String username = message.getFrom().getUserName();

        Optional<TelegramUser> optionalUser = telegramUserRepository.findByTelegramId(telegramId);
        TelegramUser telegramUser;

        if (optionalUser.isPresent()) {
            telegramUser = optionalUser.get();
            telegramUser.setPhoneNumber(phoneNumber);
            telegramUser.setFirstName(firstName);
            telegramUser.setLastName(lastName);
            telegramUser.setUsername(username);
        } else {
            telegramUser = TelegramUser.builder()
                    .telegramId(telegramId)
                    .phoneNumber(phoneNumber)
                    .firstName(firstName)
                    .lastName(lastName)
                    .username(username)
                    .registeredAt(LocalDateTime.now())
                    .build();
        }

        telegramUserRepository.save(telegramUser);

        SendMessage sendMsg = new SendMessage();
        sendMsg.setChatId(message.getChatId().toString());
        sendMsg.setText("✅ Rahmat, " + (firstName != null ? firstName : "foydalanuvchi") + "! Telefon raqamingiz muvaffaqiyatli saqlandi: " + phoneNumber + "\n\nPRO Obuna sotib olish uchun to'lov cheki (skrinshot/rasm) yuboring!");
        sendMsg.setReplyMarkup(new ReplyKeyboardRemove(true));

        try {
            execute(sendMsg);
        } catch (TelegramApiException e) {
            e.printStackTrace();
        }
    }

    private void handleTextMessage(Message message) {
        Long telegramId = message.getFrom().getId();
        String chatId = message.getChatId().toString();
        String text = message.getText().trim();

        // Check if admin command /create_promo
        if (text.startsWith("/create_promo")) {
            if (telegramId.equals(adminId)) {
                String code = "PROMO-" + UUID.randomUUID().toString().substring(0, 6).toUpperCase();
                Promocode promo = Promocode.builder()
                        .code(code)
                        .durationDays(30)
                        .isUsed(false)
                        .createdAt(LocalDateTime.now())
                        .createdBy("SUPER_ADMIN")
                        .build();

                promocodeRepository.save(promo);

                SendMessage adminMsg = new SendMessage();
                adminMsg.setChatId(chatId);
                adminMsg.setText("👑 **YANGI 1 OYLIK PRO-KOD YARATILDI:**\n\n`" + code + "`\n\nUshbu kodni foydalanuvchiga yuborishingiz mumkin.");
                adminMsg.setParseMode("Markdown");

                try {
                    execute(adminMsg);
                } catch (TelegramApiException e) {
                    e.printStackTrace();
                }
                return;
            } else {
                SendMessage err = new SendMessage();
                err.setChatId(chatId);
                err.setText("⚠️ Ushbu komanda faqat Super Admin uchun ajratilgan!");
                try {
                    execute(err);
                } catch (TelegramApiException e) {
                    e.printStackTrace();
                }
                return;
            }
        }

        Optional<TelegramUser> optionalUser = telegramUserRepository.findByTelegramId(telegramId);
        SendMessage sendMsg = new SendMessage();
        sendMsg.setChatId(chatId);

        if (optionalUser.isPresent()) {
            TelegramUser u = optionalUser.get();
            sendMsg.setText("👋 Assalomu alaykum, " + (u.getFirstName() != null ? u.getFirstName() : "foydalanuvchi") + "!\nSiz allaqachon ro'yxatdan o'tgansiz.\n📲 Tel: " + u.getPhoneNumber() + "\n\n💳 PRO obuna olish uchun to'lov cheki rasmini ushbu botga yuboring!");
        } else {
            sendMsg.setText("👋 Assalomu alaykum! AvtoTest UZ botiga xush kelibsiz.\n\nDavom etish uchun pastdagi '📲 Kontaktni ulashish' tugmasini bosing:");

            KeyboardButton contactButton = KeyboardButton.builder()
                    .text("📲 Kontaktni ulashish")
                    .requestContact(true)
                    .build();

            KeyboardRow row = new KeyboardRow();
            row.add(contactButton);

            ReplyKeyboardMarkup keyboardMarkup = ReplyKeyboardMarkup.builder()
                    .keyboard(Collections.singletonList(row))
                    .resizeKeyboard(true)
                    .oneTimeKeyboard(true)
                    .build();

            sendMsg.setReplyMarkup(keyboardMarkup);
        }

        try {
            execute(sendMsg);
        } catch (TelegramApiException e) {
            e.printStackTrace();
        }
    }
}
