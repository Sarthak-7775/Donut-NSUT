<?php
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "college_donations_db";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

error_reporting(E_ALL);
ini_set('display_errors', 1);
?>
