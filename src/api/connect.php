<?php
	$servername = "localhost";
    $username = "root";
    $password = "";
    //数据库的名称
    $dbname = 'mengbasha';

    // 创建连接
    $conn = new mysqli($servername, $username, $password, $dbname);
    //查询前设置编码，防止输出乱码
    mysqli_set_charset($conn,"utf8");
    // 检测连接
    if ($conn->connect_error) {
        die("连接失败: " . $conn->connect_error);
    } 
?>