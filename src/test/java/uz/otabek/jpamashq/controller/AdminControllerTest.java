package uz.otabek.jpamashq.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import uz.otabek.jpamashq.entity.TelegramUser;
import uz.otabek.jpamashq.repository.TelegramUserRepository;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@SuppressWarnings("null")
class AdminControllerTest {

    @Mock
    private TelegramUserRepository telegramUserRepository;

    @InjectMocks
    private AdminController adminController;

    @BeforeEach
    void setUp() {
    }

    @Test
    void testGetTelegramUsers() {
        TelegramUser t1 = TelegramUser.builder()
                .telegramId(111L)
                .firstName("Test 1")
                .registeredAt(LocalDateTime.now())
                .build();
        TelegramUser t2 = TelegramUser.builder()
                .telegramId(222L)
                .firstName("Test 2")
                .registeredAt(LocalDateTime.now())
                .build();

        when(telegramUserRepository.findAll()).thenReturn(Arrays.asList(t1, t2));

        ResponseEntity<List<TelegramUser>> response = adminController.getTelegramUsers();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        List<TelegramUser> body = response.getBody();
        assertNotNull(body);
        assertEquals(2, body.size());
        assertEquals("Test 1", body.get(0).getFirstName());
    }
}
