jQuery(function($) {
    //登录与登出功能===========================================================
    //cookie里有用户时，直接登录------------------------------
    var cookie = document.cookie.split("; ");
    var user = $("#top .top_l").find("li").get(0);
    var signOut = $("#top .top_l").find("li").get(1);
    var userName;
    cookie.forEach(function(item) {
        var arr = item.split("=");
        if (arr[0] == "login") {
            console.log(arr[1])
            userName = arr[1]
            user.innerHTML = `<a href="#">${arr[1]}，欢迎登录和茶网</a>`;
            signOut.innerHTML = `<a href="#">[退出登录]</a>`
            //点击signout时清除cookit，登出-----------------------------------------------------------
            signOut.onclick = function() {
                Cookie.removeCookie('login', '/');
                user.innerHTML = `<a href="register.html?reg=on&amp;">免费注册</a>`;
                signOut.innerHTML = `<a href="register.html?log=on&amp;">登录</a>`;
                userName = '';
                $("#head .goods-cart span span")[0].innerHTML = 0;
            }
        } else {
            user.innerHTML = `<a href="register.html?reg=on&amp;">免费注册</a>`;
            signOut.innerHTML = `<a href="register.html?log=on&amp;">登录</a>`;
            userName = '';
        }
    })
    // 购买栏吸顶功能===============================================
    var txtBoxTop = $("#main .hc_detail").offset().top
    var endTop = $("#main .hc_detail .comment").offset().top - $("#main .hc_goodsinfo .txtbox").height()
    // console.log(endTop)
    $(document).on('scroll', function() {
        if ($(document).scrollTop() > txtBoxTop) {
            $("#main .txtbox").css({
                "width": "470px",
                "position": "fixed",
                "top": "30px",
                "left": "840px"
            })
            $("#main .txtbox .relPri").css({
                "width": "455px",
            })
            if ($(document).scrollTop() > endTop) {
                var currentTop = $(document).scrollTop()
                $("#main .txtbox").css({
                    "top": endTop - currentTop + "px",
                })
            }

        } else {

            $("#main .txtbox").css({
                "position": "static",
                "width": "657px"
            })
            $("#main .txtbox .relPri").css({
                "width": "642px",
            })
        }
    })
    //点击增加减少更改数据===================================================

    $("#main .info3 .add").on("click", function() {
        if (Number($("#main .info3 input")[0].value)) {
            $("#main .info3 input")[0].value = Math.floor($("#main .info3 input")[0].value) + 1
        } else {
            $("#main .info3 input")[0].value = 1;
        }
    })
    $("#main .info3 .min").on("click", function() {
        if (Number($("#main .info3 input")[0].value)) {
            $("#main .info3 input")[0].value = Math.floor($("#main .info3 input")[0].value) - 1;
            if (Math.floor($("#main .info3 input")[0].value) < 1) {
                $("#main .info3 input")[0].value = 1
            }
        } else {
            $("#main .info3 input")[0].value = 1;
        }
    })
    //根据toId从后端拿取数据渲染详情页==========================================
    var params = decodeURI(location.search).slice(1, -1);
    var paramsArr = params.split("=");
    if (paramsArr[0] == "goodsId") {
        var goodsId = paramsArr[1];
        $.get("../api/detail.php?goodsId=" + goodsId, function(data) {
            var res = JSON.parse(data)[0];
            console.log(res)
            $("#main .hc_path")[0].innerHTML = `<a href="../index.html">首页</a>
                                            <i>〉</i>
                                            <a href="goodsList.html?type=${res.type}&">${res.type}</a>
                                            <i>〉</i>
                                            <span>${res.title}</span>`
            $("#main .magnifyer .magnify-box").find("img").attr("src", "" + res.imgurl + "");
            var imgList = res.imgArr.split(",")
            $("#main .magnifyer .img-list ul")[0].innerHTML = `<li><img src='${imgList[0]}'></li>
                                                            <li><img src='${imgList[1]}'></li>
                                                            <li><img src='${imgList[2]}'></li>
                                                            <li><img src='${imgList[3]}'></li>
                                                            <li><img src='${imgList[4]}'></li>`
            //hover时还放大镜的图片------------------------------------------------
            var picList = document.querySelectorAll('.img-list li');
            console.log(picList)
            for (var i = 0; i < picList.length; i++) {
                (function(i) {
                    picList[i].onmouseenter = function() {
                        $("#main .magnifyer .magnify-box").find("img").attr("src", "" + imgList[i] + "");
                    }
                })(i)
            }
            //渲染文本信息------------------------------------------------------------
            $("#main .hc_goodsinfo .txtbox").find("h1").text("" + res.title + "");
            $("#main .hc_goodsinfo .ourPri")[0].innerHTML = `<p><b>¥${res.price}.00</b></p>
                                                            <p>
                                                                <span>和茶价 <del>¥${Number(res.price)+10}.99</del></span>&nbsp;&nbsp;
                                                                <span>市场价 <del>¥${res.mkprice}.00</del></span>
                                                            </p>`
            //点击立即购买跳转到购物车---------------------------------------
            $("#main .info4 .buyNow").on("click", function() {
                if (user.children[0].innerText == "免费注册") {
                    alert("您还没有登录，请先登录")
                } else {
                    var qty = $("#main .info3 input").val();
                    if (Number(qty)) {
                        location.href = encodeURI("cart.html?goodsId=" + res.id + "&qty=" + qty + "&");
                    } else {
                        location.href = encodeURI("cart.html?goodsId=" + res.id + "&qty=1&");
                    }
                }
            })
            //点击添加到购物车------------------------------------------------------------------------
            function addtoCart() {
                $(".addToCart").on("click", function() {
                    var toId = goodsId;
                    var title = res.title;
                    var price = res.price
                    var mkprice = res.mkprice
                    var imgurl = res.imgurl
                    if (userName) {
                        $.get("../api/cart.php?uname=" + userName + "&goodsid=" + toId + "&title=" + title + "&price=" + price + "&mkprice=" + mkprice + "&imgurl=" + imgurl, function(data) {
                            var res = JSON.parse(data);
                            console.log(data);
                        })
                    } else {
                        alert("您还没有登录，请先登录")
                    }
                    //动画--------------------------------------------
                    $(".goods-cart span span")[0].innerText = Number($(".goods-cart span span")[0].innerText) + 1
                    $copyImg = $(".min-img img").clone()
                    $copyImg.css({
                        position:'absolute',
                        display:'block',
                        left:$(".min-img img").offset().left,
                        top:$(".min-img img").offset().top,
                        width:$(".min-img img").outerWidth(),
                        height:$(".min-img img").outerHeight(),
                        // background:'#f00'
                    });
                    $("body").append($copyImg);
                    $copyImg.animate({
                        left:$(".probox ul").offset().left,
                        top:$(".probox ul").offset().top + $(".probox ul").height(),
                        width:30,
                        height:30,
                    },function(){
                        $copyImg.remove();
                        var $li = $("<li></li>")
                        $li[0].innerHTML = `<div><img src="${res.imgurl}"/></div>
                                            <p>${res.title}</p>
                                            <p><span>¥${res.price}.00</span></p>`
                        $(".probox ul").append($li)
                    })
                })
            }
            addtoCart()
        })
    }
            //渲染购物车数量============================
        function carNum(){
            $.get("../api/cart.php?uname="+userName,function(data){
                var res = JSON.parse(data);
                $(".goods-cart span span")[0].innerHTML = res.length;
            })
        }
        carNum()
    // 放大镜功能===========================================================
    // 获取元素 
    var magnify = document.querySelector('.magnify-box');
    var minBox = document.querySelector('.min-img');
    var minImg = document.querySelector('.min-img img');
    var mask = document.querySelector('.mask');
    var maxBox = document.querySelector('.max-img');
    var maxImg = document.querySelector('.max-img img');
    minBox.onmouseenter = function() {
        mask.style.display = 'block';
        maxBox.style.display = 'block';
    }
    minBox.onmousemove = function(ev) {
        var x = (ev.pageX - magnify.offsetLeft) - mask.offsetWidth / 2;
        var y = (ev.pageY - magnify.offsetTop) - mask.offsetHeight / 2;
        // 遮罩x方向运动的最大距离
        var maxX = minBox.offsetWidth - mask.offsetWidth;
        var maxY = minBox.offsetHeight - mask.offsetHeight;
        if (x > maxX) {
            x = maxX;
        };
        if (y > maxY) {
            y = maxY;
        }
        if (x <= 0) {
            x = 0;
        }
        if (y <= 0) {
            y = 0;
        }

        mask.style.left = x + 'px';
        mask.style.top = y + 'px';
        var biliX = (maxImg.offsetWidth - maxBox.offsetWidth) / maxX;
        var biliY = (maxImg.offsetHeight - maxBox.offsetHeight) / maxY;
        maxImg.style.left = -x * biliX + 'px';
        maxImg.style.top = -y * biliY + 'px';
    }

    minBox.onmouseleave = function() {
        mask.style.display = 'none';
        maxBox.style.display = 'none';
    }
    //选地址================================================================
    $("#main #dq li").on("click", function() {
        $("#main #showproname").find("span")[0].innerText = this.innerText;
    })












})