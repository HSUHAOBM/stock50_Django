// 監聽捲動
let check_onload = true;
let forum_page = 0;


/*-----------------------------*/
// 所有留言產生畫面
function member_predict_add_message(predict_message_member_id, predict_stock, predict_trend, predict_message, predict_message_member_name, predict_message_member_img_src, time, time_about, message_mid, message_check_status, login_member_name_good_have, message_good_number, message_reply_number, message_reply_data) {
    let main_left_center = document.querySelector('.main_left_center')
    let div_predict_message_box = document.createElement("div");
    div_predict_message_box.className = "predict_message_box";

    // if (main_left_center.firstChild == null) {

    //     main_left_center.appendChild(div_predict_message_box)
    // } else {

    //     main_left_center.insertBefore(div_predict_message_box, main_left_center.childNodes[0]);
    //     //父.insertBefore(加入，被加入)
    // }

    // 預測檢測後的顯示
    main_left_center.appendChild(div_predict_message_box)
    let div_predict_message_box_result = document.createElement("div");
    div_predict_message_box_result.className = "predict_message_box_result";
    div_predict_message_box.appendChild(div_predict_message_box_result)

    let imgdiv_predict_message_box_result = document.createElement("img");
    if (message_check_status === null) {
        imgdiv_predict_message_box_result.src = ""
    }
    if (message_check_status == "1") {

        imgdiv_predict_message_box_result.src = "/static/img/index_success.png";
        imgdiv_predict_message_box_result.style.opacity = "0.55";
    }
    if (message_check_status == "0") {
        imgdiv_predict_message_box_result.src = "/static/img/index_fail.png";
        imgdiv_predict_message_box_result.style.opacity = "0.55";
    }
    div_predict_message_box_result.appendChild(imgdiv_predict_message_box_result)


    // 刪除討論

    let div_delete_predict_message = document.createElement("div");
    div_delete_predict_message.className = "administrator_delete_predict_message";
    div_delete_predict_message.setAttribute("alt", message_mid)
    div_delete_predict_message.setAttribute("member", predict_message_member_id);

    if (login_member_level) {
        div_delete_predict_message.style.display = "flex"
    }

    div_delete_predict_message.onclick = function () {
        let message_mid = this.getAttribute('alt');
        let member_user_id = this.getAttribute('member');

        administrator_delete_predict(message_mid, member_user_id)

    }
    div_predict_message_box.appendChild(div_delete_predict_message)

    let img_delete_predict_message = document.createElement("img");
    img_delete_predict_message.src = "/static/img/delete.png";
    div_delete_predict_message.appendChild(img_delete_predict_message)

    // 討論-會員大頭貼
    let div_predict_message_box_image = document.createElement("div");
    div_predict_message_box_image.className = "predict_message_box_image";
    div_predict_message_box.appendChild(div_predict_message_box_image)

    let img_div_div_content_img = document.createElement("img");
    img_div_div_content_img.src = predict_message_member_img_src
    div_predict_message_box_image.appendChild(img_div_div_content_img)

    // 討論-討倫文字區
    let div_predict_message = document.createElement("div");
    div_predict_message.className = "predict_message";
    div_predict_message_box.appendChild(div_predict_message)

    let div_message_box_loaddata = document.createElement("div");
    div_message_box_loaddata.className = "message_box_loaddata";
    div_predict_message.appendChild(div_message_box_loaddata)

    // 討論-討倫文字區 會員名
    let div_message_box_title = document.createElement("div");
    div_message_box_title.className = "message_box_title";
    div_message_box_loaddata.appendChild(div_message_box_title);

    let a_message_box_title_name = document.createElement("a");
    a_message_box_title_name.className = "message_box_title_name " + message_mid
    a_message_box_title_name.setAttribute("href", "/member_forum?name=" + predict_message_member_name)
    a_message_box_title_name.textContent = predict_message_member_name
    div_message_box_title.appendChild(a_message_box_title_name)

    // 討論-討倫文字區 股票狀態顯示
    let div_message_box_predict = document.createElement("div")
    div_message_box_predict.className = "message_box_predict"
    // div_message_box_predict.textContent = "預測：" + predict_stock + "的下次開盤走勢為" + predict_trend;
    div_message_box_loaddata.appendChild(div_message_box_predict);

    let a_message_box_predict_1 = document.createElement("a")
    a_message_box_predict_1.textContent = "覺得："
    div_message_box_predict.appendChild(a_message_box_predict_1);

    let a_message_box_predict_2 = document.createElement("a")
    a_message_box_predict_2.textContent = predict_stock
    a_message_box_predict_2.className = "message_box_predict_stock"
    let stock_id = predict_stock.split("－")
    a_message_box_predict_2.setAttribute("href", "/stock_info/" + stock_id[0])

    div_message_box_predict.appendChild(a_message_box_predict_2);

    let a_message_box_predict_3 = document.createElement("a")
    a_message_box_predict_3.textContent = "的下次開盤走勢為" + predict_trend;
    div_message_box_predict.appendChild(a_message_box_predict_3);


    // 討論-討倫文字區 文字訊息
    let div_message_box_text = document.createElement("div")
    div_message_box_text.className = "message_box_text"
    div_message_box_text.textContent = predict_message;
    div_message_box_loaddata.appendChild(div_message_box_text);

    // 討論-底
    let div_message_box_text_btn = document.createElement("div")
    div_message_box_text_btn.className = "message_box_text_btn"
    div_predict_message.appendChild(div_message_box_text_btn)

    // 討論-底-發表時間
    let div_message_box_date = document.createElement("div")
    div_message_box_date.className = "message_box_date"
    div_message_box_date.textContent = time_about
    div_message_box_date.setAttribute("title", time)
    div_message_box_text_btn.appendChild(div_message_box_date)

    // 討論-底-按鈕區
    let div_message_box_btn = document.createElement("div")
    div_message_box_btn.className = "message_box_btn"
    div_message_box_text_btn.appendChild(div_message_box_btn)

    // 討論-底-按鈕區-讚
    let div_message_box_btn_like = document.createElement("div")
    div_message_box_btn_like.className = "message_box_btn_like"
    div_message_box_btn_like.setAttribute("id", message_mid)
    div_message_box_btn_like.setAttribute("alt", message_mid)


    // 討論-底-按鈕區-回覆留言
    if (login_member_name_good_have) {
        div_message_box_btn_like.onclick = function () {
            let message_mid = this.getAttribute('alt');
            // let message_member = document.querySelector('.message_box_title_name.' + message_mid).textContent
            // console.log(message_member)
            predict_message_btn_enter_unlike(message_mid)

        }
        div_message_box_btn.appendChild(div_message_box_btn_like)

        let a_div_message_box_btn_like = document.createElement("a")
        a_div_message_box_btn_like.textContent = "讚 (" + message_good_number + ")"
        div_message_box_btn_like.appendChild(a_div_message_box_btn_like)

        let img_div_message_box_btn_like = document.createElement("img")
        img_div_message_box_btn_like.src = "/static/img/likeA.png"
        div_message_box_btn_like.appendChild(img_div_message_box_btn_like)
    } else {
        div_message_box_btn_like.onclick = function () {
            let message_mid = this.getAttribute('alt');
            let message_member = document.querySelector('.message_box_title_name.' + message_mid).textContent
            // console.log(message_member)
            predict_message_btn_enter_like(message_mid, message_member)
        }
        div_message_box_btn.appendChild(div_message_box_btn_like)

        let a_div_message_box_btn_like = document.createElement("a")
        a_div_message_box_btn_like.textContent = "讚 (" + message_good_number + ")"
        div_message_box_btn_like.appendChild(a_div_message_box_btn_like)

        let img_div_message_box_btn_like = document.createElement("img")
        img_div_message_box_btn_like.src = "/static/img/likeB.png"
        div_message_box_btn_like.appendChild(img_div_message_box_btn_like)
    }

    // 討論-底-按鈕區-回覆留言—回應顯示
    let div_message_box_btn_message = document.createElement("div")
    div_message_box_btn_message.className = "message_box_btn_message " + message_mid;
    div_message_box_btn_message.setAttribute("alt", message_mid)
    div_message_box_btn_message.onclick = function () {
        let message_mid = this.getAttribute('alt');
        // console.log(message_mid);
        message_box_other_message_load_diplay_flex(message_mid)
    }
    div_message_box_btn.appendChild(div_message_box_btn_message)

    let a_div_message_box_btn_message = document.createElement("a")
    a_div_message_box_btn_message.textContent = "回應 (" + message_reply_number + ")"
    a_div_message_box_btn_message.id = "a_div_message_box_btn_message_" + message_mid
    div_message_box_btn_message.appendChild(a_div_message_box_btn_message)

    let img_div_message_box_btn_message = document.createElement("img")
    img_div_message_box_btn_message.className = "img_div_message_box_btn_message " + message_mid
    img_div_message_box_btn_message.src = "/static/img/chat.png"
    div_message_box_btn_message.appendChild(img_div_message_box_btn_message)

    // 討論-底-按鈕區-回覆留言-回應
    let div_message_box_other_message = document.createElement("div")
    div_message_box_other_message.className = "message_box_other_message " + message_mid
    div_predict_message.appendChild(div_message_box_other_message)

    if (message_reply_data.length > 0) {
        // console.log(message_reply_data.message_predict_reply_load_data);
        for (let i = 0; i < message_reply_data.length; i++) {
            reply_data = message_reply_data[i]
            reply_user_id = reply_data.create_id.id
            reply_message_mid = "mid_" + reply_data.message
            reply_message_mid_sub = reply_message_mid + "_" + reply_data.id
            reply_user_img = reply_data.create_id.avatar_url
            reply_user_name = reply_data.create_id.username
            reply_message_text = reply_data.text
            reply_message_time = reply_data.create_date
            reply_message_time_about = timeAgo(reply_data.create_date)

            box_other_write_message_reply_add(
                reply_user_id,
                reply_message_mid,
                reply_message_mid_sub,
                reply_user_img,
                reply_user_name,
                reply_message_text,
                reply_message_time,
                reply_message_time_about)
        }
    }

    let div_message_box_other_message_write = document.createElement("div")
    div_message_box_other_message_write.className = "message_box_other_message_write"
    div_message_box_other_message.appendChild(div_message_box_other_message_write)

    // 討論-底-按鈕區-回覆留言-新的留言回覆
    let textarea_message_box_other_message_write = document.createElement("textarea")
    textarea_message_box_other_message_write.placeholder = "分享一下你的想法... "
    textarea_message_box_other_message_write.className = "textarea_message_box_other_message_write " + message_mid
    textarea_message_box_other_message_write.setAttribute("alt", message_mid)
    textarea_message_box_other_message_write.setAttribute("onKeyDown", "check_input_reply(this.value,this.getAttribute('alt'))")
    textarea_message_box_other_message_write.setAttribute("onKeyUp", "check_input_reply(this.value,this.getAttribute('alt'))")

    div_message_box_other_message_write.appendChild(textarea_message_box_other_message_write)


    let img_message_box_other_message_write = document.createElement("img")
    img_message_box_other_message_write.src = "/static/img/sent.png "
    img_message_box_other_message_write.setAttribute("alt", message_mid)

    img_message_box_other_message_write.onclick = function () {
        let message_mid = this.getAttribute('alt');
        box_other_write_message_reply(message_mid)
    }
    div_message_box_other_message_write.appendChild(img_message_box_other_message_write)

    let a_message_box_text_btn_error_text = document.createElement("a")
    a_message_box_text_btn_error_text.className = "message_box_text_btn_error_text " + message_mid
    a_message_box_text_btn_error_text.textContent = "."
    div_message_box_other_message.appendChild(a_message_box_text_btn_error_text)
}


