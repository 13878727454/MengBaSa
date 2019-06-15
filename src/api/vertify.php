<?php
	include 'connect.php';
	$post1=isset($_POST["uname"])?$_POST["uname"]:null;
	$post2=isset($_POST["upsw"])?$_POST["upsw"]:null;
	$post3=isset($_POST["myname"])?$_POST["myname"]:null;
	$post4=isset($_POST["mypsw"])?$_POST["mypsw"]:null;
	$get=isset($_GET["uname"])?$_GET["uname"]:null;
	//注册验证
	if($get!=null){
		$sql="SELECT * FROM member where uname='".$get."'";
		$res=$conn->query($sql);
		if($res->num_rows>0){
			echo "exist";
		}else{
			echo "noexist";
		}
		$res->close();
		$conn->close();
	}else if($post1!=null && $post2!=null){
		$sql="INSERT INTO member (uname,upsw) VALUES ('".$post1."','".$post2."')";
		if ($conn->query($sql)) {
		    echo "注册成功";
		} else {
		    echo "Error: " . $sql . "<br>" . $conn->error;
		};
	};
	//登录验证
	if($post3!=null && $post4!=null){
		$sql="SELECT upsw FROM member where uname='".$post3."'";
		$res=$conn->query($sql);
		$str=$res->fetch_all(MYSQLI_ASSOC);
		$psw=$str[0]["upsw"];
		if($post4===$psw){
			echo "true";
		}else{
			echo "false";
		};
	};
?>