const PROFILE_API = "http://localhost:8080/api/profile";


// Load profile when page opens
document.addEventListener("DOMContentLoaded", function () {

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.id) {
        alert("Please login first.");
        window.location.href = "login.html";
        return;
    }

    loadProfileData(user.id);
});


// Load profile from Spring Boot
async function loadProfileData(userId) {

    try {

        const response = await fetch(
            PROFILE_API + "/" + userId
        );

        if (!response.ok) {
            throw new Error("Profile loading failed");
        }

        const user = await response.json();

        // Display profile
        document.getElementById("profileName").textContent =
            user.name;

        document.getElementById("profileEmail").textContent =
            user.email;

        // Put values inside edit boxes
        document.getElementById("name").value =
            user.name;

        document.getElementById("email").value =
            user.email;

    } catch (error) {

        console.error("Profile error:", error);

        document.getElementById("profileName").textContent =
            "Unable to load";

        document.getElementById("profileEmail").textContent =
            "Unable to load";
    }
}


// SAVE PROFILE
async function saveProfileChanges() {

    console.log("Save button clicked");

    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || !user.id) {

        alert("Please login again.");

        window.location.href = "login.html";

        return;
    }


    const name =
        document.getElementById("name").value.trim();

    const email =
        document.getElementById("email").value.trim();


    if (name === "" || email === "") {

        alert("Name and email cannot be empty.");

        return;
    }


    try {

        const response = await fetch(
            PROFILE_API + "/" + user.id,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    email: email
                })
            }
        );


        if (!response.ok) {

            const errorText = await response.text();

            throw new Error(errorText);
        }


        const updatedUser = await response.json();


        // Update profile display
        document.getElementById("profileName").textContent =
            updatedUser.name;

        document.getElementById("profileEmail").textContent =
            updatedUser.email;


        // Update localStorage
        user.name = updatedUser.name;
        user.email = updatedUser.email;

        localStorage.setItem(
            "user",
            JSON.stringify(user)
        );


        // Show success message
        document.getElementById("message").textContent =
            "Profile updated successfully!";


        alert("Profile updated successfully!");


        // Hide edit form
        document.getElementById("editForm").style.display =
            "none";


    } catch (error) {

        console.error("Update error:", error);

        alert(
            "Profile update failed.\n\n" +
            error.message
        );
    }
}