/*-----------------------------*/
// 讀取全部的預測留言
function member_predict_load_message() {
    check_onload = false;

    if (forum_page == 0) {
        document.querySelector('.main_left_center').innerText = ""
    }

    let load_url = ""; // 根据页面类型设置不同的API URL

    if (window.location.pathname === '/forum') {
        load_url = `/api/forum/?page=${forum_page}`;
    } else if (window.location.pathname.startsWith('/stock_info/')) {
        const stock_id = window.location.pathname.split('/stock_info/')[1].split('/')[0];
        load_url = `/api/forum/?stock_id=${stock_id}&page=${forum_page}`;
    } else if (window.location.pathname === '/member_forum') {
        const user_name = getQueryParam('name');
        load_url = `/api/forum/?user_name=${user_name}&page=${forum_page}`;
    }

    fetch(load_url).then(function (response) {
        return response.json();
    }).then(function (result) {
        if (result.ok == false){
            if (forum_page == 0) {
                document.querySelector('.base_load_gif_forum').style.display = "none";
                document.querySelector('.data_not_have').style.display = "flex";

                return
            }
            document.querySelector('.base_load_gif_forum').style.display = "none";
            return
        }
        if (result.length != 0) {
            for (let i = 0; i < result.length; i++) {
                // stock
                predict_stock = result[i].stock.code + "－" + result[i].stock.name
                // 預測
                var predict_trend = {
                    "1": "漲",
                    "-1": "跌",
                    "0": "持平"
                }[result[i].stock_status] || "未知";

                // 發文者
                predict_message_member_id = result[i].create_id.id
                predict_message_member_name = result[i].create_id.username
                predict_message_member_img_src = result[i].create_id.avatar_url

                // 文字
                predict_message = result[i].text

                // 登入者有無讚, 讚數
                login_member_name_good_have = result[i].likes.length > 0 ? true : false;
                message_good_number = result[i].likes.length

                // 回覆數,留言資料
                message_reply_number = result[i].replies.length
                message_reply_data = result[i].replies

                // 發文時間
                time = result[i].create_date
                time_about = timeAgo(result[i].create_date)

                message_mid = "mid_" + result[i].id
                message_check_status = result[i].check_status

                member_predict_add_message(predict_message_member_id,
                    predict_stock, predict_trend, predict_message,
                    predict_message_member_name, predict_message_member_img_src,
                    time, time_about, message_mid, message_check_status,
                    login_member_name_good_have, message_good_number,
                    message_reply_number, message_reply_data)
            }
            document.querySelector('.base_load_gif_forum').style.display = "none";
            check_onload = true;
        }
    }
    )
}

