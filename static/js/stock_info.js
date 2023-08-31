let url = location.href;
url = url.split("stock_id=")
let stock_info_stock_id = url[url.length - 1]
    // console.log(stock_info_stock_id)

let div_member_main_member_databydb = document.querySelector('.member_main_member_databydb.predict')
let check_function_end = true;
let forum_page = 0;
let check_onload = true;
let web_stock_name = ""


/*-----------------------------*/
//stock_data
function stock_data_load() {
    fetch("/api/getstock_info?stock_id=" + stock_info_stock_id).then(function(response) {
        return response.json();
    }).then(function(result) {
        // console.log(result)
        if (result.ok) {

            document.querySelector('.stock_data_info.date').textContent = result.data.date;
            document.querySelector('.stock_data_info.total').textContent = result.data.total;
            document.querySelector('.stock_data_info.open_price').textContent = result.data.open_price;
            document.querySelector('.stock_data_info.high_price').textContent = result.data.high_price;
            document.querySelector('.stock_data_info.low_price').textContent = result.data.low_price;
            document.querySelector('.stock_data_info.end_price').textContent = result.data.end_price;
            document.querySelector('.stock_data_info.differ').textContent = result.data.differ;
            document.querySelector('.stock_data_info.totaldeal').textContent = result.data.total_deal;
            document.querySelector('.stock_info_update_time').textContent = "更新時間：" + result.data.update_time;



            document.querySelector('.stock_data_info.date_').textContent = result.data.date;
            document.querySelector('.stock_data_info.total_').textContent = result.data.total;
            document.querySelector('.stock_data_info.open_price_').textContent = result.data.open_price;
            document.querySelector('.stock_data_info.high_price_').textContent = result.data.high_price;
            document.querySelector('.stock_data_info.low_price_').textContent = result.data.low_price;
            document.querySelector('.stock_data_info.end_price_').textContent = result.data.end_price;
            document.querySelector('.stock_data_info.differ_').textContent = result.data.differ;
            document.querySelector('.stock_data_info.totaldeal_').textContent = result.data.total_deal;
            document.querySelector('.stock_info_update_time_').textContent = "更新時間：" + result.data.update_time;
            stock_news_load(result.data.stock_name)
        }
    })
}

//stock_new

function stock_new_load_add(date, text, src) {
    let div_stock_new_box = document.querySelector('.stock_new_box')

    let div_stock_new_data = document.createElement("div");
    div_stock_new_data.className = "stock_new_data";
    // div_stock_new_data.setAttribute("target", "_blank ")

    // div_stock_new_data.addEventListener('click', function() {
    //     location.href = src
    // });
    div_stock_new_box.appendChild(div_stock_new_data)


    let div_stock_new_data_date = document.createElement("div");
    div_stock_new_data_date.className = "stock_new_data date";
    div_stock_new_data_date.textContent = date
    div_stock_new_data.appendChild(div_stock_new_data_date)

    let a_stock_new_data_text = document.createElement("a");
    a_stock_new_data_text.className = "stock_new_data text";
    a_stock_new_data_text.textContent = text
    a_stock_new_data_text.href = src;
    a_stock_new_data_text.setAttribute("target", "_blank ")

    div_stock_new_data.appendChild(a_stock_new_data_text)
}

