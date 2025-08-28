<?php
/**
 * This allows updating the status of existing reservations
 */

require_once('../config/config.php');
require_once('../config/database.php');

// Only allow POST requests for updating data
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode([
        'success' => false,
        'message' => 'Method not allowed. Use POST.'
    ]);
    exit();
}

try {
    // GET REQUEST DATA: Parse JSON from request body
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    // VALIDATION: Check if JSON is valid
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new InvalidArgumentException('Invalid JSON format');
    }
    
    // VALIDATION: Check required fields
    if (!isset($data['id']) || !isset($data['status'])) {
        throw new InvalidArgumentException('Missing required fields: id and status');
    }
    
    // SANITIZATION: Clean and validate input
    $reservationId = filter_var($data['id'], FILTER_VALIDATE_INT);
    $newStatus = trim($data['status']);
    
    if ($reservationId === false || $reservationId <= 0) {
        throw new InvalidArgumentException('Invalid reservation ID');
    }
    
    // VALIDATION: Check if status is valid
    $validStatuses = ['pending', 'confirmed', 'cancelled', 'completed'];
    if (!in_array($newStatus, $validStatuses)) {
        throw new InvalidArgumentException('Invalid status. Must be one of: ' . implode(', ', $validStatuses));
    }
    
    // STEP 1: Check if reservation exists
    $checkStmt = $conn->prepare("SELECT id, status FROM reservations WHERE id = ?");
    if (!$checkStmt) {
        throw new Exception("Prepare statement failed: " . $conn->error);
    }
    
    $checkStmt->bind_param('i', $reservationId);
    $checkStmt->execute();
    $result = $checkStmt->get_result();
    $existingReservation = $result->fetch_assoc();
    
    if (!$existingReservation) {
        http_response_code(404);
        echo json_encode([
            'success' => false,
            'message' => 'Reservation not found'
        ]);
        exit();
    }
    
    // BUSINESS LOGIC: Check if status change is allowed
    $currentStatus = $existingReservation['status'];
    
    // Example business rules (you can modify these):
    $allowedTransitions = [
        'pending' => ['confirmed', 'cancelled'],
        'confirmed' => ['completed', 'cancelled'], 
        'cancelled' => [], // Cannot change from cancelled
        'completed' => []  // Cannot change from completed
    ];
    
    if (!in_array($newStatus, $allowedTransitions[$currentStatus])) {
        throw new InvalidArgumentException(
            "Cannot change status from '{$currentStatus}' to '{$newStatus}'"
        );
    }
    
    // STEP 2: Update the reservation
    $updateStmt = $conn->prepare("
        UPDATE reservations 
        SET status = ?, updated_at = NOW() 
        WHERE id = ?
    ");
    
    if (!$updateStmt) {
        throw new Exception("Prepare update statement failed: " . $conn->error);
    }
    
    $updateStmt->bind_param('si', $newStatus, $reservationId);
    
    if (!$updateStmt->execute()) {
        throw new Exception("Update failed: " . $updateStmt->error);
    }
    
    // CHECK: Make sure the update actually affected a row
    if ($updateStmt->affected_rows === 0) {
        throw new Exception("No rows were updated. Reservation may not exist.");
    }
    
    // SUCCESS: Return updated reservation data
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'message' => 'Reservation status updated successfully',
        'data' => [
            'id' => $reservationId,
            'old_status' => $currentStatus,
            'new_status' => $newStatus,
            'updated_at' => date('Y-m-d H:i:s') // Current timestamp
        ]
    ]);
    
} catch (InvalidArgumentException $e) {
    // CLIENT ERROR: Bad input from user
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
    
} catch (Exception $e) {
    // SERVER ERROR: Something went wrong on our end
    error_log("Error updating reservation: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Unable to update reservation. Please try again.'
    ]);
    
} finally {
    // CLEANUP: Closing all database resources
    if (isset($checkStmt)) {
        $checkStmt->close();
    }
    if (isset($updateStmt)) {
        $updateStmt->close();
    }
    if (isset($conn)) {
        $conn->close();
    }
}
?>