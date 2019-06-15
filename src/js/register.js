jQuery(function($){
	//如果其他页面跳转过来需要注册,则初始化页面显示注册
	if(location.hash=="#register"){
		$("#main .user_info_r").children().css("display","none").first().css("display","block");
	}
	//获取注册页面相关元素
	var $uname=$("#phone-email");
	var $upsw1=$("#psw-input");
	var $upsw2=$("#psw-again-input");
	var $sub=$("#btn-register");
	var $agree=$("#agreement .agreebox");

	//获取普通登录页面相关元素
	var $myname=$("#myname-input");
	var $mypsw=$("#mypsw-input");
	var $loginBtn=$("#btn-login");
	var $vertifyCode=$("#myverify-input");

	//登录页面跳注册页面元素
	var $goRegister=$("#main .user_info_r .go-register");

	//注册 - 验证账号(手机号码或邮箱)
	$uname.on("blur",function(){
		var _uname=$uname.val();
		if(/^[\w]+@[\w]{1,63}\.com$/.test(_uname) || /^1[3-9]\d{9}$/.test(_uname)){
			$.get("../api/vertify.php",{uname: _uname},function(res){
		        if(res=="noexist"){
					$uname.next().css("display","none");
					$uname.flag=true;
				}else if(res=="exist"){
					$uname.next().text("该用户名已被占用");
					$uname.next().css("display","block");
					$uname.flag=false;
				}
		    });
		}else if(_uname==""){
			$(this).next().text("请输入邮箱或手机号!");
			$(this).next().css("display","block");
			$uname.flag=false;
		}else{
			$uname.flag=false;
			$(this).next().text("您输入的手机号码或邮箱不符合规范!");
			$(this).next().css("display","block");
		}
	})

	//注册 - 验证密码合法性
	$upsw1.on("blur",function(){
		var _psw1=$upsw1.val();
		if(/^\w{8,20}$/i.test(_psw1)){
			$(this).next().css("display","none");
			$upsw1.flag=true;
		}else{
			$upsw1.flag=false;
			$(this).next().css("display","block");
		}
	})

	//注册 - 验证密码是否一致
	$upsw2.on("blur",function(){
		var _psw2=$upsw2.val();
		if(_psw2==$upsw1.val()){
			$(this).next().css("display","none");
		}else if(_psw2==""){
			$(this).next().text("请再次输入密码!")
			$(this).next().css("display","block");
		}else if(_psw2!="" && _psw2!=$upsw1.val()){
			$(this).next().text("两次密码不一致!")
			$(this).next().css("display","block");
		}
	})

	//注册 - 提交验证
	$sub.on("click",function(){
		$agree.prop("checked","true");
		if($uname.flag && $upsw1.flag){
			if($upsw2.val()==$upsw1.val()){
				$upsw2.next().css("display","none");
				$.post("../api/vertify.php",{uname:$uname.val(),upsw:$upsw1.val()},function(res){
					alert(res);
					$("#main .user_info_r").children().css("display","none").eq(1).css("display","block");
					$myname.val($uname.val());
					$mypsw.val($upsw1.val());
					window.scrollTo(0,0);
				})
			}else{
				$upsw2.next().text("两次密码不一致!")
				$upsw2.next().css("display","block");
			}
		}else{
			window.scrollTo(0,0);
		}
	})

	//登录 - 失去焦点时验证账号与密码的合法性,减少请求次数
	$myname.on("blur",function(){
		var _uname=$myname.val();
		chkNameAndPsw(_uname);
	})
	$mypsw.on("blur",function(){
		var _psw=$mypsw.val();
		chkNameAndPsw("",_psw);
	})

	//生成验证码,验证
	var show_num = [];
    draw(show_num);
	$vertifyCode.on("blur",function(){
		var val = $vertifyCode.val().toLowerCase();
        var num = show_num.join("");
		if(val==''){
            $("#main .myverify-explain").css("display","block");
        }else if(val == num){
        	$("#main .myverify-explain").css("display","none");
            $vertifyCode.flag=true;
        }else{
        	$("#main .myverify-explain").text("验证码错误,请重新输入！");
        	$("#main .myverify-explain").css("display","block");
            $("#myverify-input").val('');
            draw(show_num);
            $("#myverify-input").focus();
        }
	})

	//点击换一张,重新生成验证码
	$("#main .change-one").on('click',function(){
        draw(show_num);
        $("#myverify-input").val('').focus();
    })

	//登录 - 点击登录验证
	$loginBtn.on("click",function(){
		var _uname=$myname.val();
		var _psw=$mypsw.val();
		//发送登录请求前,判断账号密码的合法性,减少请求次数
		chkNameAndPsw(_uname,_psw);
		//账号、密码合法,再发送登录请求验证
		if($myname.flag && $mypsw.flag && $vertifyCode.flag){
			$.post("../api/vertify.php",{myname:_uname,mypsw:_psw},function(res){
				if(res){
					$myname.val("");
					// $mypsw.val("");
					loginIn(_uname);
				}
			})
		}
	})

	//登录函数,写入cookie,并保存用户名7天
	function loginIn(email,psw){
		var str=`${email}`;
		Cookie.setCookie("login",str,"","/");
		var d = new Date();
        d.setDate(d.getDate()+7);
		// Cookie.setCookie("defaultlogin",email,d,"/");
		location.href="../index.html";
	}
	//验证登录账号与密码的合法性的函数
	function chkNameAndPsw(_uname,_psw){
		if(_uname){
			$myname.flag=/^[\w]+@[\w]{1,63}\.com$/.test(_uname) || /^1[3-9]\d{9}$/.test(_uname);
			if(!$myname.flag){
				$myname.next().text("邮箱或手机号不合法,请重新输入!");
				$myname.next().css("display","block");
			}else{
				$myname.next().css("display","none");
			}
		}
		if(_psw){
			$mypsw.flag=/^\w{8,20}$/i.test(_psw);
			if(!$mypsw.flag){
				$myname.next().text("密码错误,请重新输入!");
				$mypsw.next().css("display","block");
			}else{
				$mypsw.next().css("display","none");
			}
		}
	}

	//登录页面点击注册,跳转到注册页面
	$goRegister.on("click",function(){
		$("#main .user_info_r").children().css("display","none").first().css("display","block");
	})

	

    //生成并渲染出验证码图形
    function draw(show_num) {
        var canvas_width=$('#myverify-img').width();
        var canvas_height=$('#myverify-img').height();
        var canvas = document.getElementById("myverify-img");
        //获取到canvas的对象，演员
        var context = canvas.getContext("2d");//获取到canvas画图的环境，演员表演的舞台
        canvas.width = canvas_width;
        canvas.height = canvas_height;
        var sCode = "a,b,c,d,e,f,g,h,i,j,k,m,n,p,q,r,s,t,u,v,w,x,y,z,A,B,C,E,F,G,H,J,K,L,M,N,P,Q,R,S,T,W,X,Y,Z,1,2,3,4,5,6,7,8,9,0";
        var aCode = sCode.split(",");
        var aLength = aCode.length;//获取到数组的长度
        
        for (var i = 0; i < 4; i++) {  //这里的for循环可以控制验证码位数（如果想显示6位数，4改成6即可）
            var j = Math.floor(Math.random() * aLength);//获取到随机的索引值
            // var deg = Math.random() * 30 * Math.PI / 180;//产生0~30之间的随机弧度
            var deg = Math.random() - 0.5; //产生一个随机弧度
            var txt = aCode[j];//得到随机的一个内容
            show_num[i] = txt.toLowerCase();
            var x = 10 + i * 20;//文字在canvas上的x坐标
            var y = 20 + Math.random() * 8;//文字在canvas上的y坐标
            context.font = "bold 23px 微软雅黑";

            context.translate(x, y);
            context.rotate(deg);

            context.fillStyle = randomColor();
            context.fillText(txt, 0, 0);

            context.rotate(-deg);
            context.translate(-x, -y);
        }
        for (var i = 0; i <= 5; i++) { //验证码上显示线条
            context.strokeStyle = randomColor();
            context.beginPath();
            context.moveTo(Math.random() * canvas_width, Math.random() * canvas_height);
            context.lineTo(Math.random() * canvas_width, Math.random() * canvas_height);
            context.stroke();
        }
        for (var i = 0; i <= 30; i++) { //验证码上显示小点
            context.strokeStyle = randomColor();
            context.beginPath();
            var x = Math.random() * canvas_width;
            var y = Math.random() * canvas_height;
            context.moveTo(x, y);
            context.lineTo(x + 1, y + 1);
            context.stroke();
        }
    }

    //得到随机的颜色值
    function randomColor() {
        var r = Math.floor(Math.random() * 256);
        var g = Math.floor(Math.random() * 256);
        var b = Math.floor(Math.random() * 256);
        return "rgb(" + r + "," + g + "," + b + ")";
    }












})