package uz.otabek.jpamashq.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import uz.otabek.jpamashq.entity.User;
import uz.otabek.jpamashq.repository.UserRepository;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private AuthController authController;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");
        testUser.setPassword("password123");
        testUser.setEmail("test@example.com");
    }

    @Test
    void testLogin_Success() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        
        Map<String, String> payload = new HashMap<>();
        payload.put("usernameOrEmail", "testuser");
        payload.put("password", "password123");
        
        ResponseEntity<?> response = authController.login(payload);
        
        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody().toString().contains("success=true"));
    }

    @Test
    void testLogin_Failure_WrongPassword() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        
        Map<String, String> payload = new HashMap<>();
        payload.put("usernameOrEmail", "testuser");
        payload.put("password", "wrongpass");
        
        ResponseEntity<?> response = authController.login(payload);
        
        assertEquals(401, response.getStatusCodeValue());
        assertTrue(response.getBody().toString().contains("success=false"));
    }

    @Test
    void testRegister_Success() {
        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("new@test.com")).thenReturn(false);
        
        Map<String, String> payload = new HashMap<>();
        payload.put("username", "newuser");
        payload.put("email", "new@test.com");
        payload.put("password", "pass123");
        
        ResponseEntity<?> response = authController.register(payload);
        
        verify(userRepository, times(1)).save(any(User.class));
        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody().toString().contains("success=true"));
    }
}
