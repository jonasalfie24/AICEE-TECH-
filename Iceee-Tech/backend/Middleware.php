<?php

class Middleware {
    public static function requireAuth() {
        $headers = getallheaders();
        $token = null;

        if (isset($headers['Authorization'])) {
            $parts = explode(' ', $headers['Authorization']);
            if (count($parts) === 2 && $parts[0] === 'Bearer') {
                $token = $parts[1];
            }
        }

        if (!$token) {
            http_response_code(401);
            exit(json_encode(['error' => 'Unauthorized: No token provided']));
        }

        try {
            $payload = JWT::decode($token);
            return $payload;
        } catch (Exception $e) {
            http_response_code(401);
            exit(json_encode(['error' => 'Unauthorized: ' . $e->getMessage()]));
        }
    }

    public static function requireRole($requiredRole) {
        $user = self::requireAuth();

        if ($user['role'] !== $requiredRole) {
            http_response_code(403);
            exit(json_encode(['error' => 'Forbidden: Insufficient permissions']));
        }

        return $user;
    }

    public static function requireApproved() {
        $user = self::requireAuth();

        if ($user['role'] === 'student' && !$user['approved']) {
            http_response_code(403);
            exit(json_encode(['error' => 'Account not approved yet']));
        }

        return $user;
    }

    public static function logAudit($userId, $action, $entityType, $entityId = null, $oldValues = null, $newValues = null) {
        $db = Database::getInstance();
        
        $db->prepare("INSERT INTO audit_logs (user_id, action, entity_type, entity_id, old_values, new_values, ip_address) VALUES (?, ?, ?, ?, ?, ?, ?)")
            ->bind(1, $userId, MYSQLI_TYPE_LONG)
            ->bind(2, $action, MYSQLI_TYPE_STRING)
            ->bind(3, $entityType, MYSQLI_TYPE_STRING)
            ->bind(4, $entityId, MYSQLI_TYPE_LONG)
            ->bind(5, $oldValues ? json_encode($oldValues) : null, MYSQLI_TYPE_STRING)
            ->bind(6, $newValues ? json_encode($newValues) : null, MYSQLI_TYPE_STRING)
            ->bind(7, $_SERVER['REMOTE_ADDR'], MYSQLI_TYPE_STRING)
            ->execute();
        
        $db->close();
    }
}
