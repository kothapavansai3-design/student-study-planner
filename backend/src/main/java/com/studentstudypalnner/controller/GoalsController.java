package com.studentstudypalnner.controller;

import com.studentstudypalnner.model.Goals;
import com.studentstudypalnner.repository.GoalsRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
@CrossOrigin(origins = "*")
public class GoalsController {

    private final GoalsRepository goalsRepository;

    public GoalsController(GoalsRepository goalsRepository) {
        this.goalsRepository = goalsRepository;
    }

    // Get all goals of a user
    @GetMapping("/user/{userId}")
    public List<Goals> getGoals(@PathVariable Long userId) {
        return goalsRepository.findByUserId(userId);
    }

    // Add a new goal
    @PostMapping
    public ResponseEntity<Goals> addGoal(@RequestBody Goals goals) {
        return ResponseEntity.ok(goalsRepository.save(goals));
    }

    // Update a goal
    @PutMapping("/{id}")
    public ResponseEntity<?> updateGoal(
            @PathVariable Long id,
            @RequestBody Goals updatedGoals) {

        return goalsRepository.findById(id)
                .map(goals -> {

                    goals.setTitle(updatedGoals.getTitle());
                    goals.setDescription(updatedGoals.getDescription());
                    goals.setTargetDate(updatedGoals.getTargetDate());
                    goals.setPriority(updatedGoals.getPriority());
                    goals.setStatus(updatedGoals.getStatus());

                    return ResponseEntity.ok(goalsRepository.save(goals));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Mark goal as completed
    @PutMapping("/{id}/complete")
    public ResponseEntity<?> completeGoal(@PathVariable Long id) {

        return goalsRepository.findById(id)
                .map(goals -> {

                    goals.setStatus("Completed");

                    return ResponseEntity.ok(goalsRepository.save(goals));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Delete a goal
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteGoal(@PathVariable Long id) {

        if (!goalsRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        goalsRepository.deleteById(id);

        return ResponseEntity.ok().build();
    }
}