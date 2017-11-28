<?php
include('db.php');
if(isset($_FILES['diff_map'])){
	
	$newname = 'diff_map'.date('YmdHis',time()).mt_rand().'.jpg';

	if ( move_uploaded_file($_FILES['diff_map']['tmp_name'],'../uploads/'.$newname) ) {
			$diff_map = $newname;
	}
}
if(isset($_FILES['bump_map'])){
	
	$newname = 'bump_map'.date('YmdHis',time()).mt_rand().'.jpg';

	if ( move_uploaded_file($_FILES['bump_map']['tmp_name'],'../uploads/'.$newname) ) {
			$bump_map = $newname;
	}
}
if(isset($diff_map) || isset($bump_map)){
	try {
		$dbcon->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);		
		$stmt = $dbcon->prepare("INSERT INTO texturs (id_scena, diff_map, bump_map, name) VALUES (:id_scena, :diff_map, :bump_map, :name)");
		$stmt->bindParam(':id_scena', $id_scena);
		$stmt->bindParam(':diff_map', $diff_map);	
		$stmt->bindParam(':bump_map', $bump_map);
		$stmt->bindParam(':name', $name);
		$id_scena = $_POST['id_scena'];
		$name = $_POST['name'];
		$stmt->execute();    
	} catch(PDOException $e) {
	    echo 'Ошибка: ' . $e->getMessage();
	}
	echo json_encode($id_scena);
	
} else {
  echo json_encode('err');
  exit;
}
?>

