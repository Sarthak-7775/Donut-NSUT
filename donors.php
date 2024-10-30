<?php
include 'db_connection.php'; 

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $nsut_id = $_POST['nsut_id'];
    $name = $_POST['name'];
    $mobile_no = $_POST['mobile_no'];
    $designation = $_POST['designation'];
    $description = $_POST['description'];

    $stmt = $conn->prepare("INSERT INTO Donors (NSUT_ID, Name, Mobile_No, Designation, Description) VALUES (?, ?, ?, ?, ?)");
    $stmt->bind_param("issss", $nsut_id, $name, $mobile_no, $designation, $description);
    $stmt->execute();
    $stmt->close();
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Donors</title>
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <h2>Donors</h2>
    <form method="POST">
        <label for="nsut_id">NSUT ID:</label>
        <input type="text" id="nsut_id" name="nsut_id" required>
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required>
        <label for="mobile_no">Mobile No:</label>
        <input type="text" id="mobile_no" name="mobile_no" required>
        <label for="designation">Designation:</label>
        <input type="text" id="designation" name="designation" required>
        <label for="description">Description:</label>
        <input type="text" id="description" name="description">
        <button type="submit">Add Donor</button>
    </form>
</body>
</html>
