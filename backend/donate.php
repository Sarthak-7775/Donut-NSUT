<?php
// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Include the database connection file
include 'db_connection.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $nsut_id = $_POST['nsut_id'];
    $type_of_donation = $_POST['type_of_donation'];
    $quantity = $_POST['quantity'];
    $description = $_POST['description'];

    // Prepare the SQL statement to insert donation data
    $stmt = $conn->prepare("INSERT INTO donations (NSUT_ID, Type_Of_Donation) VALUES (?, ?)");
    $stmt->bind_param("ss", $nsut_id, $type_of_donation);

    // Execute the query
    if ($stmt->execute()) {
        // Get the last inserted Donation_ID
        $donation_id = $conn->insert_id;

        // Prepare to insert into Donation_Details
        $details_stmt = $conn->prepare("INSERT INTO donation_details (Donation_ID, NSUT_ID, Donation_Date, Donation_Type, Quantity, Description) VALUES (?, ?, NOW(), ?, ?, ?)");
        $details_stmt->bind_param("issis", $donation_id, $nsut_id, $type_of_donation, $quantity, $description);

        // Execute details query
        if ($details_stmt->execute()) {
            // Log the donation
            file_put_contents('donation_log.txt', "NSUT ID: $nsut_id, Donation Type: $type_of_donation, Quantity: $quantity, Description: $description\n", FILE_APPEND);
            echo "<script>document.getElementById('feedback').textContent = 'Thank you for your donation!';</script>";
        } else {
            echo "<script>document.getElementById('feedback').textContent = 'Error saving donation details!';</script>";
        }
        $details_stmt->close();
    } else {
        echo "<script>document.getElementById('feedback').textContent = 'Error saving donation!';</script>";
    }

    $stmt->close();
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Donation Form</title>
    <link rel="stylesheet" href="style.css"> <!-- Add your CSS file here -->
    <script src="script.js" defer></script> <!-- Add your JS file here -->
</head>
<body style="background-color: black; color: white;">
    <h1>Donate</h1>
    <form id="donationForm" method="POST" action="">
        <label for="nsut_id">NSUT ID:</label>
        <input type="text" id="nsut_id" name="nsut_id" required>

        <label for="type_of_donation">Type of Donation:</label>
        <select id="type_of_donation" name="type_of_donation" required>
            <option value="books">Books</option>
            <option value="clothes">Clothes</option>
            <option value="money">Money</option>
        </select>

        <label for="quantity">Quantity:</label>
        <input type="number" id="quantity" name="quantity" required>

        <label for="description">Description:</label>
        <textarea id="description" name="description" rows="4" required></textarea>

        <button type="submit">Donate</button>
    </form>

    <div id="feedback"></div> <!-- Feedback message will be displayed here -->
</body>
</html>
