package com.studentstudypalnner.controller;

import com.studentstudypalnner.model.Notes;
import com.studentstudypalnner.repository.NotesRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "*")
public class NotesController {

    private final NotesRepository notesRepository;

    public NotesController(NotesRepository notesRepository) {
        this.notesRepository = notesRepository;
    }

    // Get all notes of a user
    @GetMapping("/user/{userId}")
    public List<Notes> getNotes(@PathVariable Long userId) {
        return notesRepository.findByUserId(userId);
    }

    // Add a new note
    @PostMapping
    public ResponseEntity<Notes> addNotes(@RequestBody Notes notes) {
        return ResponseEntity.ok(notesRepository.save(notes));
    }

    // Update a note
    @PutMapping("/{id}")
    public ResponseEntity<?> updateNotes(
            @PathVariable Long id,
            @RequestBody Notes updatedNotes) {

        return notesRepository.findById(id)
                .map(notes -> {

                    notes.setTitle(updatedNotes.getTitle());
                    notes.setContent(updatedNotes.getContent());
                    notes.setSubject(updatedNotes.getSubject());

                    return ResponseEntity.ok(notesRepository.save(notes));
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Delete a note
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteNotes(@PathVariable Long id) {

        if (!notesRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        notesRepository.deleteById(id);

        return ResponseEntity.ok().build();
    }
}