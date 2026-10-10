package com.studentstudypalnner.controller;

import com.studentstudypalnner.model.User;
import com.studentstudypalnner.repository.UserRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository repository;

    public UserController(UserRepository repository) {
        this.repository = repository;
    }

    // Student registration
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {

        // Check required fields
        if (user.getName() == null || user.getName().isBlank()
                || user.getEmail() == null || user.getEmail().isBlank()
                || user.getPassword() == null || user.getPassword().isBlank()) {

            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Name, email and password are required"));
        }

        // Check student category
        String category = user.getStudentCategory();

        if (category == null ||
                !(category.equals("10th")
                        || category.equals("Intermediate")
                        || category.equals("Diploma")
                        || category.equals("B.Tech"))) {

            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Please select a valid student category"));
        }

        // Check class/year
        if (user.getClassYear() == null || user.getClassYear().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Please select your class or year"));
        }

        // Check whether email already exists
        if (repository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email already registered"));
        }

        // Save student details
        User savedUser = repository.save(user);

        // Return response without password
        return ResponseEntity.ok(Map.of(
                "message", "Registration successful",
                "id", savedUser.getId(),
                "name", savedUser.getName(),
                "email", savedUser.getEmail(),
                "studentCategory", savedUser.getStudentCategory(),
                "classYear", savedUser.getClassYear(),
                "institution", savedUser.getInstitution() == null
                        ? "" : savedUser.getInstitution()
        ));
    }

    // Student login
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User login) {

        Optional<User> user = repository.findByEmail(login.getEmail());

        if (user.isPresent()
                && user.get().getPassword().equals(login.getPassword())) {

            User loggedInUser = user.get();

            // Return user details without password
            return ResponseEntity.ok(Map.of(
                    "message", "Login successful",
                    "id", loggedInUser.getId(),
                    "name", loggedInUser.getName(),
                    "email", loggedInUser.getEmail(),
                    "studentCategory",
                    loggedInUser.getStudentCategory() == null
                            ? "" : loggedInUser.getStudentCategory(),
                    "classYear",
                    loggedInUser.getClassYear() == null
                            ? "" : loggedInUser.getClassYear(),
                    "institution",
                    loggedInUser.getInstitution() == null
                            ? "" : loggedInUser.getInstitution()
            ));
        }

        return ResponseEntity.status(401)
                .body(Map.of("message", "Invalid email or password"));
    }
}