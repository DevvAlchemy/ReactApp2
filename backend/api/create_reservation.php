<?php
/**
 * This handles POST requests from  React form
 */

// Include configuration files (handles CORS)

require_once('../config/config.php');
require_once('../config/database.php');

//Debug for Error 500

error_reporting(E_ALL);
ini_set('display_errors', 1);

// Log what we receive
error_log("POST data received: " . file_get_contents('php://input'));


// Only allow POST requests for creating reservations
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405); // Method Not Allowed
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Use POST.'
    ]);
    exit();
}

try {
    // GET REQUEST DATA: Read JSON from React app
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    // Check if JSON is valid
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new InvalidArgumentException('Invalid JSON format');
    }
    
    // VALIDATION: Check all required fields are present
    $requiredFields = ['customer_name', 'email', 'phone', 'reservation_date', 'reservation_time', 'party_size'];
    
    foreach ($requiredFields as $field) {
        if (!isset($data[$field]) || trim($data[$field]) === '') {
            throw new InvalidArgumentException("Missing or empty required field: {$field}");
        }
    }
    
    // SANITIZATION: Clean the input data
    $customerName = trim(htmlspecialchars($data['customer_name'], ENT_QUOTES, 'UTF-8'));
    $email = trim($data['email']);
    $phone = trim($data['phone']);
    $reservationDate = trim($data['reservation_date']);
    $reservationTime = trim($data['reservation_time']);
    $partySize = (int) $data['party_size'];
    $specialRequests = isset($data['special_requests']) ? trim(htmlspecialchars($data['special_requests'], ENT_QUOTES, 'UTF-8')) : '';
    
    // ADDITIONAL VALIDATION: Check data format and rules
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new InvalidArgumentException('Invalid email format');
    }
    
    if ($partySize < 1 || $partySize > 20) {
        throw new InvalidArgumentException('Party size must be between 1 and 20');
    }
    
    if (!preg_match('/^\d{4}-\d{2}-\d{2}$/', $reservationDate)) {
        throw new InvalidArgumentException('Invalid date format. Use YYYY-MM-DD');
    }
    
    if (!preg_match('/^\d{2}:\d{2}$/', $reservationTime)) {
        throw new InvalidArgumentException('Invalid time format. Use HH:MM');
    }
    
    // Check if date is not in the past
    $reservationDateTime = DateTime::createFromFormat('Y-m-d H:i', $reservationDate . ' ' . $reservationTime);
    if ($reservationDateTime < new DateTime()) {
        throw new InvalidArgumentException('Cannot make reservations for past dates/times');
    }
    
    // DATABASE INSERT: Save reservation to database
    $stmt = $conn->prepare("
        INSERT INTO reservations (
            customer_name, 
            email, 
            phone, 
            reservation_date, 
            reservation_time, 
            party_size, 
            special_requests, 
            status, 
            created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 'pending', NOW())
    ");
    
    if (!$stmt) {
        throw new Exception("Prepare statement failed: " . $conn->error);
    }
    
    // Bind parameters: s=string, i=integer
    $stmt->bind_param('sssssrs', $customerName, $email, $phone, $reservationDate, $reservationTime, $partySize, $specialRequests);
    
    if ($stmt->execute()) {
        // SUCCESS: Get the ID of the new reservation
        $reservationId = $stmt->insert_id;
        
        http_response_code(201); // Created
        echo json_encode([
            'success' => true,
            'message' => 'Reservation created successfully',
            'data' => [
                'reservation_id' => $reservationId,
                'customer_name' => $customerName,
                'reservation_date' => $reservationDate,
                'reservation_time' => $reservationTime,
                'party_size' => $partySize,
                'status' => 'pending'
            ]
        ]);
    } else {
        throw new Exception("Failed to create reservation: " . $stmt->error);
    }
    
} catch (InvalidArgumentException $e) {
    // CLIENT ERROR: Bad input from user (400 status)
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
    
} catch (Exception $e) {
    // SERVER ERROR: Something went wrong on our end (500 status)
    error_log("Reservation creation error: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Internal server error occurred'
    ]);
    
} finally {
    // CLEANUP: Always close database resources
    if (isset($stmt)) {
        $stmt->close();
    }
    if (isset($conn)) {
        $conn->close();
    }
}
?>