<?php
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../Database.php';
require_once __DIR__ . '/../../Middleware.php';

$user = Middleware::requireRole('admin');
$db = Database::getInstance();

try {
    $db->prepare("SELECT id, name, email, strand, section, created_at FROM users WHERE role = 'student' AND approved = FALSE ORDER BY created_at ASC")
        ->execute();

    $users = $db->fetchAll();

    http_response_code(200);
    echo json_encode(['users' => $users]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

$db->close();
