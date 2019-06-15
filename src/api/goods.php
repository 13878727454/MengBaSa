<?php
	include 'connect.php';
	$res = $conn->query("SELECT * FROM indexdata");
	$row = $res->fetch_all(MYSQLI_ASSOC);
	echo json_encode($row,JSON_UNESCAPED_UNICODE);
	$res->close();
	$conn->close();
	// $goodsType=isset($_GET["goodsType"])?$_GET["goodsType"]:null;
	// $page=isset($_GET["page"])?$_GET["page"]:null;

	// //商品分页
	// if($goodsType!=null && $page!=null){
	// 	switch($goodsType){
	// 		case "lianyiqun":
	// 			$goodsType='连衣裙';
	// 			break;
	// 		default:
	// 			echo "无该类型商品";
	// 			break;
	// 	}
	// 	$page2=$page*20-20;
	// 	$sql="SELECT * FROM goods where type='".$goodsType."' limit ".$page2.",20";
	// 	$res=$conn->query($sql);
	// 	$obj=$res->fetch_all(MYSQLI_ASSOC);
	// 	echo json_encode($obj,JSON_UNESCAPED_UNICODE);
	// 	$res->close();
	// 	$conn->close();
	// }

	// //同种类型的所有商品
	// if($goodsType!=null && $page==null){
	// 	switch($goodsType){
	// 		case "lianyiqun":
	// 			$goodsType='连衣裙';
	// 			break;
	// 		default:
	// 			echo "无该类型商品";
	// 			break;
	// 	}
	// 	$sql="SELECT * FROM indexdata where type='".$goodsType."'";
	// 	$res=$conn->query($sql);
	// 	if ($res) {
	// 		$obj=$res->fetch_all(MYSQLI_ASSOC);
	// 	    echo json_encode($obj,JSON_UNESCAPED_UNICODE);
	// 	} else {
	// 	    echo "Error: " . $sql . "<br>" . $conn->error;
	// 	};
	// 	$res->close();
	// 	$conn->close();
	// }
?>