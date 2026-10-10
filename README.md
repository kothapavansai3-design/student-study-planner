# Student Study Planner & Reminder System

A basic-to-intermediate BTech Technical Training project.

## Technology
- Java 21
- Spring Boot
- Maven
- MySQL
- Spring Data JPA / Hibernate
- HTML
- CSS
- JavaScript

## Project Flow
Register
-> Login
-> Dashboard
-> Add Subject
-> Add Task
-> Set Deadline
-> Set Reminder
-> Mark Task Completed

## 1. Install
Make sure Java 21, Maven, and MySQL are installed.

## 2. Configure MySQL
Open:
backend/src/main/resources/application.properties

Change:
spring.datasource.password=YOUR_MYSQL_PASSWORD

Replace YOUR_MYSQL_PASSWORD with your MySQL root password.

The database `studentstudypalnner` will be created automatically.

## 3. Start Backend
Open a terminal in the backend folder:

mvn spring-boot:run

The backend runs at:
http://localhost:8080

## 4. Start Frontend
The easiest beginner method is to open the `frontend` folder with VS Code and use the Live Server extension.

Open:
frontend/login.html

Then click "Go Live".

## 5. Use the application
1. Register a new student.
2. Login.
3. Open Subjects and add subjects.
4. Open Tasks.
5. Add a task and select a subject.
6. Set deadline and reminder.
7. Return to Dashboard.
8. Mark tasks completed.

## Important
This is intentionally simple for a BTech project. The reminder is stored in MySQL and displayed in the task list. It does not send email/SMS notifications.
Passwords are stored as plain text in this beginner version; for a real production application, password hashing and proper authentication should be added.
