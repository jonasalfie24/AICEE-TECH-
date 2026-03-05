<?php
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../Database.php';
require_once __DIR__ . '/../../Middleware.php';

$user = Middleware::requireRole('admin');
$db = Database::getInstance();

try {
    $db->prepare("
        SELECT 
            mr.id, 
            mr.strand, 
            mr.section, 
            mr.student_name, 
            mr.medical_condition, 
            mr.record_date, 
            mr.status,
            u.email as student_email
        FROM medical_records mr
        LEFT JOIN users u ON mr.user_id = u.id
        ORDER BY mr.created_at DESC
    ")->execute();

    $records = $db->fetchAll();

    http_response_code(200);
    echo json_encode(['records' => $records]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

$db->close();
