<?php
include 'db_connection.php'; // Include the database connection file

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Get form data
    $nsut_id = $_POST['nsut_id'];
    $society_name = $_POST['society_name'];
    $society_head_name = $_POST['society_head_name'];
    $soc_head_mob_no = $_POST['soc_head_mob_no'];

    // Prepare and bind
    $stmt = $conn->prepare("INSERT INTO Societies (NSUT_ID, Society_Name, Society_Head_Name, Soc_Head_Mob_No) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("isss", $nsut_id, $society_name, $society_head_name, $soc_head_mob_no);

    // Execute and check for errors
    if ($stmt->execute()) {
        echo "New society created successfully.";
    } else {
        echo "Error: " . $stmt->error;
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
    <title>Add Society</title>
    <link rel="stylesheet" href="style.css">
</head>
<body style="background-color: black; color: white;">
    <h1>Add Society</h1>
    <form action="societies.php" method="post">
        <label for="nsut_id">NSUT ID:</label>
        <input type="text" id="nsut_id" name="nsut_id" required>

        <label for="society_name">Society Name:</label>
        <input type="text" id="society_name" name="society_name" required>

        <label for="society_head_name">Society Head Name:</label>
        <input type="text" id="society_head_name" name="society_head_name" required>

        <label for="soc_head_mob_no">Society Head Mobile No:</label>
        <input type="text" id="soc_head_mob_no" name="soc_head_mob_no" required>

        <button type="submit">Add Society</button>
    </form>
</body>
</html>

