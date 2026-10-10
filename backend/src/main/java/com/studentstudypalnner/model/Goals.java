package com.studentstudypalnner.model;

import jakarta.persistence.*;

@Entity
@Table(name = "goals")
public class Goals {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String targetDate;

    private String priority;

    private String status;

    private Long userId;

    public Goals() {
    }

    public Goals(String title, String description, String targetDate,
                 String priority, String status, Long userId) {

        this.title = title;
        this.description = description;
        this.targetDate = targetDate;
        this.priority = priority;
        this.status = status;
        this.userId = userId;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getTargetDate() {
        return targetDate;
    }

    public String getPriority() {
        return priority;
    }

    public String getStatus() {
        return status;
    }

    public Long getUserId() {
        return userId;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setTargetDate(String targetDate) {
        this.targetDate = targetDate;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
}