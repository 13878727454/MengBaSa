<?php
	include 'connect.php';
	$uname = isset($_GET["uname"])? $_GET["uname"] : "";
	$res = $conn->query("SELECT * FROM cart where uname = '".$uname."'");
	$row = $res->fetch_all(MYSQLI_ASSOC);
	echo json_encode($row,JSON_UNESCAPED_UNICODE);
	$res->close();
	$conn->close();

?>