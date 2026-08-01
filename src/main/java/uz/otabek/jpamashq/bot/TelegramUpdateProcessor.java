package uz.otabek.jpamashq.bot;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;
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
import uz.otabek.jpamashq.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
@RequiredArgsConstructor
public class TelegramUpdateProcessor {

    private final TelegramUserRepository telegramUserRepository;
    private final PromocodeRepository promocodeRepository;
    private final UserRepository userRepository;

    @Value("${telegram.bot.admin-id:8212838308}")
    private Long adminId;

    // Track user session state
    private final Map<Long, String> userStateMap = new ConcurrentHashMap<>();

    // Temporary storage for link codes (Code -> Phone Number)
    public static final Map<String, String> LINK_CODES = new ConcurrentHashMap<>();

    @Async("telegramBotTaskExecutor")
    public void processUpdate(Update update, TelegramBotSender sender) {
        try {
            if (update.hasMessage()) {
                Message message = update.getMessage();
                if (message.hasContact()) {
                    handleContactReceived(message, sender);
                } else if (message.hasPhoto()) {
                    handlePhotoReceived(message, sender);
                } else if (message.hasText()) {
                    handleTextMessage(message, sender);
                }
            }
        } catch (Exception e) {
            log.error("Error processing update {}: {}", update.getUpdateId(), e.getMessage(), e);
        }
    }

    private ReplyKeyboardMarkup buildMainMenu(Long telegramId) {
        List<KeyboardRow> keyboard = new ArrayList<>();
        KeyboardRow row1 = new KeyboardRow();
        row1.add(new KeyboardButton("📲 Kontaktni Ulashish"));
        row1.add(new KeyboardButton("💳 PRO Obuna Olish"));
        keyboard.add(row1);

        KeyboardRow row2 = new KeyboardRow();
        row2.add(new KeyboardButton("🔑 Promokodni Faollashtirish"));
        row2.add(new KeyboardButton("🌐 Saytga O'tish"));
        keyboard.add(row2);

        if (adminId != null && adminId.equals(telegramId)) {
            KeyboardRow adminRow = new KeyboardRow();
            adminRow.add(new KeyboardButton("👑 Admin Panel"));
            keyboard.add(adminRow);
        }

        return ReplyKeyboardMarkup.builder()
                .keyboard(keyboard)
                .resizeKeyboard(true)
                .build();
    }

