    //轮播图功能======================================================================
    //1.获取元素----------------------------------------
    var banner = document.querySelector("#banner");
    var imgBox = banner.children[0];
    var idx = 0;
    var prev = document.querySelector(".btn-left");
    var next = document.querySelector(".btn-right");

    //1.1定义一个新元素扔到最后面------------------------------------
    var newLi = imgBox.children[0].cloneNode(true);
    imgBox.appendChild(newLi);
    var len = imgBox.children.length; //获取imgbox的长度（li的个数）
    var firstImg = imgBox.children[0].children[0].children[0]; //获取第一个照片用于确定宽度
    banner.style.width = firstImg.offsetWidth + 'px';
    banner.style.height = firstImg.offsetHeight + 'px';
    imgBox.style.width = firstImg.offsetWidth * len + 'px';
    //4.开启定时器------------------------------------
    var timer = setInterval(autoPlay, 2000);
    createDotted();
    //5.鼠标移入移出时的状态---------------------------------------
    banner.onmouseover = function() {
        clearInterval(timer);
    }
    banner.onmouseout = function() {
        timer = setInterval(autoPlay, 2000)
    }
    next.onclick = function() {
        autoPlay();
    }
    //7.点击左键，idx--,调用showPic()
    prev.onclick = function() {
        idx--;
        showPic();
    }
    //8.点击圆点跳到指定页面------------------------------------------
    page.onclick = function(e) {
        if (e.target.tagName == "SPAN") {
            idx = e.target.innerText - 1;
            showPic();
        }
        // console.log(this)
    }
    //3.自动播放banner-----------------------------------------
    function autoPlay() {
        idx++;
        showPic();
    }

    function showPic() {
        if (idx == len) {
            imgBox.style.left = 0;
            idx = 1;
        }
        if (idx == -1) {
            imgBox.style.left = -firstImg.offsetWidth * (len - 1) + 'px';
            idx = len - 2;
        }
        bufferAnimation(imgBox, { left: -firstImg.offsetWidth * idx }, 30);
        for (var i = 0; i < len - 1; i++) {
            page.children[i].classList.remove('active');
        }
        if (idx == len - 1) {
            page.children[0].classList.add('active');

        } else {
            page.children[idx].classList.add('active');
        }
    }
    //6.生成小圆点--------------------------------------
    function createDotted() {
        page = document.createElement('div');
        page.classList.add("page");
        for (var i = 1; i < len; i++) {
            var span = document.createElement("span");
            span.innerText = i;
            page.appendChild(span);
        }
        banner.appendChild(page);
        page.children[0].classList.add('active');
    }