function stock_news_load(stock_name) {
    document.querySelector('.base_load_gif_stock_info.load_news').style.display = "flex";

    fetch("api/getstock_new?stock_name=" + stock_name).then(function(response) {
        return response.json();
    }).then(function(result) {
        // console.log(result)
        if (result.ok) {
            for (let i = 0; i < result.data.length; i++) {
                // console.log(result.data[i])
                stock_new_load_add(result.data[i].date, result.data[i].title, result.data[i].src)
                document.querySelector('.base_load_gif_stock_info.load_news').style.display = "none";

            }
        }
    })
}
/*-----------------------------*/
//rank
// 讀取排行資料
function member_predict_load_message_stock_info(data_status) {
    fetch("api/message_predict_rank?stock_id=" + stock_info_stock_id).then(function(response) {
        return response.json();
    }).then(function(result) {
        // console.log(result)
        if (result.data.member_no_data) {
            document.querySelector('.data_not_have').style.display = "flex";
            document.querySelector('.member_rank_win_title.' + data_status).style.display = "none";


        }

        if (result.ok) {
            // document.querySelector('.data_not_have').style.display = "none";

            for (let i = 0; i < 5; i++) {
                if (result.data[i]) {
                    member_name = result.data[i].member_name;
                    member_src = result.data[i].member_src;
                    predict_win_rate = result.data[i].predict_win_rate
                    predict_win = result.data[i].predict_win
                    predict_fail = result.data[i].predict_fail
                    predict_total = result.data[i].predict_total
                    lod_rank_data_have = true
                } else {
                    member_name = "無";
                    member_src = "無";


                    predict_win_rate = "無";
                    predict_win = "無";
                    predict_fail = "無";
                    predict_total = "無";
                    lod_rank_data_have = false
                }


                // console.log(i, member_name, predict_win, predict_fail, predict_total, predict_win_rate)
                load_rank_rate_add_stock_info(i + 1, member_src, member_name, predict_win_rate, predict_win, predict_fail, predict_total, lod_rank_data_have)
                document.querySelector('.base_load_gif_stock_info.load_rank').style.display = "none";

            }
        }


    })
}



