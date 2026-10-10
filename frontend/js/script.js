const API = "http://localhost:8080/api";

// ======================================================
// USER FUNCTIONS
// ======================================================

function saveUser(user) {
    localStorage.setItem("user", JSON.stringify(user));
}

function getUser() {
    return JSON.parse(localStorage.getItem("user") || "null");
}

function requireLogin() {
    if (!getUser()) {
        window.location.href = "login.html";
    }
}

function logout() {
    localStorage.removeItem("user");
    window.location.href = "login.html";
}

// ======================================================
// API REQUEST
// ======================================================

async function request(url, options = {}) {
    const response = await fetch(API + url, {
        headers: {
            "Content-Type": "application/json"
        },
        ...options
    });

    const text = await response.text();

    if (!response.ok) {
        let errorMessage = text || "Request failed";

        try {
            const errorData = JSON.parse(text);
            errorMessage = errorData.message || text;
        } catch (error) {
            // Keep the original response text.
        }

        throw new Error(errorMessage);
    }

    return text ? JSON.parse(text) : null;
}

// ======================================================
// PAGE START
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    // Register
    if (document.getElementById("registerForm")) {
        setupRegister();
    }

    // Login
    if (document.getElementById("loginForm")) {
        setupLogin();
    }

    // Subjects
    if (document.getElementById("subjectForm")) {
        requireLogin();
        setupSubjects();
    }

    // Tasks
    if (document.getElementById("taskForm")) {
        requireLogin();
        setupTasks();
    }

    // Dashboard
    if (document.getElementById("subjectCount")) {
        requireLogin();
        loadDashboard();
    }

});

// ======================================================
// REGISTER
// ======================================================

function setupRegister() {
    const registerForm = document.getElementById("registerForm");

    registerForm.onsubmit = async function (e) {
        e.preventDefault();

        const message = document.getElementById("message");

        message.textContent = "Creating your account...";

        try {
            const name = document.getElementById("name").value.trim();
            const email = document.getElementById("email").value.trim();
            const password = document.getElementById("password").value;
            const studentCategory =
                document.getElementById("studentCategory").value;
            const classYear =
                document.getElementById("classYear").value;

            if (!studentCategory || !classYear) {
                message.textContent =
                    "Please select your student category and class/year.";
                return;
            }

            const user = await request("/users/register", {
                method: "POST",
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                    studentCategory: studentCategory,
                    classYear: classYear
                })
            });

            saveUser(user);

            message.style.color = "green";
            message.textContent = "Registration successful!";

            setTimeout(function () {
                window.location.href = "dashboard.html";
            }, 500);

        } catch (error) {
            message.style.color = "red";
            message.textContent =
                "Registration failed: " + error.message;
        }
    };
}

// ======================================================
// LOGIN
// ======================================================

