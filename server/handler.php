<?php
include('db.php');
if (isset($_FILES['myfile'])) {
    $newname = 'myfile' . date('YmdHis', time()) . mt_rand() . '.jpg';
    $uploadfile = '../uploads/' . $newname;
    if (move_uploaded_file($_FILES['myfile']['tmp_name'], $uploadfile)) {
        $diff_map = $newname;
    }
    try {
        $dbcon->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        $stmt = $dbcon->prepare("INSERT INTO scens (name_csen,url, count_obj) VALUES (:name_csen, :url, :count_obj)");
        $stmt->bindParam(':name_csen', $name_csen);
        $stmt->bindParam(':url', $url);
        $stmt->bindParam(':count_obj', $count_obj);
        $name = basename($_FILES['myfile']['name']);
        $name_csen = $_POST['name'];
        $url = $uploadfile;
        $count_obj = 12;
        $stmt->execute();
    } catch (PDOException $e) {
        echo 'Ошибка: ' . $e->getMessage();
    }
    $stmt = $dbcon->query('SELECT * from scens ORDER BY `id` DESC LIMIT 1');
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    if (count($result)) {
        echo json_encode($result['id']);
    } else {
        echo "Нет записей для вывода";
    }
}
exit;
?>