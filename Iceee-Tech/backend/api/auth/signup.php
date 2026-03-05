<?php
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../Database.php';
require_once __DIR__ . '/../../JWT.php';
require_once __DIR__ . '/../../Middleware.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['name']) || !isset($input['email']) || !isset($input['password'])) {
    http_response_code(400);
    exit(json_encode(['error' => 'Name, email and password required']));
}

$name = filter_var($input['name'], FILTER_SANITIZE_STRING);
$email = filter_var($input['email'], FILTER_SANITIZE_EMAIL);
$password = $input['password'];
$strand = isset($input['strand']) ? filter_var($input['strand'], FILTER_SANITIZE_STRING) : null;
$section = isset($input['section']) ? filter_var($input['section'], FILTER_SANITIZE_STRING) : null;

// Validate email
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    exit(json_encode(['error' => 'Invalid email format']));
}

// Validate password strength
if (strlen($password) < 8) {
    http_response_code(400);
    exit(json_encode(['error' => 'Password must be at least 8 characters']));
}

$db = Database::getInstance();

try {
    // Check if email already exists
    $db->prepare("SELECT id FROM users WHERE email = ?")
        ->bind(1, $email, MYSQLI_TYPE_STRING)
        ->execute();

    if ($db->fetch()) {
        http_response_code(409);
        exit(json_encode(['error' => 'Email already registered']));
    }

    $passwordHash = password_hash($password, PASSWORD_BCRYPT);

    // Insert new user
    $db->prepare("INSERT INTO users (name, email, password_hash, role, approved, strand, section) VALUES (?, ?, ?, ?, ?, ?, ?)")
        ->bind(1, $name, MYSQLI_TYPE_STRING)
        ->bind(2, $email, MYSQLI_TYPE_STRING)
        ->bind(3, $passwordHash, MYSQLI_TYPE_STRING)
        ->bind(4, 'student', MYSQLI_TYPE_STRING)
        ->bind(5, 0, MYSQLI_TYPE_LONG)
        ->bind(6, $strand, MYSQLI_TYPE_STRING)
        ->bind(7, $section, MYSQLI_TYPE_STRING)
        ->execute();

    $userId = $db->lastId();

    // Create JWT token
    $payload = [
        'id' => $userId,
        'email' => $email,
        'name' => $name,
        'role' => 'student',
        'approved' => false
    ];

    $token = JWT::encode($payload);

    // Log the signup
    Middleware::logAudit($userId, 'SIGNUP', 'user', $userId, null, ['email' => $email, 'name' => $name]);

    // Send welcome email (implement as needed)
    // sendWelcomeEmail($email, $name);

    http_response_code(201);
    echo json_encode([
        'token' => $token,
        'user' => [
            'id' => $userId,
            'email' => $email,
            'name' => $name,
            'role' => 'student',
            'approved' => false,
            'strand' => $strand,
            'section' => $section
        ],
        'message' => 'Account created successfully. Awaiting admin approval.'
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

$db->close();
