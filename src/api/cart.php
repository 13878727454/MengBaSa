<?php
	include 'connect.php';
	$uname = isset($_GET["uname"])? $_GET["uname"] : "";
	$goodsid = isset($_GET["goodsid"])? $_GET["goodsid"] : "";
	$title = isset($_GET["title"])? $_GET["title"] : "";
	$price = isset($_GET["price"])? $_GET["price"] : "";
	$mkprice = isset($_GET["mkprice"])? $_GET["mkprice"] : "";
	$imgurl = isset($_GET["imgurl"])? $_GET["imgurl"] : "";
	if($goodsid){
		$res = $conn->query("select * from cart WHERE uname='".$uname."' AND goodsid= '".$goodsid."'");
		$num = $res->num_rows;
		if($num == 0){
			$conn->query("insert into cart (uname,goodsid,qty,title,price,mkprice,imgurl) values ('".$uname."','".$goodsid."','1','".$title."','".$price."','".$mkprice."','".$imgurl."')");
			echo "666";
		}else{
			$qty = $conn->query("SELECT qty FROM cart WHERE uname='".$uname."' AND goodsid='".$goodsid."'");
			$bb = (int)(array_values(mysqli_fetch_array($qty))[0] + 1);
			$conn->query("UPDATE cart SET qty='".$bb."' WHERE uname='".$uname."' AND goodsid= '".$goodsid."'");
			echo "修改成功";
		}	
	}else{
		$res = $conn->query("SELECT * FROM cart where uname = '".$uname."'");
		$row = $res->fetch_all(MYSQLI_ASSOC);
		echo json_encode($row,JSON_UNESCAPED_UNICODE);
	}

	$res->close();
	$conn->close();

?>