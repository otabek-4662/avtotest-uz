package uz.otabek.jpamashq.controller;

import jakarta.annotation.PostConstruct;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uz.otabek.jpamashq.dto.AuthResponse;
import uz.otabek.jpamashq.dto.GoogleAuthRequest;
import uz.otabek.jpamashq.dto.LoginRequest;
import uz.otabek.jpamashq.dto.RegisterRequest;
import uz.otabek.jpamashq.dto.TelegramAuthRequest;
import uz.otabek.jpamashq.entity.User;
import uz.otabek.jpamashq.repository.UserRepository;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@SuppressWarnings("null")
public class AuthController {

    private final UserRepository userRepository;

    @Value("${superadmin.password:otabek4662}")
    private String superAdminPassword;

    @Value("${telegram.bot.token:dummy_token}")
    private String telegramBotToken;

    @Value("${google.client.id:YOUR_GOOGLE_CLIENT_ID_HERE}")
    private String googleClientId;

    // =====================================================================
    // YORDAMCHI METODLAR
    // =====================================================================

    private String normalizePhone(String raw) {
        if (raw == null) return null;
        String digits = raw.replaceAll("[^0-9]", "");
        if (digits.length() == 9) return "+998" + digits;
        if (digits.length() == 12 && digits.startsWith("998")) return "+" + digits;
        return raw.trim();
    }

    /** UUID asosidagi session token generatsiyasi */
    private String generateToken() {
        return UUID.randomUUID().toString();
    }

    /**
     * Telegram Login Widget hash ni HMAC-SHA256 orqali tekshiradi.
     * Telegram docs: https://core.telegram.org/widgets/login#checking-authorization
     */
    private boolean verifyTelegramHash(TelegramAuthRequest data) {
        try {
            // 1) BOT_TOKEN ning SHA-256 hash ini olish
            MessageDigest sha256 = MessageDigest.getInstance("SHA-256");
            byte[] secretKey = sha256.digest(telegramBotToken.getBytes(StandardCharsets.UTF_8));

            // 2) Data-string yasash (barcha maydonlar, hash-dan tashqari, alifbo tartibida)
            Map<String, String> dataMap = new TreeMap<>();
            if (data.getId() != null)         dataMap.put("id",         String.valueOf(data.getId()));
            if (data.getFirst_name() != null) dataMap.put("first_name", data.getFirst_name());
            if (data.getLast_name() != null)  dataMap.put("last_name",  data.getLast_name());
            if (data.getUsername() != null)   dataMap.put("username",   data.getUsername());
            if (data.getPhoto_url() != null)  dataMap.put("photo_url",  data.getPhoto_url());
            if (data.getAuth_date() != null)  dataMap.put("auth_date",  String.valueOf(data.getAuth_date()));

            String dataString = dataMap.entrySet().stream()
                    .map(e -> e.getKey() + "=" + e.getValue())
                    .collect(Collectors.joining("\n"));

            // 3) HMAC-SHA256 hisoblash
            Mac hmac = Mac.getInstance("HmacSHA256");
            hmac.init(new SecretKeySpec(secretKey, "HmacSHA256"));
            byte[] hmacBytes = hmac.doFinal(dataString.getBytes(StandardCharsets.UTF_8));

            // 4) Hex formatga o'tkazish
            StringBuilder hexHash = new StringBuilder();
            for (byte b : hmacBytes) {
                hexHash.append(String.format("%02x", b));
            }

            // 5) Taqqoslash
            return hexHash.toString().equals(data.getHash());
        } catch (Exception e) {
            log.error("Telegram hash tekshirishda xatolik: {}", e.getMessage());
            return false;
        }
    }

    /**
     * Telegram auth_date ni tekshiradi — 1 soatdan eski bo'lmasin.
     */
    private boolean isTelegramAuthFresh(Long authDate) {
        if (authDate == null) return false;
        long now = Instant.now().getEpochSecond();
        return (now - authDate) < 3600; // 1 soat
    }

