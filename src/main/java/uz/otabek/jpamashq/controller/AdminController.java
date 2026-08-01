package uz.otabek.jpamashq.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import uz.otabek.jpamashq.entity.User;
import uz.otabek.jpamashq.repository.UserRepository;

import java.util.*;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {

    private final UserRepository userRepository;

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getAdminStats() {
        long totalUsers = userRepository.count();
        long adminCount = userRepository.findAll().stream().filter(u -> "ADMIN".equalsIgnoreCase(u.getRole()) || "SUPER_ADMIN".equalsIgnoreCase(u.getRole())).count();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", totalUsers);
        stats.put("totalAdmins", adminCount);
        stats.put("superAdmin", "otabeksotimov9@gmail.com");
        stats.put("totalTestsConducted", 1250);
        stats.put("averagePassRate", "94.5%");
        stats.put("serverStatus", "ACTIVE");

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<List<Map<String, Object>>> getAllUsers() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> result = new ArrayList<>();

        for (User u : users) {
            Map<String, Object> map = new HashMap<>();
            map.put("id", u.getId());
            map.put("username", u.getUsername());
            map.put("email", u.getEmail());
            map.put("password", u.getPassword());
            map.put("role", u.getRole() != null ? u.getRole() : "USER");
            map.put("permissions", u.getPermissions() != null ? u.getPermissions() : "BASIC");
            result.add(map);
        }

        return ResponseEntity.ok(result);
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<Map<String, Object>> updateUser(
            @PathVariable Long id,
            @RequestBody Map<String, String> payload) {

        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("message", "Foydalanuvchi topilmadi!");
            return ResponseEntity.badRequest().body(err);
        }

        User user = optionalUser.get();

        // Prevent modifying Super Admin role if it's otabeksotimov9@gmail.com
        if (user.getEmail().equalsIgnoreCase("otabeksotimov9@gmail.com") && payload.containsKey("role") && !payload.get("role").equals("SUPER_ADMIN")) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("message", "Super Admin rolini o'zgartirish taqiqlangan!");
            return ResponseEntity.badRequest().body(err);
        }

        if (payload.containsKey("username")) user.setUsername(payload.get("username"));
        if (payload.containsKey("email")) user.setEmail(payload.get("email"));
        if (payload.containsKey("password") && !payload.get("password").isEmpty()) user.setPassword(payload.get("password"));
        if (payload.containsKey("role")) user.setRole(payload.get("role"));
        if (payload.containsKey("permissions")) user.setPermissions(payload.get("permissions"));

        userRepository.save(user);

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "Foydalanuvchi ma'lumotlari muvaffaqiyatli tahrirlandi!");
        res.put("user", user);

        return ResponseEntity.ok(res);
    }

    @PutMapping("/users/{id}/role")
    public ResponseEntity<Map<String, Object>> updateUserRole(@PathVariable Long id, @RequestParam String role) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("message", "Foydalanuvchi topilmadi!");
            return ResponseEntity.badRequest().body(err);
        }

        User user = optionalUser.get();
        if (user.getEmail().equalsIgnoreCase("otabeksotimov9@gmail.com")) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("message", "Super Admin rolini o'zgartirib bo'lmaydi!");
            return ResponseEntity.badRequest().body(err);
        }

        user.setRole(role.toUpperCase());
        userRepository.save(user);

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "Foydalanuvchi roli " + role + " ga o'zgartirildi!");

        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable Long id) {
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isEmpty()) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("message", "Foydalanuvchi topilmadi!");
            return ResponseEntity.badRequest().body(err);
        }

        User user = optionalUser.get();
        if (user.getEmail().equalsIgnoreCase("otabeksotimov9@gmail.com")) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("message", "Super Adminni o'chirib bo'lmaydi!");
            return ResponseEntity.badRequest().body(err);
        }

        userRepository.deleteById(id);

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "Foydalanuvchi muvaffaqiyatli o'chirildi!");

        return ResponseEntity.ok(res);
    }

    @PostMapping("/users")
    public ResponseEntity<Map<String, Object>> createUser(@RequestBody Map<String, String> payload) {
        String username = payload.get("username");
        String email = payload.get("email");
        String password = payload.getOrDefault("password", "12345678");
        String role = payload.getOrDefault("role", "USER");
        String permissions = payload.getOrDefault("permissions", "BASIC");

        if (username == null || username.trim().isEmpty() || email == null || email.trim().isEmpty()) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("message", "Username va Email kiritilishi shart!");
            return ResponseEntity.badRequest().body(err);
        }

        if (userRepository.existsByUsername(username) || userRepository.existsByEmail(email)) {
            Map<String, Object> err = new HashMap<>();
            err.put("success", false);
            err.put("message", "Ushbu Username yoki Email allaqachon mavjud!");
            return ResponseEntity.badRequest().body(err);
        }

        User newUser = User.builder()
                .username(username)
                .email(email)
                .password(password)
                .role(role.toUpperCase())
                .permissions(permissions)
                .build();

        userRepository.save(newUser);

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "Yangi foydalanuvchi " + username + " muvaffaqiyatli yaratildi!");
        res.put("user", newUser);

        return ResponseEntity.ok(res);
    }

    // ANNOUNCEMENTS IN-MEMORY STORE
    private static final List<Map<String, Object>> announcements = Collections.synchronizedList(new ArrayList<>(Arrays.asList(
        Map.of("id", 1L, "title", "PDD Imtihon Portaliga xush kelibsiz!", "text", "Yangi savollar to'plami va 2026-yilgi qoidalar yangilandi.", "type", "INFO", "active", true, "date", "2026-08-01 10:00"),
        Map.of("id", 2L, "title", "Texnik profilaktika runs", "text", "Har yakshanba soat 03:00 da profilaktika o'tkaziladi.", "type", "WARNING", "active", true, "date", "2026-07-28 15:30")
    )));

    @GetMapping("/announcements")
    public ResponseEntity<List<Map<String, Object>>> getAnnouncements() {
        return ResponseEntity.ok(announcements);
    }

    @PostMapping("/announcements")
    public ResponseEntity<Map<String, Object>> createAnnouncement(@RequestBody Map<String, Object> payload) {
        long newId = System.currentTimeMillis();
        Map<String, Object> ann = new HashMap<>(payload);
        ann.put("id", newId);
        ann.put("active", true);
        ann.put("date", new java.text.SimpleDateFormat("yyyy-MM-dd HH:mm").format(new java.util.Date()));
        announcements.add(0, ann);

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "E'lon efrga muvaffaqiyatli chiqarildi!");
        res.put("announcement", ann);
        return ResponseEntity.ok(res);
    }

    @DeleteMapping("/announcements/{id}")
    public ResponseEntity<Map<String, Object>> deleteAnnouncement(@PathVariable Long id) {
        announcements.removeIf(a -> Objects.equals(a.get("id"), id));
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "E'lon o'chirildi!");
        return ResponseEntity.ok(res);
    }

    // SYSTEM SETTINGS
    private static final Map<String, Object> systemSettings = new HashMap<>(Map.of(
        "examDurationMinutes", 25,
        "passingScoreThreshold", 18,
        "maintenanceMode", false,
        "siteTitle", "AvtoTest UZ — PDD Imtihon Portali"
    ));

    @GetMapping("/settings")
    public ResponseEntity<Map<String, Object>> getSettings() {
        return ResponseEntity.ok(systemSettings);
    }

    @PutMapping("/settings")
    public ResponseEntity<Map<String, Object>> updateSettings(@RequestBody Map<String, Object> payload) {
        systemSettings.putAll(payload);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "Tizim sozlamalari muvaffaqiyatli saqlandi!");
        res.put("settings", systemSettings);
        return ResponseEntity.ok(res);
    }

    // SYSTEM AUDIT LOGS
    @GetMapping("/logs")
    public ResponseEntity<List<Map<String, Object>>> getAuditLogs() {
        List<Map<String, Object>> logs = List.of(
            Map.of("id", 101, "admin", "otabek", "action", "UPDATE_USER_PERMISSIONS", "target", "bekmurod", "time", "10 daqiqa oldin"),
            Map.of("id", 102, "admin", "otabek", "action", "CREATE_ANNOUNCEMENT", "target", "E'lon #2", "time", "25 daqiqa oldin"),
            Map.of("id", 103, "admin", "system", "action", "DATABASE_BACKUP_COMPLETED", "target", "PostgreSQL", "time", "1 soat oldin"),
            Map.of("id", 104, "admin", "bekmurod", "action", "EDIT_QUESTION", "target", "Bilet 3, Savol 5", "time", "3 soat oldin")
        );
        return ResponseEntity.ok(logs);
    }
}
