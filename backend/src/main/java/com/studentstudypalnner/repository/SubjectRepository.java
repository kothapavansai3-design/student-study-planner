package com.studentstudypalnner.repository;

import com.studentstudypalnner.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubjectRepository extends JpaRepository<Subject, Long> {

    List<Subject> findByUser_Id(Long userId);

}