    private void handlePhotoReceived(Message message, TelegramBotSender sender) throws TelegramApiException {
        Long telegramId = message.getFrom().getId();
        String firstName = message.getFrom().getFirstName();
        String username = message.getFrom().getUserName();
        Optional<TelegramUser> optUser = telegramUserRepository.findByTelegramId(telegramId);
        String phoneNumber = optUser.map(TelegramUser::getPhoneNumber).orElse("Noma'lum");

        List<PhotoSize> photos = message.getPhoto();
        PhotoSize photo = photos.stream().max(Comparator.comparing(PhotoSize::getFileSize)).orElse(null);

        if (photo != null && adminId != null) {
            String caption = String.format(
                "💳 **YANGI TO'LOV CHEKI KELDI!**\n\n👤 Foydalanuvchi: %s (@%s)\n📲 Tel: %s\n🆔 Telegram ID: `%d`\n\n⚡ Promokod yaratish uchun: `/create_promo` deb yozing.",
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
            sender.execute(sendPhoto);
        }

        SendMessage replyMsg = new SendMessage();
        replyMsg.setChatId(message.getChatId().toString());
        replyMsg.setText("✅ To'lov chekingiz Super Adminga muvaffaqiyatli yuborildi!\n\nTez orada to'lovingiz tasdiqlanib, sizga 1 oylik PROMO-KOD taqdim etiladi.");
        replyMsg.setReplyMarkup(buildMainMenu(telegramId));
        sender.execute(replyMsg);
    }

    private void handleContactReceived(Message message, TelegramBotSender sender) throws TelegramApiException {
        Contact contact = message.getContact();
        Long telegramId = message.getFrom().getId();
        String phoneNumber = contact.getPhoneNumber();

        if (phoneNumber != null && !phoneNumber.startsWith("+")) {
            phoneNumber = "+" + phoneNumber;
        }

        String firstName = message.getFrom().getFirstName();
        String lastName = message.getFrom().getLastName();
        String username = message.getFrom().getUserName();

        TelegramUser telegramUser = telegramUserRepository.findByTelegramId(telegramId).orElseGet(() -> 
            TelegramUser.builder()
                .telegramId(telegramId)
                .registeredAt(LocalDateTime.now())
                .build()
        );
        telegramUser.setPhoneNumber(phoneNumber);
        telegramUser.setFirstName(firstName);
        telegramUser.setLastName(lastName);
        telegramUser.setUsername(username);
        telegramUserRepository.save(telegramUser);

        SendMessage sendMsg = new SendMessage();
        sendMsg.setChatId(message.getChatId().toString());
        sendMsg.setText("✅ Rahmat, " + (firstName != null ? firstName : "foydalanuvchi") + "! Raqamingiz muvaffaqiyatli saqlandi: " + phoneNumber + "\n\nEndi bot imkoniyatlaridan to'liq foydalanishingiz mumkin 👇");
        sendMsg.setReplyMarkup(buildMainMenu(telegramId));
        sender.execute(sendMsg);
    }

    private void handleTextMessage(Message message, TelegramBotSender sender) throws TelegramApiException {
        Long telegramId = message.getFrom().getId();
        String chatId = message.getChatId().toString();
        String text = message.getText().trim();

        if (text.startsWith("/create_promo")) {
            if (adminId != null && telegramId.equals(adminId)) {
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
                adminMsg.setText("👑 **YANGI 1 OYLIK PROMO-KOD YARATILDI:**\n\n`" + code + "`\n\nUshbu kodni foydalanuvchiga yuborishingiz mumkin. Foydalanuvchi uni botda yoki saytda kiritishi mumkin!");
                adminMsg.setParseMode("Markdown");
                adminMsg.setReplyMarkup(buildMainMenu(telegramId));
                sender.execute(adminMsg);
            } else {
                SendMessage err = new SendMessage();
                err.setChatId(chatId);
                err.setText("⚠️ Ushbu komanda faqat Super Admin uchun ajratilgan!");
                sender.execute(err);
            }
            return;
        }

        if (text.equalsIgnoreCase("/link") || text.equalsIgnoreCase("🔗 Profilni ulashish")) {
            Optional<TelegramUser> optUser = telegramUserRepository.findByTelegramId(telegramId);
            if (optUser.isPresent() && optUser.get().getPhoneNumber() != null) {
                String code = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
                LINK_CODES.put(code, optUser.get().getPhoneNumber());
                SendMessage sendMsg = new SendMessage();
                sendMsg.setChatId(chatId);
                sendMsg.setText("🔗 **Sizning ulashish kodingiz:** `" + code + "`\n\nUshbu kodni saytdagi profilingizga (Telegram ulashish) kiritib, akkauntingizni ulashing!");
                sendMsg.setParseMode("Markdown");
                sender.execute(sendMsg);
            } else {
                SendMessage sendMsg = new SendMessage();
                sendMsg.setChatId(chatId);
                sendMsg.setText("⚠️ Oldin kontaktingizni ulashingiz kerak! Pastdagi tugmani bosing:");
                sender.execute(sendMsg);
            }
            return;
        }

        if (text.equalsIgnoreCase("📲 Kontaktni Ulashish") || text.equalsIgnoreCase("/contact")) {
            SendMessage sendMsg = new SendMessage();
            sendMsg.setChatId(chatId);
            sendMsg.setText("📲 Pastdagi '📲 Kontaktni ulashish' tugmasini bosing:");
            KeyboardButton contactButton = KeyboardButton.builder().text("📲 Kontaktni ulashish").requestContact(true).build();
            ReplyKeyboardMarkup keyboardMarkup = ReplyKeyboardMarkup.builder().keyboard(Collections.singletonList(new KeyboardRow(Collections.singletonList(contactButton)))).resizeKeyboard(true).oneTimeKeyboard(true).build();
            sendMsg.setReplyMarkup(keyboardMarkup);
            sender.execute(sendMsg);
            return;
        }

        if (text.equalsIgnoreCase("💳 PRO Obuna Olish")) {
            String infoText = "⭐ **AVTOTEST UZ — PRO OBUNA**\n\nPRO obuna imkoniyatlari:\n✅ 1000+ barcha PDD biletlariga cheksiz kirish\n✅ Barcha qoidalar va yo'l belgilariga batafsil izohlar\n✅ Shaxsiy statistika va xatolar ustida ishlash\n✅ Super-tezkor va reklamasiz portal\n\n💰 Obuna narxi: **15,000 so'm / 1 oy**\n\n💳 **To'lov uchun karta raqami:**\n`8600 1234 5678 9012` (AvtoTest UZ / Bekmurod)\n\n📸 **Qanday faollashtiriladi?**\n1. To'lovni amalga oshiring.\n2. Ushbu botga to'lov cheki (rasm/skrinshot) yuboring.\n3. Chek Super Admin tomonidan tasdiqlanib, sizga PROMO-KOD taqdim etiladi!";
            SendMessage sendMsg = new SendMessage();
            sendMsg.setChatId(chatId);
            sendMsg.setText(infoText);
            sendMsg.setParseMode("Markdown");
            sendMsg.setReplyMarkup(buildMainMenu(telegramId));
            sender.execute(sendMsg);
            return;
        }

        if (text.equalsIgnoreCase("🔑 Promokodni Faollashtirish")) {
            userStateMap.put(telegramId, "WAITING_PROMOCODE");
            SendMessage sendMsg = new SendMessage();
            sendMsg.setChatId(chatId);
            sendMsg.setText("🔑 **Iltimos, sizga berilgan PROMO-KODNI kiriting:**\n\n(Masalan: `PROMO-A8X9K2`)");
            sendMsg.setParseMode("Markdown");
            sender.execute(sendMsg);
            return;
        }

        if (text.equalsIgnoreCase("🌐 Saytga O'tish")) {
            SendMessage sendMsg = new SendMessage();
            sendMsg.setChatId(chatId);
            sendMsg.setText("🌐 **AvtoTest UZ Rasmiy Portali:**\nhttps://avtotest-uz.onrender.com\n\nSaytga tashrif buyuring va PDD imtihonlarini topshirishni boshlang!");
            sendMsg.setReplyMarkup(buildMainMenu(telegramId));
            sender.execute(sendMsg);
            return;
        }

        if (text.equalsIgnoreCase("👑 Admin Panel") && adminId != null && telegramId.equals(adminId)) {
            long botUsersCount = telegramUserRepository.count();
            long sysUsersCount = userRepository.count();
            long totalPromos = promocodeRepository.count();
            long activeProCount = userRepository.findAll().stream().filter(u -> Boolean.TRUE.equals(u.getIsPro())).count();

            String adminText = String.format("👑 **SUPER ADMIN BOSHGARUV KONSOLI**\n\n👥 Botdagi foydalanuvchilar: **%d ta**\n👤 Saytdagi a'zolar: **%d ta**\n🔑 Yaratilgan promokodlar: **%d ta**\n⭐ Aktiv PRO obunachilar: **%d ta**\n\n⚡ Yangi 1 oylik promokod yaratish uchun buyruq: `/create_promo`", botUsersCount, sysUsersCount, totalPromos, activeProCount);
            SendMessage sendMsg = new SendMessage();
            sendMsg.setChatId(chatId);
            sendMsg.setText(adminText);
            sendMsg.setParseMode("Markdown");
            sendMsg.setReplyMarkup(buildMainMenu(telegramId));
            sender.execute(sendMsg);
            return;
        }

        String currentState = userStateMap.getOrDefault(telegramId, "");
        if ("WAITING_PROMOCODE".equals(currentState) || text.toUpperCase().startsWith("PROMO-")) {
            userStateMap.remove(telegramId);
            String code = text.trim().toUpperCase();
            Optional<Promocode> optPromo = promocodeRepository.findByCode(code);
            SendMessage sendMsg = new SendMessage();
            sendMsg.setChatId(chatId);
            sendMsg.setReplyMarkup(buildMainMenu(telegramId));

            if (optPromo.isEmpty()) {
                sendMsg.setText("⚠️ **Kiritilgan promokod noto'g'ri yoki mavjud emas!**\nIltimos, kodni qayta tekshirib kiriting.");
                sendMsg.setParseMode("Markdown");
            } else {
                Promocode promo = optPromo.get();
                if (Boolean.TRUE.equals(promo.getIsUsed())) {
                    sendMsg.setText("⚠️ **Ushbu promokod allaqachon ishlatilgan!**");
                } else {
                    promo.setIsUsed(true);
                    promo.setUsedAt(LocalDateTime.now());
                    promo.setUsedByUsername("TelegramID:" + telegramId);
                    promocodeRepository.save(promo);
                    sendMsg.setText("🎉 **TABRIKLAYMIZ!**\n\n`" + code + "` promokodi muvaffaqiyatli tekshirildi va 30 kunlik PRO status berildi!\n\nSaytdagi profilingizda ham ushbu kodni faollashtirishingiz mumkin.");
                    sendMsg.setParseMode("Markdown");
                }
            }
            sender.execute(sendMsg);
            return;
        }

        Optional<TelegramUser> optUser = telegramUserRepository.findByTelegramId(telegramId);
        if (optUser.isEmpty() || optUser.get().getPhoneNumber() == null) {
            SendMessage requestContactMsg = new SendMessage();
            requestContactMsg.setChatId(chatId);
            requestContactMsg.setText("🚗 **AvtoTest UZ botiga xush kelibsiz!**\n\nBot imkoniyatlaridan to'liq foydalanish uchun iltimos, pastdagi **'📲 Kontaktni ulashish'** tugmasini bosing:");
            requestContactMsg.setParseMode("Markdown");
            
            KeyboardButton contactButton = KeyboardButton.builder().text("📲 Kontaktni ulashish").requestContact(true).build();
            ReplyKeyboardMarkup keyboardMarkup = ReplyKeyboardMarkup.builder()
                    .keyboard(Collections.singletonList(new KeyboardRow(Collections.singletonList(contactButton))))
                    .resizeKeyboard(true)
                    .oneTimeKeyboard(true)
                    .build();
            requestContactMsg.setReplyMarkup(keyboardMarkup);
            sender.execute(requestContactMsg);
            return;
        }

        SendMessage sendMsg = new SendMessage();
        sendMsg.setChatId(chatId);
        sendMsg.setText("🚗 **AvtoTest UZ — PDD Imtihon va PRO Obuna Boti**\n\n" +
            "Xush kelibsiz, " + (optUser.get().getFirstName() != null ? optUser.get().getFirstName() : "") + "! Ushbu bot orqali PDD imtihoniga tayyorlanishingiz, PRO obuna xarid qilishingiz hamda promokodlarni faollashtirishingiz mumkin.\n\n" +
            "Kerakli bo'limni tanlang 👇");
        sendMsg.setParseMode("Markdown");
        sendMsg.setReplyMarkup(buildMainMenu(telegramId));
        sender.execute(sendMsg);
    }
}
