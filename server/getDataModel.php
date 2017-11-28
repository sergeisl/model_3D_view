<?php
include('db.php');
$data = $dbcon->prepare('SELECT * FROM `texturs` RIGHT JOIN `scens` ON `texturs`.id_scena = `scens`.id  WHERE `scens`.id = :id');
$data->execute(array('id' => $_GET['id']));
$result = $data->fetchAll();

if (count($result)) {

echo json_encode($result);

} else {
    echo "Нет записей для вывода";
}
?>