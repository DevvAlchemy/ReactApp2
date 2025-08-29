<?php
/**
 * This fetches all reservations from the database
 */

// Include our configuration files
require_once('../config/config.php');
require_once('../config/database.php');

// Only allow GET requests for fetching data
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405); // Method Not Allowed
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Use GET.'
    ]);
    exit();
}

try {
    // SQL Query: Get all reservations ordered by date (newest first)
    //using ORDER BY to make sure newest reservations appear first
    $sql = "SELECT 
                id, 
                customer_name, 
                email, 
                phone, 
                reservation_date, 
                reservation_time, 
                party_size, 
                special_requests, 
                status, 
                created_at, 
                updated_at 
            FROM reservations 
            ORDER BY reservation_date DESC, reservation_time DESC";
    
    // Execute the query
    $result = $conn->query($sql);
    
    // Check if query was successful
    if (!$result) {
        throw new Exception("Query failed: " . $conn->error);
    }
    
    // FETCH DATA: Convert database rows to PHP array
    $reservations = [];
    
    // Loop through each row from the database
    while ($row = $result->fetch_assoc()) {
        // Add each reservation to our array
        // fetch_assoc() gives us an associative array (like a JavaScript object)
        $reservations[] = $row;
    }
    
    // SUCCESS RESPONSE: Send data back to React
    http_response_code(200); // OK status
    echo json_encode([
        'success' => true,
        'message' => 'Reservations retrieved successfully',
        'data' => $reservations,
        'count' => count($reservations) // Tell frontend how many reservations we found
    ]);
    
} catch (Exception $e) {
    // ERROR HANDLING: Log error and send user-friendly message
    error_log("Error fetching reservations: " . $e->getMessage());
    
    http_response_code(500); // Internal Server Error
    echo json_encode([
        'success' => false,
        'message' => 'Unable to retrieve reservations. Please try again.',
        'error' => $e->getMessage() // Include error details for debugging
    ]);
    
} finally {
    // CLEANUP: Always close the database connection
    if (isset($conn)) {
        $conn->close();
    }
}
?>