function setupLogin() {
    const loginForm = document.getElementById("loginForm");

    loginForm.onsubmit = async function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        const message = document.getElementById("message");

        message.textContent = "Logging in...";

        try {
            const user = await request("/users/login", {
                method: "POST",
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            saveUser(user);

            message.style.color = "green";
            message.textContent =
                "Login successful! Opening dashboard...";

            setTimeout(function () {
                window.location.href = "dashboard.html";
            }, 500);

        } catch (error) {
            console.error("Login error:", error);

            message.style.color = "red";
            message.textContent = "Invalid email or password.";
        }
    };
}

// ======================================================
// SUBJECT PAGE
// ======================================================

async function setupSubjects() {
    const user = getUser();

    if (!user) {
        return;
    }

    await loadSubjects(user.id);

    document.getElementById("subjectForm").onsubmit =
        async function (e) {

            e.preventDefault();

            const message = document.getElementById("message");

            try {
                await request("/subjects", {
                    method: "POST",
                    body: JSON.stringify({
                        name: document.getElementById("subjectName").value,
                        userId: user.id
                    })
                });

                document.getElementById("subjectName").value = "";
                message.textContent = "Subject added successfully.";

                await loadSubjects(user.id);

            } catch (error) {
                console.error("Subject error:", error);
                message.textContent =
                    "Could not add subject: " + error.message;
            }
        };
}

// ======================================================
// LOAD SUBJECTS
// ======================================================

async function loadSubjects(userId) {
    try {
        const subjects = await request("/subjects/user/" + userId);

        console.log("Subjects received:", subjects);

        // Display subjects
        const subjectList = document.getElementById("subjectList");

        if (subjectList) {
            if (subjects.length === 0) {
                subjectList.innerHTML = "<p>No subjects added yet.</p>";
            } else {
                subjectList.innerHTML = subjects.map(function (subject) {
                    return `
                        <div class="item">
                            <strong>${escapeHtml(subject.name)}</strong>
                        </div>
                    `;
                }).join("");
            }
        }

        // Fill task subject dropdown
        const subjectSelect = document.getElementById("subjectId");

        if (subjectSelect) {
            subjectSelect.innerHTML = "";

            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = "Select Subject";
            defaultOption.disabled = true;
            defaultOption.selected = true;

            subjectSelect.appendChild(defaultOption);

            subjects.forEach(function (subject) {
                const option = document.createElement("option");

                option.value = subject.id;
                option.textContent = subject.name;

                subjectSelect.appendChild(option);
            });
        }

    } catch (error) {
        console.error("Subject loading error:", error);
    }
}

// ======================================================
// TASK PAGE
// ======================================================

async function setupTasks() {
    const user = getUser();

    if (!user) {
        return;
    }

    await loadSubjects(user.id);
    await loadTasks(user.id);

    document.getElementById("taskForm").onsubmit =
        async function (e) {

            e.preventDefault();

            const message = document.getElementById("message");

            try {
                const selectedSubject =
                    document.getElementById("subjectId").value;

                if (!selectedSubject) {
                    alert("Please select a subject.");
                    return;
                }

                await request("/tasks", {
                    method: "POST",
                    body: JSON.stringify({
                        title: document.getElementById("taskTitle").value,
                        description:
                        document.getElementById("description").value,
                        subjectId: Number(selectedSubject),
                        deadline:
                            document.getElementById("deadline").value || null,
                        reminder:
                            document.getElementById("reminder").value || null,
                        status: "PENDING"
                    })
                });

                document.getElementById("taskForm").reset();

                message.textContent = "Task added successfully.";

                await loadTasks(user.id);
                await loadSubjects(user.id);

            } catch (error) {
                console.error("Task error:", error);

                message.textContent =
                    "Could not add task: " + error.message;
            }
        };
}

// ======================================================
// LOAD TASKS
// ======================================================

async function loadTasks(userId) {
    try {
        const tasks = await request("/tasks/user/" + userId);

        const taskList = document.getElementById("taskList");

        if (!taskList) {
            return;
        }

        if (tasks.length === 0) {
            taskList.innerHTML = "<p>No tasks added yet.</p>";
            return;
        }

        taskList.innerHTML = tasks.map(function (task) {

            const completed = task.status === "COMPLETED";

            return `
                <div class="item ${completed ? "completed" : ""}">

                    <h3>${escapeHtml(task.title)}</h3>

                    <p>${escapeHtml(task.description || "")}</p>

                    <p>
                        <b>Subject:</b>
                        ${escapeHtml(task.subjectName || "Unknown")}
                    </p>

                    <p>
                        <b>Deadline:</b>
                        ${formatDate(task.deadline)}
                    </p>

                    <p>
                        <b>Reminder:</b>
                        ${formatDate(task.reminder)}
                    </p>

                    <span class="badge ${completed ? "done" : ""}">
                        ${escapeHtml(task.status)}
                    </span>

                    ${
                !completed
                    ? `<button class="success"
                                onclick="completeTask(${task.id})">
                                Mark Completed
                               </button>`
                    : ""
            }

                    <button class="danger"
                        onclick="deleteTask(${task.id})">
                        Delete
                    </button>

                </div>
            `;
        }).join("");

    } catch (error) {
        console.error("Task loading error:", error);
    }
}

// ======================================================
// COMPLETE TASK
// ======================================================

async function completeTask(id) {
    try {
        await request("/tasks/" + id + "/complete", {
            method: "PUT"
        });

        const user = getUser();

        if (user) {
            await loadTasks(user.id);
        }

    } catch (error) {
        console.error("Complete task error:", error);
        alert("Could not complete task.");
    }
}

// ======================================================
// DELETE TASK
// ======================================================

async function deleteTask(id) {
    if (!confirm("Delete this task?")) {
        return;
    }

    try {
        await request("/tasks/" + id, {
            method: "DELETE"
        });

        const user = getUser();

        if (user) {
            await loadTasks(user.id);
        }

    } catch (error) {
        console.error("Delete task error:", error);
        alert("Could not delete task.");
    }
}

// ======================================================
// DASHBOARD
// ======================================================

async function loadDashboard() {
    const user = getUser();

    if (!user) {
        return;
    }

    // Welcome message
    const welcome = document.getElementById("welcome");

    if (welcome) {
        welcome.textContent = "Welcome, " + user.name + "!";
    }

    try {
        // Load subjects
        const subjects = await request("/subjects/user/" + user.id);

        document.getElementById("subjectCount").textContent =
            subjects.length;

        // Load tasks
        const tasks = await request("/tasks/user/" + user.id);

        document.getElementById("taskCount").textContent =
            tasks.length;

        const pendingTasks = tasks.filter(function (task) {
            return task.status !== "COMPLETED";
        });

        const completedTasks = tasks.filter(function (task) {
            return task.status === "COMPLETED";
        });

        document.getElementById("pendingCount").textContent =
            pendingTasks.length;

        document.getElementById("completedCount").textContent =
            completedTasks.length;

        // Load notes
        const notes = await request("/notes/user/" + user.id);

        document.getElementById("totalNotes").textContent =
            notes.length;

        // Load goals
        const goals = await request("/goals/user/" + user.id);

        document.getElementById("totalGoals").textContent =
            goals.length;

        const completedGoals = goals.filter(function (goal) {
            return goal.status === "Completed";
        });

        document.getElementById("completedGoals").textContent =
            completedGoals.length;

        // Display upcoming tasks
        const upcoming = document.getElementById("upcoming");

        if (upcoming) {
            const upcomingTasks = tasks
                .filter(function (task) {
                    return task.status !== "COMPLETED";
                })
                .sort(function (a, b) {
                    if (!a.deadline) return 1;
                    if (!b.deadline) return -1;

                    return new Date(a.deadline) - new Date(b.deadline);
                })
                .slice(0, 5);

            if (upcomingTasks.length > 0) {
                upcoming.innerHTML = upcomingTasks.map(function (task) {
                    return `
                        <div class="item">
                            <b>${escapeHtml(task.title)}</b>
                            <br>
                            Deadline: ${formatDate(task.deadline)}
                        </div>
                    `;
                }).join("");
            } else {
                upcoming.innerHTML = "<p>No pending tasks.</p>";
            }
        }

    } catch (error) {
        console.error("Dashboard error:", error);
    }
}

// ======================================================
// FORMAT DATE
// ======================================================

function formatDate(value) {
    if (!value) {
        return "Not set";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Not set";
    }

    return date.toLocaleString();
}

// ======================================================
// ESCAPE HTML
// ======================================================

function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (character) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[character];
    });
}