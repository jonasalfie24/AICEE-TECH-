<?php
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../Database.php';
require_once __DIR__ . '/../../JWT.php';
require_once __DIR__ . '/../../Middleware.php';

$user = Middleware::requireAuth();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['currentPassword']) || !isset($input['newPassword'])) {
    http_response_code(400);
    exit(json_encode(['error' => 'Current password and new password required']));
}

$currentPassword = $input['currentPassword'];
$newPassword = $input['newPassword'];

// Validate new password
if (strlen($newPassword) < 8) {
    http_response_code(400);
    exit(json_encode(['error' => 'Password must be at least 8 characters']));
}

$db = Database::getInstance();

try {
    // Get current password hash
    $db->prepare("SELECT password_hash FROM users WHERE id = ?")
        ->bind(1, $user['id'], MYSQLI_TYPE_LONG)
        ->execute();

    $userData = $db->fetch();

    if (!$userData) {
        http_response_code(404);
        exit(json_encode(['error' => 'User not found']));
    }

    // Verify current password
    if (!password_verify($currentPassword, $userData['password_hash'])) {
        http_response_code(401);
        exit(json_encode(['error' => 'Current password is incorrect']));
    }

    // Hash new password
    $newPasswordHash = password_hash($newPassword, PASSWORD_BCRYPT);

    // Update password
    $db->prepare("UPDATE users SET password_hash = ?, updated_at = NOW() WHERE id = ?")
        ->bind(1, $newPasswordHash, MYSQLI_TYPE_STRING)
        ->bind(2, $user['id'], MYSQLI_TYPE_LONG)
        ->execute();

    // Log the action
    Middleware::logAudit($user['id'], 'CHANGE_PASSWORD', 'user', $user['id']);

    http_response_code(200);
    echo json_encode(['message' => 'Password changed successfully']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

$db->close();
