package com.studentstudypalnner.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String studentCategory;

    private String classYear;

    private String institution;

    // Default constructor
    public User() {
    }

    // Existing constructor
    public User(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    // Constructor with student details
    public User(String name, String email, String password,
                String studentCategory, String classYear,
                String institution) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.studentCategory = studentCategory;
        this.classYear = classYear;
        this.institution = institution;
    }

    // Getters
    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getStudentCategory() {
        return studentCategory;
    }

    public String getClassYear() {
        return classYear;
    }

    public String getInstitution() {
        return institution;
    }

    // Setters
    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setStudentCategory(String studentCategory) {
        this.studentCategory = studentCategory;
    }

    public void setClassYear(String classYear) {
        this.classYear = classYear;
    }

    public void setInstitution(String institution) {
        this.institution = institution;
    }
}