function load_rank_rate_add_stock_info(no, member_src, member_name, predict_win_rate, predict_win, predict_fail, predict_total, lod_rank_data_have) {
    if (lod_rank_data_have) {
        let rate_div_member_rank_box = document.querySelector('.member_rank_box.rate')
        let div_member_rank_box_win_load = document.createElement("div");
        div_member_rank_box_win_load.className = "member_rank_box_win_load";
        rate_div_member_rank_box.appendChild(div_member_rank_box_win_load)

        let div_member_rank_box_win_no = document.createElement("div");
        div_member_rank_box_win_no.className = "member_rank_box_win_no";
        div_member_rank_box_win_no.textContent = no;
        div_member_rank_box_win_load.appendChild(div_member_rank_box_win_no)

        let div_member_rank_box_win_stock = document.createElement("div");
        div_member_rank_box_win_stock.className = "member_rank_box_win_stock no" + no;
        div_member_rank_box_win_stock.addEventListener('click', function() {
            location.href = '/member?name=' + member_name
        });
        div_member_rank_box_win_load.appendChild(div_member_rank_box_win_stock)

        let img_member_rank_box_win_img = document.createElement("img");
        img_member_rank_box_win_img.className = "member_rank_box_win_img";
        img_member_rank_box_win_img.src = member_src;
        div_member_rank_box_win_stock.appendChild(img_member_rank_box_win_img)

        let a_member_rank_box_win_stock_name = document.createElement("a");
        a_member_rank_box_win_stock_name.className = "member_rank_box_win_stock_name";
        a_member_rank_box_win_stock_name.textContent = member_name;
        div_member_rank_box_win_stock.appendChild(a_member_rank_box_win_stock_name)

        let img_a_member_rank_box_win_stock_name = document.createElement("img");
        img_a_member_rank_box_win_stock_name.className = "member_rank_box_win_stock_name_img";
        if (no == 1) {
            img_a_member_rank_box_win_stock_name.src = 'img/rank_first_.png';

        }
        if (no == 2) {
            img_a_member_rank_box_win_stock_name.src = 'img/rank_second_.png';

        }
        if (no == 3) {
            img_a_member_rank_box_win_stock_name.src = 'img/rank_third_.png';

        }
        div_member_rank_box_win_stock.appendChild(img_a_member_rank_box_win_stock_name)

        let div_member_rank_box_win_text_rate = document.createElement("div");
        div_member_rank_box_win_text_rate.className = "member_rank_box_win_text rate";
        div_member_rank_box_win_text_rate.textContent = "勝率：" + predict_win_rate + "%";
        div_member_rank_box_win_load.appendChild(div_member_rank_box_win_text_rate)

        let div_member_rank_box_win_text_win = document.createElement("div");
        div_member_rank_box_win_text_win.className = "member_rank_box_win_text win";
        div_member_rank_box_win_text_win.textContent = "成功：" + predict_win + "次";
        div_member_rank_box_win_load.appendChild(div_member_rank_box_win_text_win)

        let div_member_rank_box_win_text_fail = document.createElement("div");
        div_member_rank_box_win_text_fail.className = "member_rank_box_win_text fail";
        div_member_rank_box_win_text_fail.textContent = "失敗：" + predict_fail + "次";
        div_member_rank_box_win_load.appendChild(div_member_rank_box_win_text_fail)


        let div_member_rank_box_win_text_total = document.createElement("div");
        div_member_rank_box_win_text_total.className = "member_rank_box_win_text total";
        div_member_rank_box_win_text_total.textContent = "合計：" + predict_total + "次";
        div_member_rank_box_win_load.appendChild(div_member_rank_box_win_text_total)

    } else {
        let rate_div_member_rank_box = document.querySelector('.member_rank_box.rate')
        let div_member_rank_box_win_load = document.createElement("div");
        div_member_rank_box_win_load.className = "member_rank_box_win_load";
        rate_div_member_rank_box.appendChild(div_member_rank_box_win_load)

        let div_member_rank_box_win_no = document.createElement("div");
        div_member_rank_box_win_no.className = "member_rank_box_win_no";
        div_member_rank_box_win_no.textContent = "?";
        div_member_rank_box_win_load.appendChild(div_member_rank_box_win_no)

        let div_member_rank_box_win_stock = document.createElement("div");
        div_member_rank_box_win_stock.className = "member_rank_box_win_stock no" + no;
        div_member_rank_box_win_load.appendChild(div_member_rank_box_win_stock)
        div_member_rank_box_win_stock.style.cursor = "auto";
        // <img src="img/peo.png" alt="">
        let img_member_rank_box_win_img = document.createElement("img");
        img_member_rank_box_win_img.className = "member_rank_box_win_img";
        img_member_rank_box_win_img.src = 'img/unknown.png';
        div_member_rank_box_win_stock.appendChild(img_member_rank_box_win_img)

        let a_member_rank_box_win_stock_name = document.createElement("a");
        a_member_rank_box_win_stock_name.className = "member_rank_box_win_stock_name";
        a_member_rank_box_win_stock_name.textContent = "從缺中"
        div_member_rank_box_win_stock.appendChild(a_member_rank_box_win_stock_name)


        let div_member_rank_box_win_text_rate = document.createElement("div");
        div_member_rank_box_win_text_rate.className = "member_rank_box_win_text rate";
        div_member_rank_box_win_text_rate.textContent = "勝率：" + predict_win_rate;
        div_member_rank_box_win_load.appendChild(div_member_rank_box_win_text_rate)

        let div_member_rank_box_win_text_win = document.createElement("div");
        div_member_rank_box_win_text_win.className = "member_rank_box_win_text win";
        div_member_rank_box_win_text_win.textContent = "成功：" + predict_win;
        div_member_rank_box_win_load.appendChild(div_member_rank_box_win_text_win)

        let div_member_rank_box_win_text_fail = document.createElement("div");
        div_member_rank_box_win_text_fail.className = "member_rank_box_win_text fail";
        div_member_rank_box_win_text_fail.textContent = "失敗：" + predict_fail;
        div_member_rank_box_win_load.appendChild(div_member_rank_box_win_text_fail)


        let div_member_rank_box_win_text_total = document.createElement("div");
        div_member_rank_box_win_text_total.className = "member_rank_box_win_text total";
        div_member_rank_box_win_text_total.textContent = "合計：" + predict_total;
        div_member_rank_box_win_load.appendChild(div_member_rank_box_win_text_total)
    }


}
/*-----------------------------*/


