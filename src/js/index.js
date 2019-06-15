jQuery(function($){
	var $titles=$("#main .fourtab .title li");
	var $area=$("#main .fourtab .area");
	$titles.on("mouseover",function(){
		$titles.removeClass("active");
		$(this).addClass("active");
		var index=$titles.index($(this));
		$area.css("display","none")
		$area.eq(index).css("display","block");
	})
	var swipBox=$("#banner>.swip");
	var swipUl=$("#banner>.swip>ul");
	var imgArr=$("#banner>.swip>ul>li");
	var dots=$("#banner>.swip>.doted>span");
	var len=dots.length;
	var currentImg=0;
	
	//默认开启轮播
	swipBox.timer=setInterval(function(){
		animation();
	},2000)
	//鼠标移入暂停轮播
	swipBox.on("mouseover",function(){
		clearInterval(swipBox.timer);
	})
	//鼠标移除继续轮播
	swipBox.on("mouseout",function(){
		swipBox.timer=setInterval(function(){
			animation();
		},2000)
	})

	//
	dots.on("click",function(){
		var idx=$(this).index();
		currentImg=idx-1;
		animation();
	})
	//轮播动画函数
	function animation(){
		currentImg++;
		dots.removeClass("active").eq(currentImg).addClass("active");
		if(currentImg==imgArr.length){
			currentImg=0;
		}
		for(var i=0;i<imgArr.length;i++){
			imgArr[i].style.opacity=0;
			imgArr[currentImg].style.zIndex=0;
		}
		imgArr[currentImg].style.opacity=1;
		imgArr[currentImg].style.zIndex=9;
	}

	//渲染首页商品
	$.get("../api/goods.php",function(data){
		var res =JSON.parse(data);
		// console.log(arr);
		render(res);
	})
	function render(arr){
		var goodsBox=$("#main>.youxuan>.items")[0];
		goodsBox.innerHTML="";
		var str="";
		arr.forEach(function(item,idx){
			str+=`<li>
			<a href="html/detail.html?goodsId=${item.id}&" target="_blank">
				<img src="${item.img}">
				<h6>NEW</h6>
				<p class="p1">${item.title}</p>
				<p class="p2">￥<span>${item.price}.00</span></p>
			</a>
		</li>`
		})
		goodsBox.innerHTML=str;
	}
})










