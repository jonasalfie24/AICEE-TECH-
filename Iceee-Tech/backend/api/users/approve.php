<?php
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../Database.php';
require_once __DIR__ . '/../../Middleware.php';

$user = Middleware::requireRole('admin');
$userId = $_GET['id'] ?? null;

if (!$userId) {
    http_response_code(400);
    exit(json_encode(['error' => 'User ID required']));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

$db = Database::getInstance();

try {
    $db->prepare("UPDATE users SET approved = TRUE, updated_at = NOW() WHERE id = ?")->bind(1, $userId, MYSQLI_TYPE_LONG)->execute();

    Middleware::logAudit($user['id'], 'APPROVE_USER', 'user', $userId);

    http_response_code(200);
    echo json_encode(['message' => 'User approved successfully']);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

$db->close();
