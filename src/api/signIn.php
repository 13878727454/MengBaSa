<?php
	include 'connect.php';
	$uname = isset($_GET["uname"])? $_GET["uname"] : "";
	$upwd = isset($_GET["upwd"])? $_GET["upwd"] : "";
	$res = $conn->query("select * from userdata where uname='".$uname."'");
	$num = $res->num_rows;
	if($num == 0){
		echo false;
	}else{
		$res2 = $conn->query("select upwd from userdata where uname='".$uname."';");
		$row = $res2->fetch_all(MYSQLI_ASSOC);
		if($row[0]['upwd'] == $upwd){
			echo true;
		}else{
			echo false;
		};
	}
	$res->close();
	$conn->close();

?>