//畫面生成
function member_predict_add_message(predict_message_member_id, predict_stock, predict_trend, predict_message, predict_message_member_name, predict_message_member_img_src, time, time_about, message_mid, message_check_status, login_member_name_good_have, message_good_number, message_reply_number, message_reply_data) {
    let div_predict_message_box = document.createElement("div");
    div_predict_message_box.className = "predict_message_box";

    // if (main_left_center.firstChild == null) {

    //     main_left_center.appendChild(div_predict_message_box)
    // } else {

    //     main_left_center.insertBefore(div_predict_message_box, main_left_center.childNodes[0]);
    //     //父.insertBefore(加入，被加入)
    // }

    div_member_main_member_databydb.appendChild(div_predict_message_box)

    //<div class="predict_message_box_result"><img src=" img/fail.png " alt=" "></div>
    let div_predict_message_box_result = document.createElement("div");
    div_predict_message_box_result.className = "predict_message_box_result";
    div_predict_message_box.appendChild(div_predict_message_box_result)

    // 預測檢測後的顯示
    let imgdiv_predict_message_box_result = document.createElement("img");
    if (message_check_status == "0") {
        imgdiv_predict_message_box_result.src = ""
    }
    if (message_check_status == "1") {
        imgdiv_predict_message_box_result.src = "img/success.png"
        imgdiv_predict_message_box_result.style.opacity = "0.55";
    }
    if (message_check_status == "-1") {
        imgdiv_predict_message_box_result.src = "img/fail.png"
        imgdiv_predict_message_box_result.style.opacity = "0.55";

    }
    div_predict_message_box_result.appendChild(imgdiv_predict_message_box_result)


    //刪除按鈕              

    let div_delete_predict_message = document.createElement("div");
    div_delete_predict_message.className = "administrator_delete_predict_message";
    div_delete_predict_message.setAttribute("alt", message_mid);
    div_delete_predict_message.setAttribute("member", predict_message_member_id);
    if (login_member_level) {
        div_delete_predict_message.style.display = "flex"
    }
    div_delete_predict_message.onclick = function() {
        let message_mid = this.getAttribute('alt');
        let member_user_id = this.getAttribute('member');

        administrator_delete_predict(message_mid, member_user_id)

    }
    div_predict_message_box.appendChild(div_delete_predict_message)


    let img_delete_predict_message = document.createElement("img");
    img_delete_predict_message.src = " img/delete.png";
    div_delete_predict_message.appendChild(img_delete_predict_message)

    /*---------*/


    let div_predict_message_box_image = document.createElement("div");
    div_predict_message_box_image.className = "predict_message_box_image";
    div_predict_message_box.appendChild(div_predict_message_box_image)

    let img_div_div_content_img = document.createElement("img");
    img_div_div_content_img.src = predict_message_member_img_src
    div_predict_message_box_image.appendChild(img_div_div_content_img)


    let div_predict_message = document.createElement("div");
    div_predict_message.className = "predict_message";
    div_predict_message_box.appendChild(div_predict_message)

    /* */
    let div_message_box_loaddata = document.createElement("div");
    div_message_box_loaddata.className = "message_box_loaddata";
    div_predict_message.appendChild(div_message_box_loaddata)

    let div_message_box_title = document.createElement("div");
    div_message_box_title.className = "message_box_title";
    div_message_box_loaddata.appendChild(div_message_box_title);

    let a_message_box_title_name = document.createElement("a");
    a_message_box_title_name.className = "message_box_title_name " + message_mid
    a_message_box_title_name.setAttribute("href", "/member?id=" + predict_message_member_id)
    a_message_box_title_name.textContent = predict_message_member_name
    div_message_box_title.appendChild(a_message_box_title_name)

    let div_message_box_predict = document.createElement("div")
    div_message_box_predict.className = "message_box_predict"
        // div_message_box_predict.textContent = "預測：" + predict_stock + "的下次開盤走勢為" + predict_trend;
    div_message_box_loaddata.appendChild(div_message_box_predict);

    let a_message_box_predict_1 = document.createElement("a")
    a_message_box_predict_1.textContent = "預測："
    div_message_box_predict.appendChild(a_message_box_predict_1);

    let a_message_box_predict_2 = document.createElement("a")
    a_message_box_predict_2.textContent = predict_stock
    a_message_box_predict_2.className = "message_box_predict_stock"
    let stock_id = predict_stock.split("－")
    a_message_box_predict_2.setAttribute("href", "stock_info?stock_id=" + stock_id[0])

    div_message_box_predict.appendChild(a_message_box_predict_2);

    let a_message_box_predict_3 = document.createElement("a")
    a_message_box_predict_3.textContent = "的下次開盤走勢為" + predict_trend;
    div_message_box_predict.appendChild(a_message_box_predict_3);




    let div_message_box_text = document.createElement("div")
    div_message_box_text.className = "message_box_text"
    div_message_box_text.textContent = predict_message;
    div_message_box_loaddata.appendChild(div_message_box_text);
    /* */

    let div_message_box_text_btn = document.createElement("div")
    div_message_box_text_btn.className = "message_box_text_btn"
    div_predict_message.appendChild(div_message_box_text_btn)

    let div_message_box_date = document.createElement("div")
    div_message_box_date.className = "message_box_date"
    div_message_box_date.textContent = time_about
    div_message_box_date.setAttribute("title", time)
    div_message_box_text_btn.appendChild(div_message_box_date)

    let div_message_box_btn = document.createElement("div")
    div_message_box_btn.className = "message_box_btn"
    div_message_box_text_btn.appendChild(div_message_box_btn)

    let div_message_box_btn_like = document.createElement("div")
    div_message_box_btn_like.className = "message_box_btn_like"
    div_message_box_btn_like.setAttribute("id", message_mid)
    div_message_box_btn_like.setAttribute("alt", message_mid)



    if (login_member_name_good_have) {
        div_message_box_btn_like.onclick = function() {
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
        img_div_message_box_btn_like.src = "img/likeA.png"
        div_message_box_btn_like.appendChild(img_div_message_box_btn_like)
    } else {


        div_message_box_btn_like.onclick = function() {
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
        img_div_message_box_btn_like.src = "img/likeB.png"
        div_message_box_btn_like.appendChild(img_div_message_box_btn_like)
    }



    let div_message_box_btn_message = document.createElement("div")
    div_message_box_btn_message.className = "message_box_btn_message " + message_mid;
    div_message_box_btn_message.setAttribute("alt", message_mid)
    div_message_box_btn_message.onclick = function() {
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
    img_div_message_box_btn_message.src = "img/chat.png"
    div_message_box_btn_message.appendChild(img_div_message_box_btn_message)

    // 回應
    let div_message_box_other_message = document.createElement("div")
    div_message_box_other_message.className = "message_box_other_message " + message_mid
    div_predict_message.appendChild(div_message_box_other_message)



    if (message_reply_data.data) {
        // console.log(message_reply_data.message_predict_reply_load_data);
        for (let i = 0; i < message_reply_data.message_predict_reply_load_data.length; i++) {

            message_reply_data_ = message_reply_data.message_predict_reply_load_data[i]
            box_other_write_message_reply_add(message_reply_data_.message_reply_user_id, message_reply_data_.message_mid, message_reply_data_.message_reply_mid, message_reply_data_.message_reply_user_imgsrc, message_reply_data_.message_reply_user_name, message_reply_data_.message_reply_text, message_reply_data_.message_reply_time, message_reply_data_.message_reply_time_about)
        }
    }

    /*-- -- -- -- - */

    // let div_message_box_other_message_load = document.createElement("div")
    // div_message_box_other_message_load.className = "message_box_other_message_load " + message_mid
    // div_message_box_other_message.appendChild(div_message_box_other_message_load)

    // let div_message_box_other_message_load_left = document.createElement("div")
    // div_message_box_other_message_load_left.className = "message_box_other_message_load_left"
    // div_message_box_other_message_load.appendChild(div_message_box_other_message_load_left)

    // let img_div_message_box_other_message_load_left = document.createElement("img")
    // img_div_message_box_other_message_load_left.src = "img/1.jpg "
    // div_message_box_other_message_load_left.appendChild(img_div_message_box_other_message_load_left)


    // let div_message_box_other_message_load_right = document.createElement("div")
    // div_message_box_other_message_load_right.className = "message_box_other_message_load_right"
    // div_message_box_other_message_load.appendChild(div_message_box_other_message_load_right)

    // let span_message_box_other_message_load_right_name = document.createElement("span")
    // span_message_box_other_message_load_right_name.className = "message_box_other_message_load_right_name"
    // span_message_box_other_message_load_right_name.textContent = "HAO"
    // div_message_box_other_message_load_right.appendChild(span_message_box_other_message_load_right_name)

    // let span_message_box_other_message_load_right_text = document.createElement("span")
    // span_message_box_other_message_load_right_text.className = "message_box_other_message_load_right_text"
    // span_message_box_other_message_load_right_text.textContent = "真的嗎?"
    // div_message_box_other_message_load_right.appendChild(span_message_box_other_message_load_right_text)

    // let span_message_box_other_message_load_right_time = document.createElement("span")
    // span_message_box_other_message_load_right_time.className = "message_box_other_message_load_right_time"
    // span_message_box_other_message_load_right_time.textContent = "2021/7/10 14:47"
    // div_message_box_other_message_load_right.appendChild(span_message_box_other_message_load_right_time)

    /*-- -- -- -- - */


    let div_message_box_other_message_write = document.createElement("div")
    div_message_box_other_message_write.className = "message_box_other_message_write"
    div_message_box_other_message.appendChild(div_message_box_other_message_write)

    let textarea_message_box_other_message_write = document.createElement("textarea")
    textarea_message_box_other_message_write.placeholder = "分享一下你的想法... "
    textarea_message_box_other_message_write.className = "textarea_message_box_other_message_write " + message_mid
    textarea_message_box_other_message_write.setAttribute("alt", message_mid)
    textarea_message_box_other_message_write.setAttribute("onKeyDown", "check_input_(this.value,this.getAttribute('alt'))")
    textarea_message_box_other_message_write.setAttribute("onKeyUp", "check_input_(this.value,this.getAttribute('alt'))")

    div_message_box_other_message_write.appendChild(textarea_message_box_other_message_write)


    let img_message_box_other_message_write = document.createElement("img")
    img_message_box_other_message_write.src = "img/sent.png "
    img_message_box_other_message_write.setAttribute("alt", message_mid)

    img_message_box_other_message_write.onclick = function() {
        let message_mid = this.getAttribute('alt');
        // console.log(document.querySelector('.textarea_message_box_other_message_write.' + message_mid).value)
        // console.log(message_mid)
        box_other_write_message_reply(message_mid)
    }
    div_message_box_other_message_write.appendChild(img_message_box_other_message_write)

    let a_message_box_text_btn_error_text = document.createElement("a")
    a_message_box_text_btn_error_text.className = "message_box_text_btn_error_text " + message_mid
    a_message_box_text_btn_error_text.textContent = "."
    div_message_box_other_message.appendChild(a_message_box_text_btn_error_text)


}


// 讀取全部的預測留言
function member_predict_load_message() {
    fetch("/api/message_predict_load?data_keyword=" + stock_info_stock_id + "&data_number=" + String(forum_page)).then(function(response) {
        return response.json();
    }).then(function(result) {
        // console.log(result)
        if (result.data.error) {
            location.href = '/'

        }

        if (result.data.stock_no_data) {
            // console.log("hi")
            web_stock_name = stock_info_stock_id + "－" + result.data.find
            document.querySelector('.stock_name').textContent = web_stock_name;
            document.querySelector('.stock_data_not_have').style.display = "flex";
            document.querySelector('.base_load_gif_stock_info.load_message').style.display = "none";

            check_onload = false
        }
        if (result.data.nodata) {
            document.querySelector('.base_load_gif_stock_info.load_message').style.display = "none";
        }


        if (result.data[0].predict_load) {
            for (let i = 0; i < result.data.length; i++) {
                predict_stock = result.data[i].stock_id + "－" + result.data[i].stock_name
                if (result.data[i].predict == "1") {
                    predict_trend = "漲"
                }
                if (result.data[i].predict == "-1") {
                    predict_trend = "跌"
                }
                if (result.data[i].predict == "0") {
                    predict_trend = "持平"
                }

                //會員資料
                predict_message_member_id = result.data[i].user_id
                predict_message = result.data[i].message_user_text
                predict_message_member_name = result.data[i].message_user_name
                predict_message_member_img_src = result.data[i].message_user_imgsrc

                // 讚
                login_member_name_good_have = result.data[i].login_member_name_good_have
                message_good_number = result.data[i].message_good_number

                //回覆
                message_reply_number = result.data[i].reply_message_number
                message_reply_data = result.data[i].reply_message_data

                time = result.data[i].message_time
                time_about = result.data[i].message_time_about


                message_mid = result.data[i].mid
                message_check_status = result.data[i].message_check_status
                    // console.log(predict_stock + predict_trend)
                member_predict_add_message(predict_message_member_id, predict_stock, predict_trend, predict_message, predict_message_member_name, predict_message_member_img_src, time, time_about, message_mid, message_check_status, login_member_name_good_have, message_good_number, message_reply_number, message_reply_data)

            }
            check_onload = true;
            web_stock_name = stock_info_stock_id + "－" + result.data[0].stock_name
            document.querySelector('.stock_name').textContent = web_stock_name;
            document.querySelector('.stock_data_not_have').style.display = "none";
            document.querySelector('.base_load_gif_stock_info.load_message').style.display = "none";

        }



    })
}


/*-----------------------------*/
// 新增讚
function predict_message_btn_enter_like(message_mid_like, message_member) {
    if (check_function_end) {
        check_function_end = false
        let message_mid_like_data = {
            "status": "like",
            "login_member_name": login_member_name,
            "login_member_email": login_member_email,
            "message_mid_like": message_mid_like,
            "message_member": message_member
        }
        fetch("/api/message_predict_like", {
                method: 'POST',
                body: JSON.stringify(message_mid_like_data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                return res.json();
            })
            .then(result => {
                // console.log(result);
                if (result.ok) {


                    document.querySelector('#' + message_mid_like + ">img").src = "img/likeA.png";

                    document.querySelector('#' + message_mid_like).onclick = function() {
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
    if (check_function_end) {
        check_function_end = false
        let message_mid_like_data = {
            "status": "unlike",
            "login_member_name": login_member_name,
            "login_member_email": login_member_email,
            "message_mid_like": message_mid_like
        }
        fetch("/api/message_predict_like", {
                method: 'POST',
                body: JSON.stringify(message_mid_like_data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                return res.json();
            })
            .then(result => {
                // console.log(result);
                if (result.ok) {

                    document.querySelector('#' + message_mid_like + ">img").src = "img/likeB.png"

                    document.querySelector('#' + message_mid_like).onclick = function() {
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
/*-----------------------------*/

//回應區顯示&隱藏
function message_box_other_message_load_diplay_flex(message_mid) {
    document.querySelector('.message_box_other_message.' + message_mid).style.display = "flex";

    document.querySelector('.message_box_btn_message.' + message_mid).onclick = function() {
        message_box_other_message_load_diplay_none(message_mid)
    }
    document.querySelector('.img_div_message_box_btn_message.' + message_mid).src = "img/chat_.png"
}

function message_box_other_message_load_diplay_none(message_mid) {
    document.querySelector('.message_box_other_message.' + message_mid).style.display = "none";
    document.querySelector('.message_box_btn_message.' + message_mid).onclick = function() {
        message_box_other_message_load_diplay_flex(message_mid)
    }
    document.querySelector('.img_div_message_box_btn_message.' + message_mid).src = "img/chat.png"
}


/*-----------------------------*/
// 傳送留言的回覆
function box_other_write_message_reply(message_mid) {
    if (check_function_end) {
        check_function_end = false

        let message_reply_text = document.querySelector('.textarea_message_box_other_message_write.' + message_mid).value;
        let box_other_write_message_reply_data = {
            "login_member_name": login_member_name,
            "login_member_img_src": login_member_img_src,
            "login_member_email": login_member_email,
            "message_mid": message_mid,
            "message_reply_text": message_reply_text
        }



        if (message_reply_text.length <= 50) {

            fetch("/api/message_predict_reply_add", {
                    method: 'POST',
                    // body: encodeURI(JSON.stringify(data)),
                    body: JSON.stringify(box_other_write_message_reply_data),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                .then(res => {
                    return res.json();
                })
                .then(result => {
                    if (result.ok) {


                        box_other_write_message_reply_add(login_member_id, result.mid, result.mid_reply, login_member_img_src, login_member_name, message_reply_text, result.time, "剛剛");
                        document.querySelector('.textarea_message_box_other_message_write.' + message_mid).value = "";

                        "a_div_message_box_btn_message_" + message_reply_number

                        let reply_int = parseInt(document.querySelector('#a_div_message_box_btn_message_' + message_mid).textContent.split('回應 (')[1].split(')')[0]) + 1
                        let reply_str = reply_int.toString()
                        document.querySelector('#a_div_message_box_btn_message_' + message_mid).textContent = '回應 (' + reply_str + ')'
                        document.querySelector('.message_box_text_btn_error_text.' + message_mid).style.display = "none"

                        check_function_end = true

                    }
                    if (result.error) {
                        document.querySelector('.message_box_text_btn_error_text.' + message_mid).style.display = "flex";
                        document.querySelector('.message_box_text_btn_error_text.' + message_mid).textContent = result.message;
                        check_function_end = true
                    }
                })
        } else {
            document.querySelector('.message_box_text_btn_error_text.' + message_mid).textContent = "字數不得超過50字";
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
        //父.insertBefore(加入，被加入)
    }


    let div_message_box_other_message_load_left = document.createElement("div");
    div_message_box_other_message_load_left.className = "message_box_other_message_load_left";
    div_message_box_other_message_load.appendChild(div_message_box_other_message_load_left);

    let img_div_message_box_other_message_load_left = document.createElement("img");
    img_div_message_box_other_message_load_left.src = reply_member_img_src;
    div_message_box_other_message_load_left.appendChild(img_div_message_box_other_message_load_left);


    let div_message_box_other_message_load_right = document.createElement("div")
    div_message_box_other_message_load_right.className = "message_box_other_message_load_right"
    div_message_box_other_message_load.appendChild(div_message_box_other_message_load_right)

    let a_message_box_other_message_load_right_name = document.createElement("a")
    a_message_box_other_message_load_right_name.className = "message_box_other_message_load_right_name"
    a_message_box_other_message_load_right_name.textContent = reply_member_name
    a_message_box_other_message_load_right_name.setAttribute("href", "/member?id=" + user_id)

    div_message_box_other_message_load_right.appendChild(a_message_box_other_message_load_right_name)


    let span_message_box_other_message_load_right_text = document.createElement("span")
    span_message_box_other_message_load_right_text.className = "message_box_other_message_load_right_text"
    span_message_box_other_message_load_right_text.textContent = reply_message_text
    div_message_box_other_message_load_right.appendChild(span_message_box_other_message_load_right_text)

    let span_message_box_other_message_load_right_time = document.createElement("span")
    span_message_box_other_message_load_right_time.className = "message_box_other_message_load_right_time"
    span_message_box_other_message_load_right_time.textContent = reply_time_about
    span_message_box_other_message_load_right_time.setAttribute("title", reply_time)

    div_message_box_other_message_load_right.appendChild(span_message_box_other_message_load_right_time)



}


/*-----------------------------*/


//功能-畫面捲動監聽
window.addEventListener('scroll', function() {
    let webwarp = document.querySelector('.warp');
    if (10 > (webwarp.scrollHeight - window.pageYOffset - window.innerHeight) & check_onload == true & forum_page != null) {
        check_onload = false;
        forum_page += 1;
        document.querySelector('.base_load_gif_stick_info.load_message').style.display = "flex";

        member_predict_load_message()

    }
})


/*----------留言板字數監控---------*/


function check_input_(value, alt) {
    // console.log(value, alt)
    let maxLen = 50;


    if (value.length > maxLen) {
        document.querySelector('.textarea_message_box_other_message_write.' + alt).value = value.substring(0, maxLen);
        // console.log(value)
    }
    // otherwise, update 'characters left' counter 
    else if (value.length == 0) {
        document.querySelector('.message_box_text_btn_error_text.' + alt).style.display = "none"
    } else {
        document.querySelector('.message_box_text_btn_error_text.' + alt).textContent = maxLen - value.length;
        document.querySelector('.message_box_text_btn_error_text.' + alt).style.display = "flex"
    }
}


/*-----------------------------*/
function administrator_delete_predict(mid, member_user_id) {
    let delete_predict = {
        "message_id": mid,
        "member_user_id": member_user_id
    }
    fetch("/api/message_predict_add", {
            method: 'DELETE',
            body: JSON.stringify(delete_predict),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            return res.json();
        })
        .then(result => {
            console.log(result);
            if (result.ok) {
                window.location.href = window.location.href

            }
        });
}
/*-----------------------------*/


function init() {
    member_predict_load_message_stock_info()
    stock_data_load()
    member_predict_load_message()
}