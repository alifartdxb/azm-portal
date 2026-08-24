<?php
require_once 'config.php';

$pdo = getDB();
$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        if (isset($_GET['id']) || isset($_GET['slug'])) {
            $sql = isset($_GET['id']) ? "SELECT * FROM products WHERE id = :val" : "SELECT * FROM products WHERE slug = :val";
            $stmt = $pdo->prepare($sql);
            $stmt->execute(['val' => $_GET['id'] ?? $_GET['slug']]);
            $product = $stmt->fetch();
            if ($product) {
                // Fetch images
                $imgStmt = $pdo->prepare("SELECT * FROM product_images WHERE product_id = ? ORDER BY sort_order ASC");
                $imgStmt->execute([$product['id']]);
                $product['images'] = $imgStmt->fetchAll();
                sendJson($product);
            } else {
                sendJson(['error' => 'Product not found'], 404);
            }
        } else {
            // List products
            $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
            $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 24;
            $offset = ($page - 1) * $limit;
            
            $where = [];
            $params = [];
            
            if (isset($_GET['category'])) {
                $where[] = "category_id = :category";
                $params['category'] = $_GET['category'];
            }
            if (isset($_GET['brand'])) {
                $where[] = "brand_id = :brand";
                $params['brand'] = $_GET['brand'];
            }
            if (isset($_GET['search'])) {
                $where[] = "(name LIKE :search OR sku LIKE :search)";
                $params['search'] = '%' . $_GET['search'] . '%';
            }
            
            $whereClause = count($where) > 0 ? "WHERE " . implode(" AND ", $where) : "";
            
            $stmt = $pdo->prepare("SELECT * FROM products $whereClause LIMIT :limit OFFSET :offset");
            foreach ($params as $key => $val) {
                $stmt->bindValue(":$key", $val);
            }
            $stmt->bindValue(":limit", $limit, PDO::PARAM_INT);
            $stmt->bindValue(":offset", $offset, PDO::PARAM_INT);
            $stmt->execute();
            
            $products = $stmt->fetchAll();
            
            // Get total count
            $countStmt = $pdo->prepare("SELECT COUNT(*) FROM products $whereClause");
            foreach ($params as $key => $val) {
                $countStmt->bindValue(":$key", $val);
            }
            $countStmt->execute();
            $total = $countStmt->fetchColumn();
            
            sendJson([
                'data' => $products,
                'pagination' => [
                    'total' => $total,
                    'page' => $page,
                    'limit' => $limit,
                    'pages' => ceil($total / $limit)
                ]
            ]);
        }
        break;
        
    case 'POST':
        requireAuth();
        $data = json_decode(file_get_contents('php://input'), true);
        
        $sql = "INSERT INTO products (sku, slug, name, brand_id, category_id, status) VALUES (:sku, :slug, :name, :brand_id, :category_id, :status)";
        $stmt = $pdo->prepare($sql);
        try {
            $stmt->execute([
                'sku' => $data['sku'] ?? 'SKU-'.time(),
                'slug' => $data['slug'] ?? strtolower(str_replace(' ', '-', $data['name'])),
                'name' => $data['name'],
                'brand_id' => $data['brand_id'] ?? null,
                'category_id' => $data['category_id'] ?? null,
                'status' => $data['status'] ?? 'Draft'
            ]);
            sendJson(['id' => $pdo->lastInsertId(), 'message' => 'Product created']);
        } catch (PDOException $e) {
            sendJson(['error' => $e->getMessage()], 400);
        }
        break;
        
    case 'PUT':
        requireAuth();
        if (!isset($_GET['id'])) sendJson(['error' => 'Missing ID'], 400);
        $data = json_decode(file_get_contents('php://input'), true);
        
        $fields = [];
        $params = ['id' => $_GET['id']];
        foreach ($data as $key => $value) {
            if ($key !== 'id' && $key !== 'images') {
                $fields[] = "$key = :$key";
                $params[$key] = $value;
            }
        }
        
        if (count($fields) > 0) {
            $sql = "UPDATE products SET " . implode(', ', $fields) . " WHERE id = :id";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
        }
        sendJson(['message' => 'Product updated']);
        break;
        
    case 'DELETE':
        requireAuth();
        if (!isset($_GET['id'])) sendJson(['error' => 'Missing ID'], 400);
        $stmt = $pdo->prepare("DELETE FROM products WHERE id = ?");
        $stmt->execute([$_GET['id']]);
        sendJson(['message' => 'Product deleted']);
        break;
}
