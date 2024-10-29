<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

$servername = "localhost"; // Database server name
$username = "root"; // Database username
$password = ""; // Database password
$dbname = "college_donations_db"; // Database name

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check if data is being posted
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    // Retrieve form data
    $nsut_id = $_POST['nsut_id'];
    $type_of_donation = $_POST['type_of_donation'];
    $quantity = $_POST['quantity'];
    $description = $_POST['description'];

    
    $check_donor = $conn->prepare("SELECT NSUT_ID FROM Donors WHERE NSUT_ID = ?");
    $check_donor->bind_param("i", $nsut_id);
    $check_donor->execute();
    $check_donor->store_result();
    
    if ($check_donor->num_rows === 0) {
        // If NSUT_ID does not exist in Donors table, insert it (modify as needed for actual donor data)
        $insert_donor = $conn->prepare("INSERT INTO Donors (NSUT_ID, Name, Mobile_No, Designation, Description) VALUES (?, 'John Doe', '1234567890', 'Student', 'Sample donor')");
        $insert_donor->bind_param("i", $nsut_id);
        $insert_donor->execute();
    }

    // Prepare and bind
    // Step 1: Insert into Donations table
    $sql_donation = "INSERT INTO Donations (NSUT_ID, Type_Of_Donation) VALUES (?, ?)";
    $stmt_donation = $conn->prepare($sql_donation);
    $stmt_donation->bind_param("is", $nsut_id, $type_of_donation);
    $stmt_donation->execute();

    // Step 2: Retrieve the last inserted Donation_ID
    $donation_id = $conn->insert_id; // This is the Donation_ID generated in Donations

    // Step 3: Insert into Donation_Details using the retrieved Donation_ID
    $sql_details = "INSERT INTO Donation_Details (Donation_ID, NSUT_ID, Donation_Date, Society_ID, Type_Of_Donation, Quantity, Description) 
                    VALUES (?, ?, ?, ?, ?, ?, ?)";
    $stmt_details = $conn->prepare($sql_details);
    $stmt_details->bind_param("iisisis", $donation_id, $nsut_id, $donation_date, $society_id, $type_of_donation, $quantity, $description);
    $stmt_details->execute();


    // Execute the statement
    if ($stmt->execute()) {
        // Log the donation
        $logEntry = "NSUT ID: $nsut_id, Type_Of_Donation: $type_of_donation, Quantity: $quantity, Description: $description\n";
        if (file_put_contents('donation_log.txt', $logEntry, FILE_APPEND) !== false) {
            echo "Donation recorded successfully!";
            // Log the action of writing to the log file
            error_log("Log entry added: $logEntry", 3, 'donation_log.txt'); // Log the entry to the log file
        } else {
            echo "Error writing to donation log file.";
            error_log("Failed to write to log file for NSUT ID: $nsut_id", 3, 'donation_log.txt'); // Log the error
        }
    } else {
        echo "Error: " . $stmt->error; // This will show any errors with the SQL execution
    }

    $stmt->close();
}

$conn->close();
?>
