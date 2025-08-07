<?php
// events.php
include 'db_connection.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nsut_id = $_POST['nsut_id'];
    $event_name = $_POST['event_name'];
    $event_date = $_POST['event_date'];
    $description = $_POST['description'];

    $sql = "INSERT INTO Events (NSUT_ID, Event_Name, Event_Date, Description)
            VALUES (?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isss", $nsut_id, $event_name, $event_date, $description);

    if ($stmt->execute()) {
        echo "Event added successfully!";
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
    <title>Add Event</title>
</head>
<body>
    <h2>Add Event</h2>
    <form method="post" action="events.php">
        <label>NSUT ID:</label><input type="text" name="nsut_id" required><br>
        <label>Event Name:</label><input type="text" name="event_name" required><br>
        <label>Event Date:</label><input type="date" name="event_date"><br>
        <label>Description:</label><textarea name="description"></textarea><br>
        <button type="submit">Add Event</button>
    </form>
</body>
</html>
