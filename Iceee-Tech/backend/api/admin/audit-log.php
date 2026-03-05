<?php
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../Database.php';
require_once __DIR__ . '/../../Middleware.php';

$user = Middleware::requireRole('admin');
$db = Database::getInstance();

try {
    $db->prepare("
        SELECT 
            al.id,
            al.action,
            al.entity_type as entityType,
            u.name as userName,
            u.email as userEmail,
            al.created_at as timestamp,
            al.ip_address as ipAddress
        FROM audit_logs al
        LEFT JOIN users u ON al.user_id = u.id
        ORDER BY al.created_at DESC
        LIMIT 500
    ")->execute();

    $logs = $db->fetchAll();

    http_response_code(200);
    echo json_encode(['logs' => $logs]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

$db->close();
