document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("donationForm");
    const feedback = document.getElementById("feedback");

    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent form submission for validation

        const nsutId = document.getElementById("nsut_id").value;
        const donationType = document.getElementById("type_of_donation").value;
        const quantity = document.getElementById("quantity").value;
        const description = document.getElementById("description").value;

        // Basic validation
        if (nsutId.trim() === "" || quantity <= 0 || description.trim() === "") {
            feedback.textContent = "Please fill out all fields correctly.";
            feedback.style.color = "red"; // Red feedback for errors
            return;
        }

        // If valid, simulate successful submission
        feedback.textContent = "Thank you for your donation! Processing...";
        feedback.style.color = "#ffcc00"; // Yellow feedback for success

        // Create a FormData object to handle form submission
        const formData = new FormData(form);

        // Perform AJAX call to submit the form data
        fetch('donate.php', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.text(); // You can use response.json() if your backend returns JSON
        })
        .then(data => {
            // Handle successful response from the server
            feedback.textContent = data; // Display response from PHP
            feedback.style.color = "green"; // Green feedback for success
            form.reset(); // Reset the form fields
        })
        .catch(error => {
            // Handle any errors that occurred during the fetch
            feedback.textContent = "There was an error processing your donation. Please try again.";
            feedback.style.color = "red"; // Red feedback for errors
            console.error('There was a problem with your fetch operation:', error);
        });
    });
});
