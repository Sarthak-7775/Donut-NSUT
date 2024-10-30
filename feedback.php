<?php
// feedback.php
include 'db_connection.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $nsut_id = $_POST['nsut_id'];
    $donation_id = $_POST['donation_id'];
    $feedback_text = $_POST['feedback_text'];
    $rating = $_POST['rating'];
    $feedback_date = $_POST['feedback_date'];

    $sql = "INSERT INTO Feedback (NSUT_ID, Donation_ID, Feedback_Text, Rating, Feedback_Date)
            VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("iisis", $nsut_id, $donation_id, $feedback_text, $rating, $feedback_date);

    if ($stmt->execute()) {
        echo "Feedback added successfully!";
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
    <title>Add Feedback</title>
</head>
<body>
    <h2>Add Feedback</h2>
    <form method="post" action="feedback.php">
        <label>NSUT ID:</label><input type="text" name="nsut_id" required><br>
        <label>Donation ID:</label><input type="text" name="donation_id" required><br>
        <label>Feedback Text:</label><textarea name="feedback_text"></textarea><br>
        <label>Rating:</label><input type="number" name="rating" min="1" max="5"><br>
        <label>Feedback Date:</label><input type="date" name="feedback_date"><br>
        <button type="submit">Submit Feedback</button>
    </form>
</body>
</html>
