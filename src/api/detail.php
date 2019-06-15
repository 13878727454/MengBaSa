<?php
	include 'connect.php';
	$id = isset($_GET["goodsId"])? $_GET["goodsId"] : "";
	$res = $conn->query("SELECT * FROM goodslist where id = '".$id."'");
	$row = $res->fetch_all(MYSQLI_ASSOC);
	echo json_encode($row,JSON_UNESCAPED_UNICODE);
	$res->close();
	$conn->close();

?>