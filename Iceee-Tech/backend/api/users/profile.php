<?php
require_once __DIR__ . '/../../config.php';
require_once __DIR__ . '/../../Database.php';
require_once __DIR__ . '/../../JWT.php';
require_once __DIR__ . '/../../Middleware.php';

$user = Middleware::requireAuth();
$db = Database::getInstance();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
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
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }

} elseif ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    try {
        $input = json_decode(file_get_contents('php://input'), true);

        $name = isset($input['name']) ? filter_var($input['name'], FILTER_SANITIZE_STRING) : null;
        $strand = isset($input['strand']) ? filter_var($input['strand'], FILTER_SANITIZE_STRING) : null;
        $section = isset($input['section']) ? filter_var($input['section'], FILTER_SANITIZE_STRING) : null;

        $updates = [];
        $types = '';
        $values = [];

        if ($name) {
            $updates[] = "name = ?";
            $types .= 's';
            $values[] = $name;
        }

        if ($strand) {
            $updates[] = "strand = ?";
            $types .= 's';
            $values[] = $strand;
        }

        if ($section) {
            $updates[] = "section = ?";
            $types .= 's';
            $values[] = $section;
        }

        if (empty($updates)) {
            http_response_code(400);
            exit(json_encode(['error' => 'No fields to update']));
        }

        $query = "UPDATE users SET " . implode(', ', $updates) . ", updated_at = NOW() WHERE id = ?";
        $types .= 'i';
        $values[] = $user['id'];

        $db->prepare($query);
        $i = 1;
        foreach ($values as $value) {
            $type = $types[$i - 1];
            if ($type === 'i') {
                $db->bind($i, $value, MYSQLI_TYPE_LONG);
            } else {
                $db->bind($i, $value, MYSQLI_TYPE_STRING);
            }
            $i++;
        }

        $db->execute();

        // Get updated user data
        $db->prepare("SELECT id, email, name, role, approved, strand, section FROM users WHERE id = ?")
            ->bind(1, $user['id'], MYSQLI_TYPE_LONG)
            ->execute();

        $userData = $db->fetch();

        // Log the action
        Middleware::logAudit($user['id'], 'UPDATE_PROFILE', 'user', $user['id'], null, $input);

        http_response_code(200);
        echo json_encode([
            'message' => 'Profile updated successfully',
            'user' => [
                'id' => (int)$userData['id'],
                'email' => $userData['email'],
                'name' => $userData['name'],
                'role' => $userData['role'],
                'approved' => (bool)$userData['approved'],
                'strand' => $userData['strand'],
                'section' => $userData['section']
            ]
        ]);
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['error' => $e->getMessage()]);
    }

} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}

$db->close();
