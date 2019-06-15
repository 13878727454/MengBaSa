jQuery(function($){
	if(Cookie.getCookie("login")){
		var uname=Cookie.getCookie("login").split(",")[0];
		$("#go_login").html("您好："+uname);
		$("#go_register").html("注销");
	}
	$("#go_register.pointer").on("click",function(){
		Cookie.removeCookie("login","/");
		$("#go_login").html("<a href='html/register.html'>登录</a> |");
		$("#go_register").html("<a href='html/register.html#register'>注册</a> |")
	})
    renderCart(uname);
})
//渲染头部购物车信息
function renderCart(uname){
    $.get("../api/addToCart.php",{uname:uname,forinit:"yes"},function(res){
        var arr=JSON.parse(res);
        render(arr);
        hoverCart();
        // console.log(arr);
    })
    function render(arr){
        var $cartBox=$("#shopCart>.below>ul");
        var str="";
        var totalPrice=0;
        //将后台返回的数据分成购物车商品数组、单品详情数组
        var cartArr=[];
        var goodsArr=[];
        for(var i=0;i<arr.length;i++){
            if(arr[i].uname){
                cartArr.push(arr[i]);
            }else{
                goodsArr.push(arr[i]);
            }
        }
        for(var j=0;j<cartArr.length;j++){
            var singleGoods="";
            for(var t=0;t<goodsArr.length;t++){
                if(goodsArr[t].id==cartArr[j].id){
                    singleGoods=goodsArr[t];
                }
            }
            totalPrice+=singleGoods.nowprice*cartArr[j].qty;
            str+=`<li class="clearfix">
                    <img src="${singleGoods.smallpic.split(",")[0]}">
                    <p><a href="html/detail.html?guid=${singleGoods.id}" target="_blank">${singleGoods.title}<br>${cartArr[j].color}+${cartArr[j].size}</a><br>
                    <span class="price">￥${singleGoods.nowprice}</span>x<span class="qty">${cartArr[j].qty}</span></p>
                </li>`
        }
        $("#shopCart>.below span.total_price").text("￥"+totalPrice);
        $cartBox.html(str);
    }
}
//头部购物车效果
function hoverCart(){
    $("#shopCart").on("mouseover",function(){
        $("#shopCart>.below").slideDown();
    })
    $("#shopCart>.below").on("mouseleave",function(){
        $(this).slideUp();
    })
    if($("#shopCart>.below>ul>li").length>4){
        $("#shopCart>.below>ul>li").css("display","none").slice(0,4).css("display","block").last().html("请去购物车查看更多数据").css("text-align","center");
    }
}