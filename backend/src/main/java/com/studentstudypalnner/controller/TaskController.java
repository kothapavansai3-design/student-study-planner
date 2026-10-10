package com.studentstudypalnner.controller;

import com.studentstudypalnner.model.Subject;
import com.studentstudypalnner.model.Task;
import com.studentstudypalnner.repository.SubjectRepository;
import com.studentstudypalnner.repository.TaskRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/tasks")
@CrossOrigin(origins = "*")
public class TaskController {
    private final TaskRepository taskRepository;
    private final SubjectRepository subjectRepository;

    public TaskController(TaskRepository taskRepository, SubjectRepository subjectRepository) {
        this.taskRepository = taskRepository;
        this.subjectRepository = subjectRepository;
    }

    @GetMapping("/user/{userId}")
    public List<TaskResponse> getTasks(@PathVariable Long userId) {
        return taskRepository.findBySubjectUserId(userId).stream()
                .map(t -> new TaskResponse(
                        t.getId(), t.getTitle(), t.getDescription(),
                        t.getSubject() == null ? null : t.getSubject().getName(),
                        t.getDeadline(), t.getReminder(), t.getStatus()))
                .toList();
    }

    @PostMapping
    public ResponseEntity<?> addTask(@RequestBody TaskRequest request) {
        Subject subject = subjectRepository.findById(request.subjectId())
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        Task task = new Task();
        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setSubject(subject);
        task.setDeadline(request.deadline());
        task.setReminder(request.reminder());
        task.setStatus("PENDING");

        return ResponseEntity.ok(taskRepository.save(task));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<?> complete(@PathVariable Long id) {
        Task task = taskRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Task not found"));
        task.setStatus("COMPLETED");
        return ResponseEntity.ok(taskRepository.save(task));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        taskRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }

    public record TaskRequest(
            String title,
            String description,
            Long subjectId,
            LocalDateTime deadline,
            LocalDateTime reminder,
            String status) {}

    public record TaskResponse(
            Long id,
            String title,
            String description,
            String subjectName,
            LocalDateTime deadline,
            LocalDateTime reminder,
            String status) {}
}