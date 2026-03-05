<?php
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../Database.php';
require_once __DIR__ . '/../../JWT.php';
require_once __DIR__ . '/../../Middleware.php';

$user = Middleware::requireApproved();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    // Get user's medical records
    $db = Database::getInstance();

    try {
        $status = $_GET['status'] ?? null;
        
        if ($status) {
            $db->prepare("SELECT id, strand, section, student_name, medical_condition, record_date, status, created_at FROM medical_records WHERE user_id = ? AND status = ? ORDER BY record_date DESC")
                ->bind(1, $user['id'], MYSQLI_TYPE_LONG)
                ->bind(2, $status, MYSQLI_TYPE_STRING)
                ->execute();
        } else {
            $db->prepare("SELECT id, strand, section, student_name, medical_condition, record_date, status, created_at FROM medical_records WHERE user_id = ? ORDER BY record_date DESC")
                ->bind(1, $user['id'], MYSQLI_TYPE_LONG)
                ->execute();
        }

        $records = $db->fetchAll();

        http_response_code(200);
        echo json_encode(['records' => $records]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }

    $db->close();

} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Create new medical record
    $input = json_decode(file_get_contents('php://input'), true);

    $required = ['strand', 'section', 'studentName', 'medicalCondition', 'recordDate'];
    foreach ($required as $field) {
        if (!isset($input[$field])) {
            http_response_code(400);
            exit(json_encode(['error' => "$field is required"]));
        }
    }

    $db = Database::getInstance();

    try {
        $strand = filter_var($input['strand'], FILTER_SANITIZE_STRING);
        $section = filter_var($input['section'], FILTER_SANITIZE_STRING);
        $studentName = filter_var($input['studentName'], FILTER_SANITIZE_STRING);
        $medicalCondition = filter_var($input['medicalCondition'], FILTER_SANITIZE_STRING);
        $recordDate = filter_var($input['recordDate'], FILTER_SANITIZE_STRING);

        $db->prepare("INSERT INTO medical_records (user_id, strand, section, student_name, medical_condition, record_date, status) VALUES (?, ?, ?, ?, ?, ?, ?)")
            ->bind(1, $user['id'], MYSQLI_TYPE_LONG)
            ->bind(2, $strand, MYSQLI_TYPE_STRING)
            ->bind(3, $section, MYSQLI_TYPE_STRING)
            ->bind(4, $studentName, MYSQLI_TYPE_STRING)
            ->bind(5, $medicalCondition, MYSQLI_TYPE_STRING)
            ->bind(6, $recordDate, MYSQLI_TYPE_STRING)
            ->bind(7, 'submitted', MYSQLI_TYPE_STRING)
            ->execute();

        $recordId = $db->lastId();

        // Log the action
        Middleware::logAudit($user['id'], 'CREATE_RECORD', 'medical_record', $recordId, null, $input);

        http_response_code(201);
        echo json_encode([
            'message' => 'Medical record created successfully',
            'record' => [
                'id' => $recordId,
                'strand' => $strand,
                'section' => $section,
                'student_name' => $studentName,
                'medical_condition' => $medicalCondition,
                'record_date' => $recordDate,
                'status' => 'submitted'
            ]
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }

    $db->close();

} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
