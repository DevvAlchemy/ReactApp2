<?php
// Save this as: backend/api/test.php
// Simple test to see if PHP and database work

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

echo "PHP is working! ";

try {
    // Test database connection
    require_once('../config/database.php');
    echo "Database connected! ";
    
    // Test if reservations table exists
    $result = $conn->query("SELECT COUNT(*) as count FROM reservations");
    $row = $result->fetch_assoc();
    echo "Reservations table has " . $row['count'] . " rows.";
    
    echo json_encode([
        'success' => true,
        'message' => 'Everything is working!',
        'reservations_count' => $row['count']
    ]);
    
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Error: ' . $e->getMessage()
    ]);
}
?>