// 處理 讀取留言 url 的要求字串
function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// 將時間轉換成XXX前
function timeAgo(timeAgo) {
    const now = new Date();
    const sentTime = new Date(timeAgo);

    const timeDifference = now - sentTime;
    const { days, hours, minutes } = daysHoursMinutes(timeDifference);

    if (days !== 0) {
        return days + " 天前";
    }
    if (hours !== 0) {
        return hours + " 小時前";
    }
    if (minutes !== 0) {
        return minutes + " 分鐘前";
    } else {
        return "剛剛";
    }
}

function daysHoursMinutes(ms) {
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    return { days, hours, minutes };
}

/*-----------------------------*/
// 新增讚
function predict_message_btn_enter_like(message_mid_like, message_member) {
    let csrftoken = Cookies.get('csrftoken');

    if (check_function_end) {
        check_function_end = false
        let message_mid_like_data = {
            "status": "like",
            "message_mid_like": message_mid_like,
            "message_member": message_member
        }

        fetch("/api/forum/like/", {
            method: 'POST',
            body: JSON.stringify(message_mid_like_data),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            }
        })
            .then(res => {
                return res.json();
            })
            .then(result => {
                if (result.ok) {
                    document.querySelector('#' + message_mid_like + ">img").src = "/static/img/likeA.png";

                    document.querySelector('#' + message_mid_like).onclick = function () {
                        predict_message_btn_enter_unlike(message_mid_like)
                    }
                    let good_int = parseInt(document.querySelector('#' + message_mid_like + ">a").textContent.split('讚 (')[1].split(')')[0]) + 1
                    let good_str = good_int.toString()
                    document.querySelector('#' + message_mid_like + ">a").textContent = '讚 (' + good_str + ')'
                    check_function_end = true
                }

            });
    }
}
// 解除讚
function predict_message_btn_enter_unlike(message_mid_like) {
    let csrftoken = Cookies.get('csrftoken');

    if (check_function_end) {
        check_function_end = false
        let message_mid_like_data = {
            "status": "unlike",
            "message_mid_like": message_mid_like
        }
        fetch("/api/forum/like/", {
            method: 'POST',
            body: JSON.stringify(message_mid_like_data),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            }
        })
            .then(res => {
                return res.json();
            })
            .then(result => {
                // console.log(result);
                if (result.ok) {

                    document.querySelector('#' + message_mid_like + ">img").src = "/static/img/likeB.png"

                    document.querySelector('#' + message_mid_like).onclick = function () {
                        let message_mid = this.getAttribute('alt');
                        let message_member = document.querySelector('.message_box_title_name.' + message_mid).textContent
                        // console.log(message_member)
                        predict_message_btn_enter_like(message_mid, message_member)

                    }
                    let good_int = parseInt(document.querySelector('#' + message_mid_like + ">a").textContent.split('讚 (')[1].split(')')[0]) - 1
                    let good_str = good_int.toString()
                    document.querySelector('#' + message_mid_like + ">a").textContent = '讚 (' + good_str + ')'
                    check_function_end = true

                }

            });
    }
}

