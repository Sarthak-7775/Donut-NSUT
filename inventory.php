<?php
// inventory.php
include 'db_connection.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $society_id = $_POST['society_id'];
    $item_type = $_POST['item_type'];
    $quantity = $_POST['quantity'];
    $item_condition = $_POST['item_condition'];
    $location = $_POST['location'];

    $sql = "INSERT INTO Inventory (Society_ID, Item_Type, Quantity, Item_Condition, Location)
            VALUES (?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("isiss", $society_id, $item_type, $quantity, $item_condition, $location);

    if ($stmt->execute()) {
        echo "Inventory item added successfully!";
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
    <title>Add Inventory Item</title>
</head>
<body>
    <h2>Add Inventory Item</h2>
    <form method="post" action="inventory.php">
        <label>Society ID:</label><input type="text" name="society_id" required><br>
        <label>Item Type:</label><input type="text" name="item_type" required><br>
        <label>Quantity:</label><input type="number" name="quantity" required><br>
        <label>Condition:</label><input type="text" name="item_condition"><br>
        <label>Location:</label><input type="text" name="location"><br>
        <button type="submit">Add Item</button>
    </form>
</body>
</html>
