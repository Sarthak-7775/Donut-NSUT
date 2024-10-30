<?php
// notifications.php
include 'db_connection.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $recipient_id = $_POST['recipient_id'];
    $message = $_POST['message'];
    $date_sent = $_POST['date_sent'];
    $read_status = $_POST['read_status'];

    $sql = "INSERT INTO Notifications (Recipient_ID, Message, Date_Sent, Read_Status)
            VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isss", $recipient_id, $message, $date_sent, $read_status);

    if ($stmt->execute()) {
        echo "Notification sent successfully!";
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
    <title>Add Notification</title>
</head>
<body>
    <h2>Add Notification</h2>
    <form method="post" action="notifications.php">
        <label>Recipient ID:</label><input type="text" name="recipient_id" required><br>
        <label>Message:</label><textarea name="message" required></textarea><br>
        <label>Date Sent:</label><input type="date" name="date_sent"><br>
        <label>Read Status:</label>
        <select name="read_status">
            <option value="Unread">Unread</option>
            <option value="Read">Read</option>
        </select><br>
        <button type="submit">Send Notification</button>
    </form>
</body>
</html>