    /**
     * Google ID Token ni Google tokeninfo API orqali tekshiradi va payload qaytaradi.
     * Returns null if invalid.
     */
    private Map<String, String> verifyGoogleIdToken(String idToken) {
        try {
            HttpClient client = HttpClient.newHttpClient();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://oauth2.googleapis.com/tokeninfo?id_token=" + idToken))
                    .GET()
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
            if (response.statusCode() != 200) {
                log.warn("Google tokeninfo qaytdi: {}", response.statusCode());
                return null;
            }

            // JSON ni parse qilish (sodda yondashuv, kutubxonasiz)
            String body = response.body();
            Map<String, String> payload = new HashMap<>();
            // "key":"value" larni ajratamiz
            body = body.replaceAll("[{}]", "");
            String[] parts = body.split(",");
            for (String part : parts) {
                String[] kv = part.split(":", 2);
                if (kv.length == 2) {
                    String key = kv[0].trim().replaceAll("\"", "");
                    String val = kv[1].trim().replaceAll("\"", "");
                    payload.put(key, val);
                }
            }

            // aud (audience) tekshirish — bizning Client ID ga mos bo'lishi kerak
            String aud = payload.get("aud");
            if (aud != null && !googleClientId.equals("YOUR_GOOGLE_CLIENT_ID_HERE") && !aud.equals(googleClientId)) {
                log.warn("Google token audience mos kelmadi: aud={}, expected={}", aud, googleClientId);
                return null;
            }

            return payload;
        } catch (Exception e) {
            log.error("Google token tekshirishda xatolik: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Username ni unique qilish — agar mavjud bo'lsa raqam qo'shish.
     */
    private String makeUniqueUsername(String base) {
        String candidate = base.replaceAll("[^a-zA-Z0-9_]", "_").toLowerCase();
        if (candidate.length() > 30) candidate = candidate.substring(0, 30);
        if (!userRepository.existsByUsername(candidate)) return candidate;
        for (int i = 1; i <= 999; i++) {
            String next = candidate + i;
            if (!userRepository.existsByUsername(next)) return next;
        }
        return candidate + "_" + System.currentTimeMillis() % 10000;
    }

    // =====================================================================
    // SUPER ADMIN INIT
    // =====================================================================

    @PostConstruct
    public void initSuperAdmin() {
        try {
            Optional<User> superAdminOpt = userRepository.findByUsername("otabek");
            if (superAdminOpt.isEmpty()) {
                superAdminOpt = userRepository.findByTelegramPhone("+998504554662");
            }

            String adminPass = (superAdminPassword != null && !superAdminPassword.isEmpty()) ? superAdminPassword : "otabek4662";

            if (superAdminOpt.isEmpty()) {
                User superAdmin = User.builder()
                        .username("otabek")
                        .email("otabeksotimov9@gmail.com")
                        .telegramPhone("+998504554662")
                        .password(adminPass)
                        .role("SUPER_ADMIN")
                        .permissions("ALL,MANAGE_USERS,MANAGE_TESTS,ANNOUNCEMENTS")
                        .authProvider("LOCAL")
                        .build();
                userRepository.save(superAdmin);
            } else {
                User superAdmin = superAdminOpt.get();
                superAdmin.setTelegramPhone("+998504554662");
                superAdmin.setPassword(adminPass);
                superAdmin.setRole("SUPER_ADMIN");
                superAdmin.setPermissions("ALL,MANAGE_USERS,MANAGE_TESTS,ANNOUNCEMENTS");
                userRepository.save(superAdmin);
            }
        } catch (Exception e) {
            // Ignore if database unavailable during init
        }
    }

    // =====================================================================
    // STANDART REGISTER / LOGIN
    // =====================================================================

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body(
                AuthResponse.builder()
                    .success(false)
                    .message("Bu foydalanuvchi nomi allaqachon mavjud!")
                    .build()
            );
        }

        String phone = normalizePhone(request.getPhone());
        String email = request.getEmail() != null ? request.getEmail().trim() : null;

        if (phone != null && !phone.isEmpty()) {
            if (userRepository.existsByTelegramPhone(phone)) {
                return ResponseEntity.badRequest().body(
                    AuthResponse.builder()
                        .success(false)
                        .message("Bu telefon raqami allaqachon ro'yxatdan o'tgan!")
                        .build()
                );
            }
        }

        if (email != null && !email.isEmpty() && !email.contains("@autotest.uz")) {
            if (userRepository.existsByEmail(email)) {
                return ResponseEntity.badRequest().body(
                    AuthResponse.builder()
                        .success(false)
                        .message("Bu email manzili allaqachon ro'yxatdan o'tgan!")
                        .build()
                );
            }
        }

        String finalEmail = (email != null && !email.isEmpty()) ? email : (phone != null ? phone + "@autotest.uz" : request.getUsername() + "@autotest.uz");
        boolean isSuperAdmin = finalEmail.equalsIgnoreCase("otabeksotimov9@gmail.com") || request.getUsername().equalsIgnoreCase("otabek") || (phone != null && phone.contains("504554662"));
        String assignedRole = isSuperAdmin ? "SUPER_ADMIN" : (request.getUsername().equalsIgnoreCase("admin") ? "ADMIN" : "USER");
        String assignedPermissions = isSuperAdmin ? "ALL,MANAGE_USERS,MANAGE_TESTS,ANNOUNCEMENTS" : (assignedRole.equals("ADMIN") ? "MANAGE_USERS,MANAGE_TESTS" : "BASIC");

        User user = User.builder()
                .username(request.getUsername())
                .email(finalEmail)
                .telegramPhone(phone)
                .password(request.getPassword())
                .role(assignedRole)
                .permissions(assignedPermissions)
                .authProvider("LOCAL")
                .build();

        userRepository.save(user);

        return ResponseEntity.ok(
            AuthResponse.builder()
                .success(true)
                .message("Ro'yxatdan muvaffaqiyatli o'tdingiz!")
                .username(user.getUsername())
                .token(generateToken())
                .role(user.getRole())
                .permissions(user.getPermissions())
                .build()
        );
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        String input = request.getUsernameOrEmail().trim();
        String normalizedPhone = normalizePhone(input);

        Optional<User> userOptional = userRepository.findByUsername(input);
        if (userOptional.isEmpty()) {
            userOptional = userRepository.findByEmail(input);
        }
        if (userOptional.isEmpty()) {
            userOptional = userRepository.findByTelegramPhone(input);
        }
        if (userOptional.isEmpty() && normalizedPhone != null) {
            userOptional = userRepository.findByTelegramPhone(normalizedPhone);
        }

        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body(
                AuthResponse.builder()
                    .success(false)
                    .message("Foydalanuvchi nomi, telefon raqami yoki parol noto'g'ri!")
                    .build()
            );
        }

        User user = userOptional.get();

        // Parol tekshirish (OAuth foydalanuvchilar uchun parol null bo'lishi mumkin)
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            String provider = user.getAuthProvider() != null ? user.getAuthProvider() : "ijtimoiy tarmoq";
            return ResponseEntity.badRequest().body(
                AuthResponse.builder()
                    .success(false)
                    .message("Bu akkaunt " + provider + " orqali ro'yxatdan o'tgan. Iltimos, " + provider + " orqali kiring.")
                    .build()
            );
        }

