package uz.otabek.jpamashq.bot;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;
import org.telegram.telegrambots.meta.api.methods.send.SendMessage;
import org.telegram.telegrambots.meta.api.objects.Chat;
import org.telegram.telegrambots.meta.api.objects.Message;
import org.telegram.telegrambots.meta.api.objects.Update;
import org.telegram.telegrambots.meta.api.objects.User;
import uz.otabek.jpamashq.entity.Promocode;
import uz.otabek.jpamashq.repository.PromocodeRepository;
import uz.otabek.jpamashq.repository.TelegramUserRepository;
import uz.otabek.jpamashq.repository.UserRepository;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("null")
class TelegramUpdateProcessorTest {

    @Mock
    private TelegramUserRepository telegramUserRepository;

    @Mock
    private PromocodeRepository promocodeRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TelegramBotSender sender;

    @InjectMocks
    private TelegramUpdateProcessor processor;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(processor, "adminId", 8212838308L);
    }

    @Test
    void testCreatePromo_ByAdmin_Success() throws Exception {
        Update update = new Update();
        Message message = new Message();
        User fromUser = new User();
        fromUser.setId(8212838308L);
        message.setFrom(fromUser);
        Chat chat = new Chat();
        chat.setId(12345L);
        message.setChat(chat);
        message.setText("/create_promo");
        update.setMessage(message);

        processor.processUpdate(update, sender);

        verify(promocodeRepository, times(1)).save(any(Promocode.class));
        ArgumentCaptor<SendMessage> captor = ArgumentCaptor.forClass(SendMessage.class);
        verify(sender, times(1)).execute(captor.capture());

        SendMessage sentMsg = captor.getValue();
        assertTrue(sentMsg.getText().contains("YANGI 1 OYLIK PROMO-KOD YARATILDI"));
    }

    @Test
    void testCreatePromo_ByNonAdmin_Fails() throws Exception {
        Update update = new Update();
        Message message = new Message();
        User fromUser = new User();
        fromUser.setId(11111L);
        message.setFrom(fromUser);
        Chat chat = new Chat();
        chat.setId(12345L);
        message.setChat(chat);
        message.setText("/create_promo");
        update.setMessage(message);

        processor.processUpdate(update, sender);

        verify(promocodeRepository, never()).save(any(Promocode.class));
        ArgumentCaptor<SendMessage> captor = ArgumentCaptor.forClass(SendMessage.class);
        verify(sender, times(1)).execute(captor.capture());

        SendMessage sentMsg = captor.getValue();
        assertTrue(sentMsg.getText().contains("Ushbu komanda faqat Super Admin uchun ajratilgan"));
    }
}
