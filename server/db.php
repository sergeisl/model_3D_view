<?php
$dbUsername = 'root';
$dbPassword = '';
try {
    //соединение с БД
    $dbcon = new PDO('mysql:host=127.0.0.1;dbname=scena', $dbUsername, $dbPassword); 
} catch(PDOException $e) {
    echo 'Ошибка: ' . $e->getMessage();
}
?>