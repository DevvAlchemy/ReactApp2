<?php
/**
 * Get Single Reservation Endpoint
 * This fetches one specific reservation by ID
 */

require_once('../config/config.php');
require_once('../config/database.php');

// Only allow GET requests
if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Use GET.'
    ]);
    exit();
}

try {
    // VALIDATION: Check if ID parameter is provided
    // In PHP, URL parameters come through $_GET (like ?id=123)
    if (!isset($_GET['id']) || empty($_GET['id'])) {
        throw new InvalidArgumentException('Reservation ID is required');
    }
    
    // SANITIZATION: Make sure ID is a valid integer
    $reservationId = filter_var($_GET['id'], FILTER_VALIDATE_INT);
    
    if ($reservationId === false || $reservationId <= 0) {
        throw new InvalidArgumentException('Invalid reservation ID format');
    }
    
    // SQL QUERY: Get specific reservation by ID
    // We use prepared statements to prevent SQL injection
    $stmt = $conn->prepare("
        SELECT 
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
        WHERE id = ?
    ");
    
    if (!$stmt) {
        throw new Exception("Prepare statement failed: " . $conn->error);
    }
    
    // Bind the ID parameter to the query
    // 'i' means integer type
    $stmt->bind_param('i', $reservationId);
    
    // Execute the query
    if (!$stmt->execute()) {
        throw new Exception("Execute failed: " . $stmt->error);
    }
    
    // Get the result
    $result = $stmt->get_result();
    $reservation = $result->fetch_assoc();
    
    // CHECK RESULT: See if we found a reservation
    if (!$reservation) {
        // No reservation found with this ID
        http_response_code(404); // Not Found
        echo json_encode([
            'success' => false,
            'message' => 'Reservation not found'
        ]);
        exit();
    }
    
    // SUCCESS: Return the reservation data
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Reservation retrieved successfully',
        'data' => $reservation
    ]);
    
} catch (InvalidArgumentException $e) {
    // CLIENT ERROR: Bad input from user
    http_response_code(400); // Bad Request
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
    
} catch (Exception $e) {
    // SERVER ERROR: Something went wrong on our end
    error_log("Error fetching reservation: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Unable to retrieve reservation. Please try again.'
    ]);
    
} finally {
    // CLEANUP: Close database resources
    if (isset($stmt)) {
        $stmt->close();
    }
    if (isset($conn)) {
        $conn->close();
    }
}
?>