// 回應區顯示&隱藏
function message_box_other_message_load_diplay_flex(message_mid) {
    document.querySelector('.message_box_other_message.' + message_mid).style.display = "flex";

    document.querySelector('.message_box_btn_message.' + message_mid).onclick = function () {
        message_box_other_message_load_diplay_none(message_mid)
    }
    document.querySelector('.img_div_message_box_btn_message.' + message_mid).src = "/static/img/chat_.png"
}

function message_box_other_message_load_diplay_none(message_mid) {
    document.querySelector('.message_box_other_message.' + message_mid).style.display = "none";
    document.querySelector('.message_box_btn_message.' + message_mid).onclick = function () {
        message_box_other_message_load_diplay_flex(message_mid)
    }
    document.querySelector('.img_div_message_box_btn_message.' + message_mid).src = "/static/img/chat.png"
}

// 傳送留言的回覆
function box_other_write_message_reply(message_mid) {
    let csrftoken = Cookies.get('csrftoken');

    if (check_function_end) {
        check_function_end = false

        let message_reply_text = document.querySelector('.textarea_message_box_other_message_write.' + message_mid).value;
        let box_other_write_message_reply_data = {
            "message_mid": message_mid,
            "message_reply_text": message_reply_text
        }

        if (message_reply_text.length <= 50 && message_reply_text.length != 0) {

            fetch("/api/forum_reply/", {
                method: 'POST',
                body: JSON.stringify(box_other_write_message_reply_data),
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrftoken,
                }
            })
                .then(res => {
                    return res.json();
                })
                .then(result => {

                    if (result.ok) {

                        const formattedDateTime = new Date().toLocaleString();

                        box_other_write_message_reply_add(login_member_id, message_mid, message_mid + "_" + result.reply_id, login_member_img_src, login_member_name, message_reply_text, formattedDateTime, "剛剛");
                        document.querySelector('.textarea_message_box_other_message_write.' + message_mid).value = "";

                        "a_div_message_box_btn_message_" + message_reply_number

                        let reply_int = parseInt(document.querySelector('#a_div_message_box_btn_message_' + message_mid).textContent.split('回應 (')[1].split(')')[0]) + 1
                        let reply_str = reply_int.toString()
                        document.querySelector('#a_div_message_box_btn_message_' + message_mid).textContent = '回應 (' + reply_str + ')'
                        document.querySelector('.message_box_text_btn_error_text.' + message_mid).style.display = "none"

                        check_function_end = true

                    } else {
                        document.querySelector('.message_box_text_btn_error_text.' + message_mid).style.display = "flex";
                        document.querySelector('.message_box_text_btn_error_text.' + message_mid).textContent = result.message;
                        check_function_end = true
                    }
                })
        } else {
            document.querySelector('.message_box_text_btn_error_text.' + message_mid).style.display = "flex";
            document.querySelector('.message_box_text_btn_error_text.' + message_mid).textContent = "請檢查字數不得空或超過50字";
            check_function_end = true

        }
    }
}

