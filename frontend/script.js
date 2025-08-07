document.addEventListener("DOMContentLoaded", () => {
    // Mobile nav toggle
    const navToggleBtn = document.getElementById("nav-toggle");
    const navLinks = document.querySelector(".nav-links");
    if (navToggleBtn && navLinks) {
        navToggleBtn.addEventListener("click", () => {
            navLinks.classList.toggle("open");
        });
    }

    // Donation form handling
    const form = document.getElementById("donationForm");
    const feedback = document.getElementById("feedback");
    if (form) {
        form.addEventListener("submit", function(event) {
            event.preventDefault(); // Prevent default submission

            const nsutId = document.getElementById("nsut_id").value;
            const donationType = document.getElementById("type_of_donation").value;
            const quantity = document.getElementById("quantity").value;
            const description = document.getElementById("description").value;

            // Basic validation
            if (nsutId.trim() === "" || quantity <= 0 || description.trim() === "") {
                feedback.textContent = "Please fill out all fields correctly.";
                feedback.style.color = "red";
                return;
            }

            // Show processing feedback
            feedback.textContent = "Thank you for your donation! Processing...";
            feedback.style.color = "#ffcc00";

            // Submit via Fetch API
            const formData = new FormData(form);
            fetch("donate.php", {
                method: "POST",
                body: formData
            })
            .then(response => {
                if (!response.ok) throw new Error("Network response was not ok " + response.statusText);
                return response.text();
            })
            .then(data => {
                feedback.textContent = data;
                feedback.style.color = "green";
                form.reset();
            })
            .catch(error => {
                feedback.textContent = "There was an error processing your donation. Please try again.";
                feedback.style.color = "red";
                console.error("Fetch operation error:", error);
            });
        });
    }
});
