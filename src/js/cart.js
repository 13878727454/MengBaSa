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
                $(".car_table tbody")[0].innerHTML = "";
                $("tfoot .total")[0].innerHTML = 0
                userName = '';
            }
        } else {
            userName = '';
            user.innerHTML = `<a href="register.html?reg=on&amp;">免费注册</a>`;
            signOut.innerHTML = `<a href="register.html?log=on&amp;">登录</a>`;
        }
    })
    //渲染购物车页面====================================================================================================
    $.get("../api/cart.php?uname="+userName,function(data){
        var res = JSON.parse(data);
        console.log(data);
        var cartlist = '';
        var total = 0
        res.forEach(function(val,idx){
            cartlist +=`<tr>
                            <td>
                                <div>
                                    <img src="${val.imgurl}">
                                </div>
                                <a href="detail.html?goodsId=${val.goodsid}&">${val.title}</a>
                                <p>商品编号:<span>${val.goodsid}</span></p>
                            </td>
                            <td>
                                <div class="btn clearfix">
                                    <input type="button" value="-" class="minus">
                                    <input type="text" value="${val.qty}" class="txt">
                                    <input type="button" value="+" class="plus">
                                </div>
                            </td>
                            <td>
                                <del>${val.mkprice}.00</del>
                                <p>${val.price}.00</p>
                            </td>
                            <td>
                                <p>${val.price * val.qty}.00</p>
                            </td>
                            <td>
                                <i class="del"></i>
                            </td>
                        </tr>`;
            total += val.price * val.qty
        })
        $(".car_table tbody")[0].innerHTML = cartlist;
        $("tfoot .total")[0].innerHTML = "¥" + total + ".00"
        //点击加减号修改商品参数---------------------------------------
        $("tbody tr .del").on("click",function(){
            $(this).closest("tr").remove()
        })
        var cltotal = $("tfoot .total")[0];
        $("tbody .plus").on("click",function(){
        	$(this).closest("div")[0].children[1].value = Number($(this).closest("div")[0].children[1].value) + 1
        })
        $("tbody .minus").on("click",function(){
        	if(Number($(this).closest("div")[0].children[1].value)){
        	$(this).closest("div")[0].children[1].value = Number($(this).closest("div")[0].children[1].value) -1
        	}
        })
        
    })
    


})