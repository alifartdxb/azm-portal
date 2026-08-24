<?php
require_once 'config.php';
$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $stmt = $pdo->prepare("SELECT * FROM brands ORDER BY name ASC");
        $stmt->execute();
        sendJson($stmt->fetchAll());
        break;
}
