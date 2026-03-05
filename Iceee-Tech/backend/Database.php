<?php

class Database {
    private static $instance = null;
    private $connection;
    private $stmt;

    private function __construct() {
        try {
            $this->connection = new mysqli(
                DB_HOST,
                DB_USER,
                DB_PASS,
                DB_NAME,
                DB_PORT
            );

            if ($this->connection->connect_error) {
                throw new Exception('Database connection failed: ' . $this->connection->connect_error);
            }

            $this->connection->set_charset('utf8mb4');
        } catch (Exception $e) {
            die(json_encode(['error' => $e->getMessage()]));
        }
    }

    public static function getInstance() {
        if (self::$instance === null) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    public function prepare($query) {
        $this->stmt = $this->connection->prepare($query);
        if (!$this->stmt) {
            throw new Exception('Prepare failed: ' . $this->connection->error);
        }
        return $this;
    }

    public function bind($param, $value, $type = null) {
        if ($type === null) {
            switch (true) {
                case is_int($value):
                    $type = MYSQLI_TYPE_LONG;
                    break;
                case is_float($value):
                    $type = MYSQLI_TYPE_DOUBLE;
                    break;
                case is_bool($value):
                    $type = MYSQLI_TYPE_LONG;
                    $value = (int)$value;
                    break;
                default:
                    $type = MYSQLI_TYPE_STRING;
            }
        }

        $this->stmt->bind_param($type, $value);
        return $this;
    }

    public function execute() {
        return $this->stmt->execute();
    }

    public function getResult() {
        return $this->stmt->get_result();
    }

    public function fetch() {
        $result = $this->stmt->get_result();
        return $result ? $result->fetch_assoc() : null;
    }

    public function fetchAll() {
        $result = $this->stmt->get_result();
        $rows = [];
        if ($result) {
            while ($row = $result->fetch_assoc()) {
                $rows[] = $row;
            }
        }
        return $rows;
    }

    public function rowCount() {
        return $this->stmt->affected_rows;
    }

    public function lastId() {
        return $this->connection->insert_id;
    }

    public function close() {
        if ($this->stmt) {
            $this->stmt->close();
        }
    }
}
