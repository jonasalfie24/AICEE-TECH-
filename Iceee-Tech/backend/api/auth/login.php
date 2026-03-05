<?php
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../Database.php';
require_once __DIR__ . '/../../JWT.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['email']) || !isset($input['password'])) {
    http_response_code(400);
    exit(json_encode(['error' => 'Email and password required']));
}

$email = filter_var($input['email'], FILTER_SANITIZE_EMAIL);
$password = $input['password'];

$db = Database::getInstance();

try {
    $db->prepare("SELECT id, email, password_hash, name, role, approved, strand, section FROM users WHERE email = ?")
        ->bind(1, $email, MYSQLI_TYPE_STRING)
        ->execute();

    $user = $db->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        http_response_code(401);
        exit(json_encode(['error' => 'Invalid credentials']));
    }

    // Create JWT token
    $payload = [
        'id' => (int)$user['id'],
        'email' => $user['email'],
        'name' => $user['name'],
        'role' => $user['role'],
        'approved' => (bool)$user['approved']
    ];

    $token = JWT::encode($payload);

    // Log the login
    require_once __DIR__ . '/../../Middleware.php';
    Middleware::logAudit($user['id'], 'LOGIN', 'user', $user['id']);

    http_response_code(200);
    echo json_encode([
        'token' => $token,
        'user' => [
            'id' => (int)$user['id'],
            'email' => $user['email'],
            'name' => $user['name'],
            'role' => $user['role'],
            'approved' => (bool)$user['approved'],
            'strand' => $user['strand'],
            'section' => $user['section']
        ]
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

$db->close();
