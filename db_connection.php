<?php
// db_connection.php

// Database configuration
$servername = "localhost"; // Database server address
$username = "root"; // Database username (default for XAMPP)
$password = ""; // Database password (default for XAMPP is usually empty)
$dbname = "college_donations_db"; // Your database name

// Create a new MySQLi connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check the connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Optional: Set the charset for the connection to UTF-8
$conn->set_charset("utf8");

?>
