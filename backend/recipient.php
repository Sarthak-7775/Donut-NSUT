<?php
// recipient.php
include 'db_connection.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $recipient_name = $_POST['recipient_name'];
    $contact_details = $_POST['contact_details'];
    $society_id = $_POST['society_id'];
    $donation_id = $_POST['donation_id'];
    $recipient_address = $_POST['recipient_address'];

    $sql = "INSERT INTO Recipient (Recipient_Name, Contact_Details, Society_ID, Donation_ID, Recipient_Address)
            VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("ssiss", $recipient_name, $contact_details, $society_id, $donation_id, $recipient_address);

    if ($stmt->execute()) {
        echo "Recipient added successfully!";
    } else {
        echo "Error: " . $stmt->error;
    }
    $stmt->close();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Add Recipient</title>
</head>
<body>
    <h2>Add Recipient</h2>
    <form method="post" action="recipient.php">
        <label>Recipient Name:</label><input type="text" name="recipient_name" required><br>
        <label>Contact Details:</label><input type="text" name="contact_details" required><br>
        <label>Society ID:</label><input type="text" name="society_id"><br>
        <label>Donation ID:</label><input type="text" name="donation_id"><br>
        <label>Recipient Address:</label><textarea name="recipient_address"></textarea><br>
        <button type="submit">Add Recipient</button>
    </form>
</body>
</html>