        if (!user.getPassword().equals(request.getPassword())) {
            return ResponseEntity.badRequest().body(
                AuthResponse.builder()
                    .success(false)
                    .message("Foydalanuvchi nomi, telefon raqami yoki parol noto'g'ri!")
                    .build()
            );
        }

        // Enforce SUPER_ADMIN role for Super Admin accounts
        if (user.getUsername().equalsIgnoreCase("otabek") ||
                (user.getTelegramPhone() != null && user.getTelegramPhone().contains("504554662")) ||
                (user.getEmail() != null && user.getEmail().equalsIgnoreCase("otabeksotimov9@gmail.com"))) {
            user.setRole("SUPER_ADMIN");
            user.setPermissions("ALL,MANAGE_USERS,MANAGE_TESTS,ANNOUNCEMENTS");
            userRepository.save(user);
        }

        return ResponseEntity.ok(
            AuthResponse.builder()
                .success(true)
                .message("Xush kelibsiz, " + user.getUsername() + "!")
                .username(user.getUsername())
                .token(generateToken())
                .role(user.getRole() != null ? user.getRole() : "USER")
                .permissions(user.getPermissions() != null ? user.getPermissions() : "BASIC")
                .avatarUrl(user.getAvatarUrl())
                .displayName(user.getDisplayName())
                .build()
        );
    }

    // =====================================================================
    // TELEGRAM LOGIN WIDGET
    // =====================================================================

    /**
     * Telegram Login Widget orqali avtorizatsiya.
     * 
     * Jarayon:
     * 1. Frontend Telegram widget dan data oladi
     * 2. Ushbu endpoint ga yuboradi
     * 3. Backend hash ni HMAC-SHA256 bilan tekshiradi
     * 4. Foydalanuvchi topilsa — JWT qaytaradi
     * 5. Yangi foydalanuvchi bo'lsa — avtomatik ro'yxatdan o'tkazadi
     */
    @PostMapping("/telegram")
    public ResponseEntity<AuthResponse> telegramLogin(@RequestBody TelegramAuthRequest data) {
        // 1) Majburiy maydonlarni tekshirish
        if (data.getId() == null || data.getHash() == null) {
            return ResponseEntity.badRequest().body(
                AuthResponse.builder()
                    .success(false)
                    .message("Telegram ma'lumotlari to'liq emas!")
                    .build()
            );
        }

        // 2) Auth sanasi tekshirish (1 soatdan eski bo'lmasin)
        if (!isTelegramAuthFresh(data.getAuth_date())) {
            return ResponseEntity.badRequest().body(
                AuthResponse.builder()
                    .success(false)
                    .message("Telegram avtorizatsiyasi muddati o'tgan. Qayta urinib ko'ring.")
                    .build()
            );
        }

        // 3) Hash xavfsizlik tekshiruvi (BOT_TOKEN dummy bo'lsa o'tkazib yuboramiz)
        if (!"dummy_token".equals(telegramBotToken)) {
            if (!verifyTelegramHash(data)) {
                return ResponseEntity.badRequest().body(
                    AuthResponse.builder()
                        .success(false)
                        .message("Telegram avtorizatsiyasi noto'g'ri (hash xato)!")
                        .build()
                );
            }
        }

        // 4) Mavjud foydalanuvchini telegramId bo'yicha qidirish
        Optional<User> existingUser = userRepository.findByTelegramId(data.getId());

        User user;
        boolean isNewUser = false;

        if (existingUser.isPresent()) {
            // Foydalanuvchi mavjud — ma'lumotlarni yangilash
            user = existingUser.get();
            updateTelegramUserData(user, data);
            userRepository.save(user);
        } else {
            // Yangi foydalanuvchi — ro'yxatdan o'tkazish
            isNewUser = true;
            user = createUserFromTelegram(data);
            userRepository.save(user);
        }

        String displayName = buildDisplayName(data.getFirst_name(), data.getLast_name(), data.getUsername());

        return ResponseEntity.ok(
            AuthResponse.builder()
                .success(true)
                .message(isNewUser
                    ? "Telegram orqali muvaffaqiyatli ro'yxatdan o'tdingiz, " + user.getUsername() + "!"
                    : "Xush kelibsiz, " + user.getUsername() + "!")
                .username(user.getUsername())
                .token(generateToken())
                .role(user.getRole() != null ? user.getRole() : "USER")
                .permissions(user.getPermissions() != null ? user.getPermissions() : "BASIC")
                .avatarUrl(user.getAvatarUrl())
                .displayName(displayName)
                .build()
        );
    }

    private void updateTelegramUserData(User user, TelegramAuthRequest data) {
        if (data.getPhoto_url() != null) user.setAvatarUrl(data.getPhoto_url());
        String fullName = buildDisplayName(data.getFirst_name(), data.getLast_name(), data.getUsername());
        if (fullName != null) user.setDisplayName(fullName);
    }

    private User createUserFromTelegram(TelegramAuthRequest data) {
        // Username yasash: telegram username → first_name → tg_id
        String baseUsername = data.getUsername() != null
                ? data.getUsername()
                : (data.getFirst_name() != null ? data.getFirst_name() : "tg" + data.getId());

        String uniqueUsername = makeUniqueUsername(baseUsername);
        String displayName = buildDisplayName(data.getFirst_name(), data.getLast_name(), data.getUsername());

        // Email: telegram ID dan yasalgan placeholder
        String fakeEmail = "tg_" + data.getId() + "@autotest.uz";

        return User.builder()
                .username(uniqueUsername)
                .email(fakeEmail)
                .password(null) // Telegram foydalanuvchilari uchun parol yo'q
                .role("USER")
                .permissions("BASIC")
                .telegramId(data.getId())
                .avatarUrl(data.getPhoto_url())
                .displayName(displayName)
                .authProvider("TELEGRAM")
                .build();
    }

    private String buildDisplayName(String firstName, String lastName, String username) {
        if (firstName != null && lastName != null) return firstName + " " + lastName;
        if (firstName != null) return firstName;
        if (username != null) return username;
        return null;
    }

    // =====================================================================
    // GOOGLE OAUTH
    // =====================================================================

    /**
     * Google Sign-In orqali avtorizatsiya.
     * 
     * Jarayon:
     * 1. Frontend Google GSI dan credential (JWT) oladi
     * 2. Ushbu endpoint ga yuboradi
     * 3. Backend Google tokeninfo API orqali tekshiradi
     * 4. Foydalanuvchi topilsa — JWT qaytaradi
     * 5. Yangi bo'lsa — avtomatik ro'yxatdan o'tkazadi
     */
    @PostMapping("/google")
    public ResponseEntity<AuthResponse> googleLogin(@RequestBody GoogleAuthRequest data) {
        String googleId = null;
        String email = null;
        String name = null;
        String pictureUrl = null;

        // idToken orqali tekshirish (xavfsizroq yo'l)
        if (data.getIdToken() != null && !data.getIdToken().isBlank()) {
            Map<String, String> payload = verifyGoogleIdToken(data.getIdToken());
            if (payload == null) {
                return ResponseEntity.badRequest().body(
                    AuthResponse.builder()
                        .success(false)
                        .message("Google token yaroqsiz yoki muddati o'tgan!")
                        .build()
                );
            }
            googleId   = payload.get("sub");
            email      = payload.get("email");
            name       = payload.get("name");
            pictureUrl = payload.get("picture");
        } else {
            // Fallback: frontend to'g'ridan-to'g'ri yuborgan ma'lumotlar
            googleId   = data.getGoogleId();
            email      = data.getEmail();
            name       = data.getName();
            pictureUrl = data.getPictureUrl();
        }

        // Majburiy ma'lumotlarni tekshirish
        if (googleId == null || googleId.isBlank()) {
            return ResponseEntity.badRequest().body(
                AuthResponse.builder()
                    .success(false)
                    .message("Google foydalanuvchi ID si topilmadi!")
                    .build()
            );
        }

        // Mavjud foydalanuvchini qidirish
        Optional<User> existingUser = userRepository.findByGoogleId(googleId);
        if (existingUser.isEmpty() && email != null) {
            // Email bo'yicha ham qidirish (oldin LOCAL ro'yxatdan o'tgan bo'lishi mumkin)
            existingUser = userRepository.findByEmail(email);
        }

        User user;
        boolean isNewUser = false;

        if (existingUser.isPresent()) {
            // Foydalanuvchi mavjud — Google ID va avatar ni yangilash
            user = existingUser.get();
            if (user.getGoogleId() == null) user.setGoogleId(googleId);
            if (pictureUrl != null) user.setAvatarUrl(pictureUrl);
            if (name != null && user.getDisplayName() == null) user.setDisplayName(name);
            userRepository.save(user);
        } else {
            // Yangi foydalanuvchi
            isNewUser = true;
            user = createUserFromGoogle(googleId, email, name, pictureUrl);
            userRepository.save(user);
        }

        return ResponseEntity.ok(
            AuthResponse.builder()
                .success(true)
                .message(isNewUser
                    ? "Google orqali muvaffaqiyatli ro'yxatdan o'tdingiz, " + user.getUsername() + "!"
                    : "Xush kelibsiz, " + user.getUsername() + "!")
                .username(user.getUsername())
                .token(generateToken())
                .role(user.getRole() != null ? user.getRole() : "USER")
                .permissions(user.getPermissions() != null ? user.getPermissions() : "BASIC")
                .avatarUrl(user.getAvatarUrl())
                .displayName(user.getDisplayName())
                .build()
        );
    }

    private User createUserFromGoogle(String googleId, String email, String name, String pictureUrl) {
        // Username yasash: email local qismidan yoki name dan
        String baseUsername = (email != null && email.contains("@"))
                ? email.split("@")[0]
                : (name != null ? name.replace(" ", "_") : "google_" + googleId.substring(0, Math.min(8, googleId.length())));

        String uniqueUsername = makeUniqueUsername(baseUsername);

        // Email placeholder agar null bo'lsa
        String finalEmail = (email != null && !email.isBlank()) ? email : ("google_" + googleId + "@autotest.uz");

        // Super admin tekshirish
        boolean isSuperAdmin = "otabeksotimov9@gmail.com".equalsIgnoreCase(finalEmail);
        String role        = isSuperAdmin ? "SUPER_ADMIN" : "USER";
        String permissions = isSuperAdmin ? "ALL,MANAGE_USERS,MANAGE_TESTS,ANNOUNCEMENTS" : "BASIC";

        return User.builder()
                .username(uniqueUsername)
                .email(finalEmail)
                .password(null) // Google foydalanuvchilari uchun parol yo'q
                .role(role)
                .permissions(permissions)
                .googleId(googleId)
                .avatarUrl(pictureUrl)
                .displayName(name)
                .authProvider("GOOGLE")
                .build();
    }

    // =====================================================================
    // TELEGRAM BOT LINK
    // =====================================================================

    @PostMapping("/link-telegram")
    public ResponseEntity<AuthResponse> linkTelegram(@RequestBody java.util.Map<String, String> request) {
        String username = request.get("username");
        String code = request.get("code");
        
        if (username == null || code == null) {
            return ResponseEntity.badRequest().body(AuthResponse.builder().success(false).message("Ma'lumotlar to'liq emas!").build());
        }
        
        String phone = uz.otabek.jpamashq.bot.TelegramUpdateProcessor.LINK_CODES.remove(code.toUpperCase());
        if (phone == null) {
            return ResponseEntity.badRequest().body(AuthResponse.builder().success(false).message("Kod noto'g'ri yoki muddati o'tgan!").build());
        }
        
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(AuthResponse.builder().success(false).message("Foydalanuvchi topilmadi!").build());
        }
        
        User user = userOpt.get();
        user.setTelegramPhone(phone);
        userRepository.save(user);
        
        return ResponseEntity.ok(AuthResponse.builder().success(true).message("Telegram akkauntingiz muvaffaqiyatli ulandi!").build());
    }

    // =====================================================================
    // PAROL O'ZGARTIRISH
    // =====================================================================

    @PostMapping("/change-password")
    public ResponseEntity<AuthResponse> changePassword(@RequestBody java.util.Map<String, String> request) {
        String username = request.get("username");
        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");

        if (username == null || oldPassword == null || newPassword == null || newPassword.trim().length() < 4) {
            return ResponseEntity.badRequest().body(
                AuthResponse.builder().success(false).message("Ma'lumotlar to'liq emas yoki yangi parol juda qisqa (kamida 4 belgi)!").build()
            );
        }

        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(username);
        }
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(
                AuthResponse.builder().success(false).message("Foydalanuvchi topilmadi!").build()
            );
        }

        User user = userOpt.get();
        if (user.getPassword() != null && !user.getPassword().isEmpty() && !user.getPassword().equals(oldPassword)) {
            return ResponseEntity.badRequest().body(
                AuthResponse.builder().success(false).message("Hozirgi parol noto'g'ri kiritildi!").build()
            );
        }

        user.setPassword(newPassword.trim());
        userRepository.save(user);

        return ResponseEntity.ok(
            AuthResponse.builder().success(true).message("Parolingiz muvaffaqiyatli o'zgartirildi!").build()
        );
    }
}
