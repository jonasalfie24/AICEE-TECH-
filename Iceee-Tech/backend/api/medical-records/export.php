<?php
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../Database.php';
require_once __DIR__ . '/../../Middleware.php';
require_once __DIR__ . '/../../PDFExport.php';

$user = Middleware::requireApproved();
$recordId = $_GET['id'] ?? null;

if (!$recordId) {
    http_response_code(400);
    exit(json_encode(['error' => 'Record ID required']));
}

$db = Database::getInstance();

try {
    // Verify the record belongs to the user or user is admin
    $query = "SELECT mr.* FROM medical_records mr";
    if ($user['role'] === 'student') {
        $query .= " WHERE mr.id = ? AND mr.user_id = ?";
        $db->prepare($query)
            ->bind(1, $recordId, MYSQLI_TYPE_LONG)
            ->bind(2, $user['id'], MYSQLI_TYPE_LONG)
            ->execute();
    } else {
        $query .= " WHERE mr.id = ?";
        $db->prepare($query)
            ->bind(1, $recordId, MYSQLI_TYPE_LONG)
            ->execute();
    }

    $record = $db->fetch();

    if (!$record) {
        http_response_code(404);
        exit(json_encode(['error' => 'Record not found']));
    }

    // Generate PDF
    $pdf = PDFExport::generateRecordPDF($record, $user['name']);

    // Return as JSON response with HTML content
    http_response_code(200);
    echo json_encode([
        'success' => true,
        'html' => $pdf['html'],
        'filename' => $pdf['filename']
    ]);

    // Log the action
    Middleware::logAudit($user['id'], 'EXPORT_RECORD', 'medical_record', $recordId);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

$db->close();
