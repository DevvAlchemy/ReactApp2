<?php
/**
 * Database Configuration for Reservations App
 * included error handling and connection management
 */

// Database configuration - Consider using environment variables in production
$dbConfig = [
    'host' => 'localhost',
    'username' => 'root', 
    'password' => '',
    'database' => 'reservations_db'
];

try {
    // Create database connection with error handling
    $conn = new mysqli(
        $dbConfig['host'], 
        $dbConfig['username'], 
        $dbConfig['password'], 
        $dbConfig['database']
    );
    
    // Set charset to prevent encoding issues
    $conn->set_charset("utf8mb4");
    
    // Check connection
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }
    
} catch (Exception $e) {
    // Log error (in production, use proper logging)
    error_log("Database connection error: " . $e->getMessage());
    
    // Return JSON error response
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed'
    ]);
    exit();
}
?>