const NOTES_API = "http://localhost:8080/api/notes";

let currentUser = null;


// Run when page opens
document.addEventListener("DOMContentLoaded", function () {

    currentUser = JSON.parse(localStorage.getItem("user"));

    if (!currentUser || !currentUser.id) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    loadNotes();

    const noteForm = document.getElementById("noteForm");

    if (noteForm) {
        noteForm.addEventListener("submit", addNote);
    }
});


// Load all notes
async function loadNotes() {

    try {

        const response = await fetch(
            NOTES_API + "/user/" + currentUser.id
        );

        if (!response.ok) {
            throw new Error("Unable to load notes");
        }

        const notes = await response.json();

        displayNotes(notes);

    } catch (error) {

        console.error("Notes loading error:", error);

        document.getElementById("notesList").innerHTML =
            "<p>Unable to load notes.</p>";
    }
}


// Display notes
function displayNotes(notes) {

    const notesList = document.getElementById("notesList");

    if (notes.length === 0) {

        notesList.innerHTML =
            "<p>No notes added yet.</p>";

        return;
    }

    notesList.innerHTML = "";

    notes.forEach(function (note) {

        const noteCard = document.createElement("div");

        noteCard.className = "card";

        noteCard.innerHTML = `
            <h3>${escapeHtml(note.title)}</h3>

            <p>
                <strong>Subject:</strong>
                ${escapeHtml(note.subject)}
            </p>

            <p>
                ${escapeHtml(note.content)}
            </p>

            <button onclick="editNote(${note.id})">
                Edit
            </button>

            <button onclick="deleteNote(${note.id})">
                Delete
            </button>
        `;

        notesList.appendChild(noteCard);
    });
}


// Add note
async function addNote(event) {

    event.preventDefault();

    const title = document.getElementById("noteTitle").value.trim();
    const subject = document.getElementById("noteSubject").value.trim();
    const content = document.getElementById("noteContent").value.trim();

    if (title === "" || subject === "" || content === "") {

        alert("Please fill all fields.");

        return;
    }

    const note = {
        title: title,
        subject: subject,
        content: content,
        userId: currentUser.id
    };

    try {

        const response = await fetch(NOTES_API, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(note)
        });

        if (!response.ok) {
            throw new Error("Failed to add note");
        }

        document.getElementById("noteForm").reset();

        document.getElementById("noteMessage").textContent =
            "Note added successfully!";

        loadNotes();

    } catch (error) {

        console.error("Add note error:", error);

        alert("Failed to add note.");
    }
}


// Edit note
async function editNote(id) {

    const title = prompt("Enter new note title:");

    if (title === null || title.trim() === "") {
        return;
    }

    const subject = prompt("Enter new subject:");

    if (subject === null || subject.trim() === "") {
        return;
    }

    const content = prompt("Enter new note content:");

    if (content === null || content.trim() === "") {
        return;
    }

    const updatedNote = {
        title: title.trim(),
        subject: subject.trim(),
        content: content.trim()
    };

    try {

        const response = await fetch(
            NOTES_API + "/" + id,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(updatedNote)
            }
        );

        if (!response.ok) {
            throw new Error("Failed to update note");
        }

        alert("Note updated successfully!");

        loadNotes();

    } catch (error) {

        console.error("Update note error:", error);

        alert("Failed to update note.");
    }
}


// Delete note
async function deleteNote(id) {

    const confirmDelete = confirm(
        "Are you sure you want to delete this note?"
    );

    if (!confirmDelete) {
        return;
    }

    try {

        const response = await fetch(
            NOTES_API + "/" + id,
            {
                method: "DELETE"
            }
        );

        if (!response.ok) {
            throw new Error("Failed to delete note");
        }

        alert("Note deleted successfully!");

        loadNotes();

    } catch (error) {

        console.error("Delete note error:", error);

        alert("Failed to delete note.");
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