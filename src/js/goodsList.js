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
    //从数据库拿取数据渲染列表页=====================================
    var type = decodeURI(location.search).slice(1, -1);
    var typeArr = type.split("=");
    var _type = typeArr[1]
    console.log(_type)
    $.get("../api/goodsList.php?type=" + _type + "&currentPage=1&qty=12&xu=ran", function(data) {
        var res = JSON.parse(data);
        //根据传回的总数量计算页码数---------------------------------------
        var pageNum = Math.ceil(res.len / res.qty)
        console.log(res)
        var goodslist = '';
        console.log(res)
        res.resArr.forEach(function(val, idx) {
            goodslist += `<li class="imgStyle" data-name="${val.id}">
                                <div class="img">
                                    <img src="${val.imgurl}" alt="#GoodsImage#"></div>
                                <div class="name">
                                    <span>${val.title}</span>
                                </div>
                                <div class="pri">
                                    <span>¥ ${val.price}.00</span></div>
                                <div class="mpri clearfix">
                                    <span>市场价 ¥<del>${val.mkprice}.00</del></span>
                                    <p class="com">
                                        <span>${val.id}</span>人评论
                                    </p>
                                </div>
                                <div class="buy">
                                    <span class="go">立即购买</span>
                                    <span class="cat">加入购物车</span>
                                </div>
                            </li>`
        })
        $("#main .hc_goods ul")[0].innerHTML = goodslist;
        //点击按价格排序----------------------------------------------------------------------
        $("#prio").on("click", function() {
            var page = res.page + ""
            $(this).toggleClass("desc asc");
            if ($(this).attr("class") == "desc") {
                console.log("价格升序")
                render(page, "desc");

            } else if ($(this).attr("class") == "asc") {
                console.log("价格降序");
                render(page, "asc");

            }
            addtoCart()
            $("#main .hc_goods ul")[0].innerHTML = 666;
        })

        function render(page, shunxu) {
            $.get("../api/goodsList.php?type=" + _type + "&currentPage=" + page + "&qty=12&xu=" + shunxu, function(data) {
                var res = JSON.parse(data);
                var newList = ''
                console.log(res)
                res.resArr.forEach(function(val, idx) {
                    newList += `<li class="imgStyle" data-name="${val.id}">
                                <div class="img">
                                    <img src="${val.imgurl}" alt="#GoodsImage#"></div>
                                <div class="name">
                                    <span>${val.title}</span>
                                </div>
                                <div class="pri">
                                    <span>¥ ${val.price}.00</span></div>
                                <div class="mpri clearfix">
                                    <span>市场价 ¥<del>${val.mkprice}.00</del></span>
                                    <p class="com">
                                        <span>${val.id}</span>人评论
                                    </p>
                                </div>
                                <div class="buy">
                                    <span class="go">立即购买</span>
                                    <span class="cat">加入购物车</span>
                                </div>
                            </li>`
                })
                console.log(newList)
                $("#main .hc_goods ul")[0].innerHTML = newList;
                //点击跳转到详情页---------------------------------------
                $("#main .hc_goods ul li .name").on("click", function() {
                    var toId = $(this).parent()[0].dataset.name;
                    location.href = encodeURI("detail.html?goodsId=" + toId + "&");
                })
                $("#main .hc_goods ul .img").on("click", function() {
                    var toId = $(this).parent()[0].dataset.name;
                    location.href = encodeURI("detail.html?goodsId=" + toId + "&");
                })
                //点击立即购买跳转到购物车---------------------------------------
                $("#main .hc_goods ul li .go").on("click", function() {
                    if (user.children[0].innerText == "免费注册") {
                        alert("您还没有登录，请先登录")
                    } else {
                        var wanId = $(this).closest("li")[0].dataset.name
                        location.href = encodeURI("cart.html?goodsId=" + wanId + "&");
                    }
                })
                addtoCart()
            })
        }
        //渲染页码----------------------------------------------------------------------------
        var page = `<ul><li><span class="on">${res.page}</span></li>`;
        for (var i = 0; i < pageNum - 1; i++) {
            page += ` <li><span>${(i+2)}</span></li>`
        }
        page += ` </ul>
                    <div>
                        第<span>${res.page}</span>页， 共<span>${pageNum}</span>页 [共<span>${res.len}</span>件商品]
                    </div>`
        $("#main .hc_page")[0].innerHTML = page;
        //渲染顶部页码-------------------------------------------------
        var topPage = `共<span>${res.len}</span>件商品
                        <i>&lt;</i>
                        <span>${res.page}/${pageNum}</span>
                        <i>&gt;</i>`
        $("#main .hc_sort .page")[0].innerHTML = topPage;
        //点击page切换页码------------------------------------------------------
        var topPage = $("#main .hc_page ul li");
        topPage.on("click", function() {
            topPage.find('span[class="on"]').removeClass("on");
            $(this).find("span").addClass("on");
            var _page = $(this).text()
            $.get("../api/goodsList.php?type=" + _type + "&currentPage=" + _page + "&qty=12&xu=ran", function(data) {
                var res = JSON.parse(data);
                console.log(res)
                var goodslist = '';
                res.resArr.forEach(function(val, idx) {
                    goodslist += `<li class="imgStyle" data-name="${val.id}">
                                <div class="img">
                                    <img src="${val.imgurl}" alt="#GoodsImage#"></div>
                                <div class="name">
                                    <span>${val.title}</span>
                                </div>
                                <div class="pri">
                                    <span>¥ ${val.price}.00</span></div>
                                <div class="mpri clearfix">
                                    <span>市场价 ¥<del>${val.mkprice}.00</del></span>
                                    <p class="com">
                                        <span>${val.id}</span>人评论
                                    </p>
                                </div>
                                <div class="buy">
                                    <span class="go">立即购买</span>
                                    <span class="cat">加入购物车</span>
                                </div>
                            </li>`
                })
                $("#main .hc_goods ul")[0].innerHTML = goodslist;
                //点击跳转到详情页---------------------------------------
                $("#main .hc_goods ul li .name").on("click", function() {
                    var toId = $(this).parent()[0].dataset.name;
                    location.href = encodeURI("detail.html?goodsId=" + toId + "&");
                })
                $("#main .hc_goods ul .img").on("click", function() {
                    var toId = $(this).parent()[0].dataset.name;
                    location.href = encodeURI("detail.html?goodsId=" + toId + "&");
                })
                //点击立即购买跳转到购物车---------------------------------------
                $("#main .hc_goods ul li .go").on("click", function() {
                    if (user.children[0].innerText == "免费注册") {
                        alert("您还没有登录，请先登录")
                    } else {
                        var wanId = $(this).closest("li")[0].dataset.name
                        location.href = encodeURI("cart.html?goodsId=" + wanId + "&");
                    }
                })
                addtoCart()
            })
            //渲染页码------------------------------------------
            $("#main .hc_page div")[0].children[0].innerHTML = _page;
        })
        //点击跳转到详情页---------------------------------------
        $("#main .hc_goods ul li .name").on("click", function() {
            var toId = $(this).parent()[0].dataset.name;
            location.href = encodeURI("detail.html?goodsId=" + toId + "&");
        })
        $("#main .hc_goods ul .img").on("click", function() {
            var toId = $(this).parent()[0].dataset.name;
            location.href = encodeURI("detail.html?goodsId=" + toId + "&");
        })
        //点击立即购买跳转到购物车---------------------------------------
        $("#main .hc_goods ul li .go").on("click", function() {
            if (user.children[0].innerText == "免费注册") {
                alert("您还没有登录，请先登录")
            } else {
                var wanId = $(this).closest("li")[0].dataset.name
                location.href = encodeURI("cart.html?goodsId=" + wanId + "&");
            }
        })
        //点击加入购物车==========================================================================
        function addtoCart() {
            $("#main .hc_goods ul li .cat").on("click", function() {
                $(".goods-cart a span span")[0].innerHTML = Number($(".goods-cart a span span").text())+1
                var toId = $(this).closest("li")[0].dataset.name;
                var title = $(this).closest("li")[0].children[1].children[0].innerText;
                var price1 = $(this).closest("li")[0].children[2].children[0].innerText;
                var mkprice1 = $(this).closest("li")[0].children[3].children[0].children[0].innerText;
                var price = price1.slice(1,-3)
                var mkprice = mkprice1.slice(0,-3)
                var url = $(this).closest("li")[0].children[0].children[0].src;//http://localhost:8080/img/xx01.png
                var url2 = url.slice(21,)
                var imgurl = "../"+url2//裁切要的路径
                console.log(url,imgurl)
                if (userName) {
                   $.get("../api/cart.php?uname=" + userName + "&goodsid="+toId + "&title="+title + "&price="+price + "&mkprice="+mkprice + "&imgurl="+imgurl, function(data){
                         var res = JSON.parse(data);
                         console.log(data);
                    })
                } else {
                    alert("您还没有登录，请先登录")
                }
            })
        }
        addtoCart()
        //渲染购物车数量============================
        function carNum(){
            $.get("../api/cart.php?uname="+userName,function(data){
                var res = JSON.parse(data);
                $(".goods-cart a span span")[0].innerHTML = res.length;
            })
        }
        carNum()
    })
    //点击切换为列表展示===============================================
    $("#main .hc_sort .style .list").on("click", function() {
        $("#main .hc_goods ul li").removeClass("imgStyle");
        $("#main .hc_goods ul li").addClass("listStyle");
    })
    $("#main .hc_sort .style .img").on("click", function() {
        $("#main .hc_goods ul li").removeClass("listStyle");
        $("#main .hc_goods ul li").addClass("imgStyle");
    })
    //点击切换展示方式------------------------------------------------------------
    $("#main .hc_sort .style span").on("click", function() {
        $("#main .hc_sort .style span").removeClass("on");
        $(this).addClass("on");
    })




})