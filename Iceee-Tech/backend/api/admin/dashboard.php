<?php
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../Database.php';
require_once __DIR__ . '/../../Middleware.php';

$user = Middleware::requireRole('admin');
$db = Database::getInstance();

try {
    // Total students
    $db->prepare("SELECT COUNT(*) as count FROM users WHERE role = 'student'")->execute();
    $totalStudents = $db->fetch()['count'] ?? 0;

    // Pending approvals
    $db->prepare("SELECT COUNT(*) as count FROM users WHERE role = 'student' AND approved = FALSE")->execute();
    $pendingApprovals = $db->fetch()['count'] ?? 0;

    // Total records
    $db->prepare("SELECT COUNT(*) as count FROM medical_records")->execute();
    $totalRecords = $db->fetch()['count'] ?? 0;

    // Approved records
    $db->prepare("SELECT COUNT(*) as count FROM medical_records WHERE status = 'approved'")->execute();
    $approvedRecords = $db->fetch()['count'] ?? 0;

    http_response_code(200);
    echo json_encode([
        'stats' => [
            'totalStudents' => (int)$totalStudents,
            'pendingApprovals' => (int)$pendingApprovals,
            'totalRecords' => (int)$totalRecords,
            'approvedRecords' => (int)$approvedRecords
        ]
    ]);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

$db->close();
