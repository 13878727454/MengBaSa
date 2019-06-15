jQuery(function($) {
    var shipping = $("#main .shipping")[0];
    var newAddress = shipping.children[2];
    var addressList = shipping.children[1];
    var chuang01 = $("#chuang01")[0];
    var chuang02 = $("#chuang02")[0];
    var cover = $("#cover")[0];
    var confirmAdd = chuang01.children[16];
    var close = $("#chuang01 #close")[0];
    var viewAll = shipping.children[0].children[1];
    var addAll = chuang02.children[0];
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
                location.href = encodeURI("../index.html");
            }
        } else {
            user.innerHTML = `<a href="register.html?reg=on&amp;">免费注册</a>`;
            signOut.innerHTML = `<a href="register.html?log=on&amp;">登录</a>`;
            userName = '';
        }
    })
    //进入页面渲染用户地址===============================================
    var addArr = [];
    var showArr = [];
    if (userName) {
        $.get("../api/payment.php?uname=" + userName, function(data) {
            var res = JSON.parse(data);
            var newArr = {}
                newArr.remarks = res[0].remarks,
                newArr.uname = res[0].uname,
                newArr.address = res[0].address,
                newArr.postCode = res[0].postcode
                newArr.telsNum = res[0].phone,

            addArr.unshift(newArr);
            showArr = addArr.slice(0, 3);
            console.log(addArr,showArr)
            render(showArr, addressList);
        })
    }
    //点击按钮添加地址信息========================================
    newAddress.onclick = function() {
        chuang01.style.display = "block";
        cover.style.display = "block";
        chuang01.style.left = (window.innerWidth - chuang01.offsetWidth) / 2 + "px";
        chuang01.style.top = 100 + "px";

    }
    //确认添加渲染页面----------------------------
    confirmAdd.onclick = function() {
        console.log(666)
        var newArr = {}
        newArr.remarks = chuang01.children[2].value;
        newArr.uname = chuang01.children[5].value;
        newArr.address = chuang01.children[8].value;
        newArr.postCode = chuang01.children[11].value;
        newArr.telsNum = chuang01.children[14].value;
        addArr.unshift(newArr);
        showArr = addArr.slice(0, 3);
        render(showArr, addressList);
        cover.style.display = "none";
        chuang01.style.display = "none";
        chuang01.children[2].value = "";
        chuang01.children[5].value = "";
        chuang01.children[8].value = "";
        chuang01.children[11].value = "";
        chuang01.children[14].value = "";
    }
    //点击关闭添加页面------------------------------------
    close.onclick = function() {
        cover.style.display = "none";
        chuang01.style.display = "none";
    }
    //渲染地址信息（公用）==================================================
    render(showArr, addressList);

    function render(arr, ulList) {
        var li = "";
        for (var i = 0; i < arr.length; i++) {
            li += `<li>
                <p><b class="pf15"> ${arr[i].remarks}</b></p>
                <p><span class="pf15"> ${arr[i].uname} </span></p>
                <p><span class="pf15"> ${arr[i].address} </span></p>
                <p><span class="pf15"> ${arr[i].postCode} </span></p>
                <p><span class="c2b2 pf15"> ${arr[i].telsNum} </span></p>
                <input type="radio" name="address"></input>
            </li>`
        }
        ulList.innerHTML = li;
    }
    //点击view all查看所有地址================================================
    viewAll.onclick = function() {
        chuang02.style.display = "block";
        cover.style.display = "block";
        chuang02.style.left = (window.innerWidth - chuang02.offsetWidth) / 2 + "px";
        chuang02.style.top = 100 + "px";
        render(addArr, addAll);
    }
    close2.onclick = function() {
        cover.style.display = "none";
        chuang02.style.display = "none";
    }
    //点击确认支付=============================================
    $("#confirmPay").on("click",function(){
        alert("购买成功")
         location.href = encodeURI("../index.html");
    })
})