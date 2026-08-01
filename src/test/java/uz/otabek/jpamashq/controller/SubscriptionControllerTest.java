package uz.otabek.jpamashq.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import uz.otabek.jpamashq.entity.Promocode;
import uz.otabek.jpamashq.entity.User;
import uz.otabek.jpamashq.repository.PromocodeRepository;
import uz.otabek.jpamashq.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SubscriptionControllerTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PromocodeRepository promocodeRepository;

    @InjectMocks
    private SubscriptionController subscriptionController;

    private User testUser;
    private Promocode testPromo;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .username("testuser")
                .isPro(false)
                .build();

        testPromo = Promocode.builder()
                .code("PROMO-TEST")
                .durationDays(30)
                .isUsed(false)
                .build();
    }

    @Test
    void testActivatePromoCode_Success() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(promocodeRepository.findByCode("PROMO-TEST")).thenReturn(Optional.of(testPromo));

        Map<String, String> payload = new HashMap<>();
        payload.put("username", "testuser");
        payload.put("code", "PROMO-TEST");

        ResponseEntity<Map<String, Object>> response = subscriptionController.activatePromoCode(payload);

        assertEquals(200, response.getStatusCodeValue());
        assertTrue((Boolean) response.getBody().get("success"));
        assertTrue(testUser.getIsPro());
        assertTrue(testPromo.getIsUsed());
        assertNotNull(testUser.getProExpiresAt());

        verify(userRepository, times(1)).save(testUser);
        verify(promocodeRepository, times(1)).save(testPromo);
    }

    @Test
    void testActivatePromoCode_AlreadyUsed() {
        testPromo.setIsUsed(true);
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        when(promocodeRepository.findByCode("PROMO-TEST")).thenReturn(Optional.of(testPromo));

        Map<String, String> payload = new HashMap<>();
        payload.put("username", "testuser");
        payload.put("code", "PROMO-TEST");

        ResponseEntity<Map<String, Object>> response = subscriptionController.activatePromoCode(payload);

        assertEquals(400, response.getStatusCodeValue());
        assertFalse((Boolean) response.getBody().get("success"));
        assertEquals("Ushbu promokod allaqachon ishlatilgan!", response.getBody().get("message"));

        verify(userRepository, never()).save(any());
        verify(promocodeRepository, never()).save(any());
    }
}
