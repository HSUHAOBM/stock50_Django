// 會員資訊
let login_member_email = "";
let login_member_name = "";
let login_member_id = "";
let login_member_img_src = "";
let login_member_level = false



let head_right_logout = document.querySelector('.head_right.logout');
let head_right_login = document.querySelector('.head_right.login');

//檢查登入狀況
function checklogstate() {
    // console.log("檢查登入狀況")
    fetch("/api/member", {
        method: 'GET'
    }).then(function(res) {
        return res.json();
    }).then(function(result) {
        if (result.data != null) {
            head_right_login.style.display = "flex";
            head_right_logout.style.display = "none";
            load_member_data();
        }
    })
}


//成功 登出
function logout() {
    // signOut()
    fetch("/api/User/logout/", {
        method: "GET"
    }).then(function(res) {
        return res.json();
    }).then(function(result) {
        if (result.ok) {
            location.href = '/'
            head_member_name.textContent = ""
            head_right_login.style.display = "none";
            head_right_logout.style.display = "flex";
        }
    })
}

// 目前登入的會員詳細資料讀取
function load_member_data() {
    fetch("/api/User/check/", {
        method: 'GET'
    }).then(function(res) {
        return res.json();
    }).then(function(result) {
        console.log(result)
        if (result.ok) {

            head_right_login.style.display = "flex";
            head_right_logout.style.display = "none";

            login_member_email = result.email;
            login_member_name = result.username;
            // login_member_id = result.data.login_id;
            login_member_img_src = result.avatar_url;

            document.querySelector('.member_name').textContent = "你好，" + login_member_name + "。"

            // 首頁
            if (document.querySelector('.strat_join_member')) {
                document.querySelector('.strat_join_member>a').href = "/forum"
            }
            // 首頁圖示連結
            if (document.querySelector('.head_welcomebox_right')) {
                document.querySelector('.head_welcomebox_right.btn7').addEventListener('click', function() {
                    location.href = '/member_forum?name=' + login_member_name
                });
            }
            // 套論區個資區
            if (document.querySelector('.main_right_memberdata')) {
                document.querySelector('.main_right_memberdata.name').textContent = login_member_name;
                document.querySelector('.main_right_memberdata.name').addEventListener('click', function() {
                    location.href = '/member_forum?name=' + login_member_name
                });
                document.querySelector('.main_right_memberdata_div>img').src = login_member_img_src;
                if (result.have_rank) {
                    document.querySelector('.main_right_memberdata.rate').textContent = "勝率：" + result.rank_total.rate + " %";
                    document.querySelector('.main_right_memberdata.success').textContent = "成功：" + result.rank_total.win + " 次";
                    document.querySelector('.main_right_memberdata.fail').textContent = "失敗：" + result.rank_total.fail + " 次";
                    document.querySelector('.main_right_memberdata.message').textContent = "預測：" + result.rank_total.total + " 次";
                    document.querySelector('.main_right_memberdata.like').textContent = "讚：" + result.like_total_number + " 個";

                }
                else {
                    document.querySelector('.main_right_memberdata.rate').textContent = "目前沒有預測的成績";
                    document.querySelector('.main_right_memberdata.success').textContent = "-資料於收盤後更新-";
                    document.querySelector('.main_right_memberdata.fail').style.display = "none"
                    document.querySelector('.main_right_memberdata.message').style.display = "none"
                    document.querySelector('.main_right_memberdata.like').style.display = "none"
                }
                document.querySelector('.main_right_memberdata_div').style.display = "flex";
                document.querySelector('.base_load_gif_forum_memberdata').style.display = "none";
            }

            if (result.level == 1) {
                login_member_level = true;
            }
        }else{
            // location.href = '/'
        }
    })
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function() {
        console.log('User signed out.');
    });
}

function onLoad() {
    gapi.load('auth2', function() {
        gapi.auth2.init({
            prompt: 'select_account'
        });
    });
    gapi.auth2.getAuthInstance().signIn(options).then(function(resp) {
            var auth_code = resp.code;
        },
        function(resp) {
            var auth_code = resp.code;
        });
}

load_member_data();