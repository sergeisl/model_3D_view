<?php
include('db.php');

$data = $dbcon->prepare('SELECT * FROM scens');
$data->execute();

$result = $data->fetchAll();

if (count($result)) {
	echo json_encode($result);
} else {
  	echo "Нет записей для вывода";
}

?>


