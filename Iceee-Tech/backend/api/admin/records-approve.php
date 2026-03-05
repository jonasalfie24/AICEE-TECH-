<?php
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../Database.php';
require_once __DIR__ . '/../../Middleware.php';
require_once __DIR__ . '/../../Email.php';

$user = Middleware::requireRole('admin');
$recordId = $_GET['id'] ?? null;

if (!$recordId) {
    http_response_code(400);
    exit(json_encode(['error' => 'Record ID required']));
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit(json_encode(['error' => 'Method not allowed']));
}

$db = Database::getInstance();

try {
    // Get record and student email
    $db->prepare("
        SELECT mr.id, mr.student_name, u.email 
        FROM medical_records mr
        LEFT JOIN users u ON mr.user_id = u.id
        WHERE mr.id = ?
    ")->bind(1, $recordId, MYSQLI_TYPE_LONG)->execute();

    $record = $db->fetch();

    if (!$record) {
        http_response_code(404);
        exit(json_encode(['error' => 'Record not found']));
    }

    // Update record status
    $db->prepare("UPDATE medical_records SET status = 'approved', updated_at = NOW() WHERE id = ?")
        ->bind(1, $recordId, MYSQLI_TYPE_LONG)
        ->execute();

    // Send email notification
    if ($record['email']) {
        Email::sendRecordApproved($record['email'], $record['student_name'], $recordId);
    }

    // Log the action
    Middleware::logAudit($user['id'], 'APPROVE_RECORD', 'medical_record', $recordId);

    http_response_code(200);
    echo json_encode(['message' => 'Record approved successfully']);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

$db->close();
