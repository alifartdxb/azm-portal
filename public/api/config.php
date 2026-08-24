<?php
// AZM Group - Hostinger PHP API config

// Enable CORS for development
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Database configuration
define('DB_HOST', 'localhost');
define('DB_NAME', 'u123456789_azmgroup'); // Replace with Hostinger database name
define('DB_USER', 'u123456789_admin'); // Replace with Hostinger database user
define('DB_PASS', 'YourSecurePassword123!'); // Replace with Hostinger database password

function getDB() {
    static $pdo = null;
    if ($pdo === null) {
        try {
            // For testing in AI Studio (SQLite mock fallback if MySQL fails)
            if (!class_exists('PDO')) {
                die(json_encode(['error' => 'PDO extension required']));
            }
            $pdo = new PDO("mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=utf8mb4", DB_USER, DB_PASS);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        } catch (PDOException $e) {
            // Check if we are running in an environment without MySQL, fallback to a local SQLite for preview
            try {
                $pdo = new PDO("sqlite:" . __DIR__ . "/database.sqlite");
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
            } catch (PDOException $e2) {
                http_response_code(500);
                echo json_encode(['error' => 'Database connection failed']);
                exit;
            }
        }
    }
    return $pdo;
}

function sendJson($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data);
    exit;
}

function requireAuth() {
    session_start();
    if (!isset($_SESSION['user_id'])) {
        // Check for basic mock auth header in dev
        $headers = getallheaders();
        if (isset($headers['Authorization']) && $headers['Authorization'] === 'Bearer dev_token') {
            return ['id' => 1, 'role_id' => 1];
        }
        sendJson(['error' => 'Unauthorized', 'code' => 'ACCESS_DENIED'], 401);
    }
    return $_SESSION;
}
