package com.studentstudypalnner.controller;

import com.studentstudypalnner.model.User;
import com.studentstudypalnner.repository.UserRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/profile")
@CrossOrigin
public class ProfileController {

    private final UserRepository userRepository;

    public ProfileController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping("/{id}")
    public User getProfile(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);

        if (user.isPresent()) {
            return user.get();
        }

        throw new RuntimeException("User not found");
    }

    @PutMapping("/{id}")
    public User updateProfile(
            @PathVariable Long id,
            @RequestBody User updatedUser) {

        Optional<User> existingUser = userRepository.findById(id);

        if (existingUser.isPresent()) {
            User user = existingUser.get();

            user.setName(updatedUser.getName());
            user.setEmail(updatedUser.getEmail());

            return userRepository.save(user);
        }

        throw new RuntimeException("User not found");
    }
}