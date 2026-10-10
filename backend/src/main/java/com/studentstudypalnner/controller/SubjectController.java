package com.studentstudypalnner.controller;

import com.studentstudypalnner.model.Subject;
import com.studentstudypalnner.model.User;
import com.studentstudypalnner.repository.SubjectRepository;
import com.studentstudypalnner.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@CrossOrigin(origins = "*")
public class SubjectController {

    private final SubjectRepository subjectRepository;
    private final UserRepository userRepository;

    public SubjectController(
            SubjectRepository subjectRepository,
            UserRepository userRepository) {

        this.subjectRepository = subjectRepository;
        this.userRepository = userRepository;
    }


    @GetMapping("/user/{userId}")
    public List<Subject> getSubjects(
            @PathVariable Long userId) {

        return subjectRepository.findByUser_Id(userId);
    }


    @PostMapping
    public ResponseEntity<?> addSubject(
            @RequestBody SubjectRequest request) {

        User user = userRepository
                .findById(request.userId())
                .orElseThrow(() ->
                        new RuntimeException("User not found")
                );

        Subject subject = new Subject();

        subject.setName(request.name());

        subject.setUser(user);

        return ResponseEntity.ok(
                subjectRepository.save(subject)
        );
    }


    public record SubjectRequest(
            String name,
            Long userId
    ) {}
}