package com.studentstudypalnner.repository;

import com.studentstudypalnner.model.Notes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotesRepository extends JpaRepository<Notes, Long> {

    List<Notes> findByUserId(Long userId);
}