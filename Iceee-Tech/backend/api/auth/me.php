<?php
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../Database.php';
require_once __DIR__ . '/../../JWT.php';
require_once __DIR__ . '/../../Middleware.php';

$user = Middleware::requireAuth();

$db = Database::getInstance();

try {
    $db->prepare("SELECT id, email, name, role, approved, strand, section FROM users WHERE id = ?")
        ->bind(1, $user['id'], MYSQLI_TYPE_LONG)
        ->execute();

    $userData = $db->fetch();

    if (!$userData) {
        http_response_code(404);
        exit(json_encode(['error' => 'User not found']));
    }

    http_response_code(200);
    echo json_encode([
        'id' => (int)$userData['id'],
        'email' => $userData['email'],
        'name' => $userData['name'],
        'role' => $userData['role'],
        'approved' => (bool)$userData['approved'],
        'strand' => $userData['strand'],
        'section' => $userData['section']
    ]);
} catch (Exception $e) {
    http_response_code(401);
    echo json_encode(['error' => $e->getMessage()]);
}

$db->close();
