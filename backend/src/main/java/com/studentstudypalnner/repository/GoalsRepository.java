package com.studentstudypalnner.repository;

import com.studentstudypalnner.model.Goals;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface GoalsRepository extends JpaRepository<Goals, Long> {

    List<Goals> findByUserId(Long userId);
}