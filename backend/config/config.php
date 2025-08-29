<?php
/**
 * CORS Configuration for Reservations App
 */

class CorsHandler {
    private $allowedOrigins = [
        'http://localhost:3000',
        'http://localhost:3001', 
        'http://127.0.0.1:3000'
    ];
    
    private $allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'];
    private $allowedHeaders = ['Content-Type', 'Authorization'];
    
    public function handleCors() {
        $origin = $_SERVER['HTTP_ORIGIN'] ?? '';
        
        // Check if origin is allowed OR if no origin header (for development)
        if (in_array($origin, $this->allowedOrigins) || empty($origin)) {
            // If we have a valid origin, use it; otherwise use wildcard for development
            if (!empty($origin) && in_array($origin, $this->allowedOrigins)) {
                header('Access-Control-Allow-Origin: ' . $origin);
            } else {
                // For development when HTTP_ORIGIN is missing
                header('Access-Control-Allow-Origin: http://localhost:3000');
            }
        }
        
        header('Access-Control-Allow-Methods: ' . implode(', ', $this->allowedMethods));
        header('Access-Control-Allow-Headers: ' . implode(', ', $this->allowedHeaders));
        header('Access-Control-Max-Age: 86400');
        
        // Handle preflight OPTIONS requests
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit();
        }
    }
}

// Initialize CORS handling
$corsHandler = new CorsHandler();
$corsHandler->handleCors();

// Set common headers
header('Content-Type: application/json; charset=utf-8');
?>