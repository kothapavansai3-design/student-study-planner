package com.studentstudypalnner.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 1000)
    private String description;

    private LocalDateTime deadline;
    private LocalDateTime reminder;

    private String status = "PENDING";

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;

    public Task() {}

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public LocalDateTime getDeadline() { return deadline; }
    public LocalDateTime getReminder() { return reminder; }
    public String getStatus() { return status; }
    public Subject getSubject() { return subject; }

    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setDescription(String description) { this.description = description; }
    public void setDeadline(LocalDateTime deadline) { this.deadline = deadline; }
    public void setReminder(LocalDateTime reminder) { this.reminder = reminder; }
    public void setStatus(String status) { this.status = status; }
    public void setSubject(Subject subject) { this.subject = subject; }
}