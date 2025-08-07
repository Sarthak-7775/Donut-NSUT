<?php
include 'db_connection.php'; 

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nsut_id = $_POST['nsut_id'];
    $type_of_donation = $_POST['type_of_donation'];

    $stmt = $conn->prepare("INSERT INTO Donations (NSUT_ID, Type_Of_Donation) VALUES (?, ?)");
    $stmt->bind_param("is", $nsut_id, $type_of_donation);
    $stmt->execute();
    $stmt->close();

    file_put_contents('logs/donation_log.txt', "NSUT ID: $nsut_id, Donation Type: $type_of_donation\n", FILE_APPEND);
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Donations</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <h2>Donations</h2>
    <form id="donationForm" method="POST">
        <label for="nsut_id">NSUT ID:</label>
        <input type="text" id="nsut_id" name="nsut_id" required>
        <label for="type_of_donation">Type of Donation:</label>
        <input type="text" id="type_of_donation" name="type_of_donation" required>
        <button type="submit">Submit Donation</button>
    </form>
    <p id="feedback"></p>
</body>
<script src="js/script.js"></script>
</html>
