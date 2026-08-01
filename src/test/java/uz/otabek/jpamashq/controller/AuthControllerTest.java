package uz.otabek.jpamashq.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import uz.otabek.jpamashq.dto.AuthResponse;
import uz.otabek.jpamashq.dto.LoginRequest;
import uz.otabek.jpamashq.dto.RegisterRequest;
import uz.otabek.jpamashq.entity.User;
import uz.otabek.jpamashq.repository.UserRepository;

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
        testUser = User.builder()
                .id(1L)
                .username("testuser")
                .password("password123")
                .email("test@example.com")
                .role("USER")
                .permissions("BASIC")
                .build();
    }

    @Test
    void testLogin_Success() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));

        LoginRequest request = new LoginRequest();
        request.setUsernameOrEmail("testuser");
        request.setPassword("password123");

        ResponseEntity<AuthResponse> response = authController.login(request);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
        assertEquals("testuser", response.getBody().getUsername());
    }

    @Test
    void testLogin_Failure_WrongPassword() {
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));

        LoginRequest request = new LoginRequest();
        request.setUsernameOrEmail("testuser");
        request.setPassword("wrongpassword");

        ResponseEntity<AuthResponse> response = authController.login(request);

        // Controller returns 400 BAD_REQUEST for wrong credentials
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
    }

    @Test
    void testLogin_Failure_UserNotFound() {
        when(userRepository.findByUsername("unknownuser")).thenReturn(Optional.empty());
        when(userRepository.findByEmail("unknownuser")).thenReturn(Optional.empty());

        LoginRequest request = new LoginRequest();
        request.setUsernameOrEmail("unknownuser");
        request.setPassword("pass");

        ResponseEntity<AuthResponse> response = authController.login(request);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
    }

    @Test
    void testRegister_Success() {
        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("new@test.com")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        RegisterRequest request = new RegisterRequest();
        request.setUsername("newuser");
        request.setEmail("new@test.com");
        request.setPassword("pass123");

        ResponseEntity<AuthResponse> response = authController.register(request);

        verify(userRepository, times(1)).save(any(User.class));
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
    }

    @Test
    void testRegister_Failure_DuplicateUsername() {
        when(userRepository.existsByUsername("existinguser")).thenReturn(true);

        RegisterRequest request = new RegisterRequest();
        request.setUsername("existinguser");
        request.setEmail("new@test.com");
        request.setPassword("pass123");

        ResponseEntity<AuthResponse> response = authController.register(request);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testRegister_Failure_DuplicateEmail() {
        when(userRepository.existsByUsername("newuser")).thenReturn(false);
        when(userRepository.existsByEmail("existing@test.com")).thenReturn(true);

        RegisterRequest request = new RegisterRequest();
        request.setUsername("newuser");
        request.setEmail("existing@test.com");
        request.setPassword("pass123");

        ResponseEntity<AuthResponse> response = authController.register(request);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertFalse(response.getBody().isSuccess());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void testRegister_Success_WithPhone() {
        when(userRepository.existsByUsername("phoneuser")).thenReturn(false);
        when(userRepository.existsByTelegramPhone("+998901234567")).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        RegisterRequest request = new RegisterRequest();
        request.setUsername("phoneuser");
        request.setPhone("+998901234567");
        request.setPassword("pass123");

        ResponseEntity<AuthResponse> response = authController.register(request);

        verify(userRepository, times(1)).save(any(User.class));
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertTrue(response.getBody().isSuccess());
    }
}
