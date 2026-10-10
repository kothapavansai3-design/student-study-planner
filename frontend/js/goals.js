const GOALS_API = "http://localhost:8080/api/goals";

let currentUser = null;


// Run when page opens
document.addEventListener("DOMContentLoaded", function () {

    currentUser = JSON.parse(localStorage.getItem("user"));

    if (!currentUser || !currentUser.id) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    loadGoals();

    const goalForm = document.getElementById("goalForm");

    if (goalForm) {
        goalForm.addEventListener("submit", addGoal);
    }
});


// Load goals
async function loadGoals() {

    try {

        const response = await fetch(
            GOALS_API + "/user/" + currentUser.id
        );

        if (!response.ok) {
            throw new Error("Unable to load goals");
        }

        const goals = await response.json();

        displayGoals(goals);

    } catch (error) {

        console.error("Goals loading error:", error);

        document.getElementById("goalsList").innerHTML =
            "<p>Unable to load goals.</p>";
    }
}


// Display goals
function displayGoals(goals) {

    const goalsList = document.getElementById("goalsList");

    if (goals.length === 0) {

        goalsList.innerHTML =
            "<p>No goals added yet.</p>";

        return;
    }

    goalsList.innerHTML = "";

    goals.forEach(function (goal) {

        const goalCard = document.createElement("div");

        goalCard.className = "card";

        goalCard.innerHTML = `
            <h3>${escapeHtml(goal.title)}</h3>

            <p>
                <strong>Description:</strong>
                ${escapeHtml(goal.description || "No description")}
            </p>

            <p>
                <strong>Target Date:</strong>
                ${escapeHtml(goal.targetDate)}
            </p>

            <p>
                <strong>Priority:</strong>
                ${escapeHtml(goal.priority)}
            </p>

            <p>
                <strong>Status:</strong>
                ${escapeHtml(goal.status)}
            </p>

            <button onclick="editGoal(${goal.id})">
                Edit
            </button>

            ${
            goal.status !== "Completed"
                ? `<button onclick="completeGoal(${goal.id})">
                       Mark Completed
                   </button>`
                : ""
        }

            <button onclick="deleteGoal(${goal.id})">
                Delete
            </button>
        `;

        goalsList.appendChild(goalCard);
    });
}


// Add goal
async function addGoal(event) {

    event.preventDefault();

    const title =
        document.getElementById("goalTitle").value.trim();

    const description =
        document.getElementById("goalDescription").value.trim();

    const targetDate =
        document.getElementById("targetDate").value;

    const priority =
        document.getElementById("priority").value;


    if (title === "" || targetDate === "" || priority === "") {

        alert("Please fill all required fields.");

        return;
    }


    const goal = {

        title: title,

        description: description,

        targetDate: targetDate,

        priority: priority,

        status: "Pending",

        userId: currentUser.id
    };


    try {

        const response = await fetch(GOALS_API, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(goal)
        });


        if (!response.ok) {
            throw new Error("Failed to add goal");
        }


        document.getElementById("goalForm").reset();

        document.getElementById("goalMessage").textContent =
            "Goal added successfully!";


        loadGoals();

    } catch (error) {

        console.error("Add goal error:", error);

        alert("Failed to add goal.");
    }
}


// Edit goal
async function editGoal(id) {

    const title =
        prompt("Enter new goal title:");

    if (title === null || title.trim() === "") {
        return;
    }


    const description =
        prompt("Enter new description:");

    if (description === null) {
        return;
    }


    const targetDate =
        prompt("Enter new target date (YYYY-MM-DD):");

    if (targetDate === null || targetDate.trim() === "") {
        return;
    }


    const priority =
        prompt("Enter priority (High / Medium / Low):");

    if (priority === null || priority.trim() === "") {
        return;
    }


    const status =
        prompt("Enter status (Pending / Completed):");

    if (status === null || status.trim() === "") {
        return;
    }


    const updatedGoal = {

        title: title.trim(),

        description: description.trim(),

        targetDate: targetDate.trim(),

        priority: priority.trim(),

        status: status.trim()
    };


    try {

        const response = await fetch(
            GOALS_API + "/" + id,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(updatedGoal)
            }
        );


        if (!response.ok) {
            throw new Error("Failed to update goal");
        }


        alert("Goal updated successfully!");

        loadGoals();

    } catch (error) {

        console.error("Update goal error:", error);

        alert("Failed to update goal.");
    }
}


// Mark goal as completed
async function completeGoal(id) {

    const confirmComplete = confirm(
        "Mark this goal as completed?"
    );


    if (!confirmComplete) {
        return;
    }


    try {

        const response = await fetch(
            GOALS_API + "/" + id + "/complete",
            {
                method: "PUT"
            }
        );


        if (!response.ok) {
            throw new Error("Failed to complete goal");
        }


        alert("Goal completed successfully!");

        loadGoals();

    } catch (error) {

        console.error("Complete goal error:", error);

        alert("Failed to complete goal.");
    }
}


// Delete goal
async function deleteGoal(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this goal?"
    );


    if (!confirmDelete) {
        return;
    }


    try {

        const response = await fetch(
            GOALS_API + "/" + id,
            {
                method: "DELETE"
            }
        );


        if (!response.ok) {
            throw new Error("Failed to delete goal");
        }


        alert("Goal deleted successfully!");

        loadGoals();

    } catch (error) {

        console.error("Delete goal error:", error);

        alert("Failed to delete goal.");
    }
}


// Prevent HTML injection
function escapeHtml(value) {

    if (!value) {
        return "";
    }

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}