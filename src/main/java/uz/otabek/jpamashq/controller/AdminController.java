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
}
