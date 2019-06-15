<?php
	include 'connect.php';
	$type = isset($_GET["type"])? $_GET["type"] : "";
	$page = isset($_GET["currentPage"])? $_GET["currentPage"] : "";
	$qty = isset($_GET["qty"])? $_GET["qty"] : "";
	$xu = isset($_GET["xu"])? $_GET["xu"] : "";
	if($xu == "asc"){
		$res = $conn->query("SELECT * FROM goodslist where type = '".$type."' order by price asc");
	}
	if($xu == "desc"){
		$res = $conn->query("SELECT * FROM goodslist where type = '".$type."' order by price desc");
	}
	if($xu == "ran"){
		$res = $conn->query("SELECT * FROM goodslist where type = '".$type."'");
	}
	$row = $res->fetch_all(MYSQLI_ASSOC);
	//裁切返回的数组，array_slice(数组，开始索引，长度)
	$resArr = array_slice($row, ($page-1)*$qty,$qty);
	//前端需要返回的值有：内容$row、内容长度、当前页、每页数量（前后的一致）
	$data = array(
		'resArr' => $resArr,
		'len' => count($row),
		'page' => $page * 1,//让字符串变成数字
		'qty' => $qty * 1
	 );
	echo json_encode($data,JSON_UNESCAPED_UNICODE);
	$res->close();
	$conn->close();

?>