// 增加回覆區物件
function box_other_write_message_reply_add(user_id, message_mid, reply_message_mid, reply_member_img_src, reply_member_name, reply_message_text, reply_time, reply_time_about) {
    let div_message_box_other_message = document.querySelector('.message_box_other_message.' + message_mid);
    let div_message_box_other_message_load = document.createElement("div");
    div_message_box_other_message_load.className = "message_box_other_message_load " + reply_message_mid;
    if (div_message_box_other_message.firstChild == null) {

        div_message_box_other_message.appendChild(div_message_box_other_message_load)
    } else {
        div_message_box_other_message.insertBefore(div_message_box_other_message_load, div_message_box_other_message.childNodes[0]);
    }

    // 會員頭貼
    let div_message_box_other_message_load_left = document.createElement("div");
    div_message_box_other_message_load_left.className = "message_box_other_message_load_left";
    div_message_box_other_message_load.appendChild(div_message_box_other_message_load_left);

    let img_div_message_box_other_message_load_left = document.createElement("img");
    img_div_message_box_other_message_load_left.src = reply_member_img_src;
    div_message_box_other_message_load_left.appendChild(img_div_message_box_other_message_load_left);


    let div_message_box_other_message_load_right = document.createElement("div")
    div_message_box_other_message_load_right.className = "message_box_other_message_load_right"
    div_message_box_other_message_load.appendChild(div_message_box_other_message_load_right)

    // 會員名
    let a_message_box_other_message_load_right_name = document.createElement("a")
    a_message_box_other_message_load_right_name.className = "message_box_other_message_load_right_name"
    a_message_box_other_message_load_right_name.textContent = reply_member_name
    a_message_box_other_message_load_right_name.setAttribute("href", "/member_forum?name=" + reply_member_name)
    div_message_box_other_message_load_right.appendChild(a_message_box_other_message_load_right_name)

    // 文字
    let span_message_box_other_message_load_right_text = document.createElement("span")
    span_message_box_other_message_load_right_text.className = "message_box_other_message_load_right_text"
    span_message_box_other_message_load_right_text.textContent = reply_message_text
    div_message_box_other_message_load_right.appendChild(span_message_box_other_message_load_right_text)

    // 時間
    let span_message_box_other_message_load_right_time = document.createElement("span")
    span_message_box_other_message_load_right_time.className = "message_box_other_message_load_right_time"
    span_message_box_other_message_load_right_time.textContent = reply_time_about
    span_message_box_other_message_load_right_time.setAttribute("title", reply_time)

    div_message_box_other_message_load_right.appendChild(span_message_box_other_message_load_right_time)
}

/*-----------------------------*/
// 留言串下 回覆字數
function check_input_reply(value, alt) {
    let maxLen = 50;
    if (value.length > maxLen) {
        document.querySelector('.textarea_message_box_other_message_write.' + alt).value = value.substring(0, maxLen);
    }
    else if (value.length == 0) {
        document.querySelector('.message_box_text_btn_error_text.' + alt).style.display = "none"
    } else {
        document.querySelector('.message_box_text_btn_error_text.' + alt).textContent = maxLen - value.length;
        document.querySelector('.message_box_text_btn_error_text.' + alt).style.display = "flex"
    }
}

/*-----------------------------*/
//功能-畫面捲動監聽
window.addEventListener('scroll', function () {
    let webwarp = document.querySelector('.warp');
    if (10 > (webwarp.scrollHeight - window.pageYOffset - window.innerHeight) & check_onload == true & forum_page != null) {
        //c heck_onload = false;
        forum_page += 1;
        // document.getElementById("loadgif").style.display = "flex";

        member_predict_load_message()
        document.querySelector('.base_load_gif_forum').style.display = "flex";

    }
})
function init_message_load() {

    document.querySelector('.main_left_center').innerText = ""
    member_predict_load_message()

}

init_message_load()
