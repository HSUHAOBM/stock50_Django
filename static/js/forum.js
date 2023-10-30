
// 留言-股票選項
function stock_select_change() {
    let stock_select_textContent = document.querySelector('.stock_select_list');
    let index = stock_select_textContent.selectedIndex
    let stock_select_out_text = stock_select_textContent.options[index].text

    document.querySelector('.member_out_stock.name').href = "stock_info/" + stock_select_out_text.split("－")[0]
    document.querySelector('.member_out_stock.name').textContent = stock_select_out_text;
    document.querySelector('.member_out_text').style.display = "flex";
    document.querySelector('.textInput').placeholder = "分享你對 " + stock_select_out_text + " 的想法 ...";
}

// 留言-股票狀態選項
function trend_radio_change(text) {
    let out_text = ""
    if (text == 1) {
        out_text = "漲"
    } else if (text == 2) {
        out_text = "跌"
    } else if (text == 3) {
        out_text = "持平"
    }
    document.querySelector('.member_out_stock.trend').textContent = " " + out_text;
    document.querySelector('.member_out_text').style.display = "flex";
    document.querySelector('.div_message_btn_img.img1').style.opacity = "0.4"
    document.querySelector('.div_message_btn_img.img2').style.opacity = "0.4"
    document.querySelector('.div_message_btn_img.img3').style.opacity = "0.4"

    document.querySelector('.div_message_btn_img.img' + text).style.opacity = "1"
    document.querySelector('.div_message_btn.bt1').style.backgroundColor = " white"
    document.querySelector('.div_message_btn.bt2').style.backgroundColor = " white"
    document.querySelector('.div_message_btn.bt3').style.backgroundColor = " white"

    document.querySelector('.div_message_btn.bt' + text).style.backgroundColor = " rgb(247 247 247)"

}


// 留言板字數
function check_input(value) {
    let maxLen = 200;
    if (value.length > maxLen) {
        document.querySelector('.textInput').value = value.substring(0, maxLen);
    }
    else document.querySelector('.member_out_btn_error_text').textContent = maxLen - value.length;
}



// 送出留言
let member_predict_data_form = document.getElementById('member_predict_data');
member_predict_data_form.addEventListener('submit', function(event) {
    if (check_function_end) {
        check_function_end = false
        let member_predict_data_form_ = new FormData(member_predict_data_form);
        let member_predict_form_data = {};

        event.preventDefault();

        predict_message = member_predict_data_form_.get("member_predict_message")

        member_predict_form_data = {
                "predict_stock": member_predict_data_form_.get("member_predict_stock"),
                "predict_trend": member_predict_data_form_.get("member_predict_trend"),
                "predict_message": predict_message,
            }

        let csrfToken = member_predict_data_form_.get("csrfmiddlewaretoken")

        if (predict_message.length <= 200) {
            fetch("/api/forum/", {
                method: "POST",
                body: JSON.stringify(member_predict_form_data),
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': csrfToken,
                }
            }).then(function(res) {
                return res.json();
            }).then(function(result) {
                if (result.ok) {
                    window.location.href = window.location.href
                }
                else{
                    document.querySelector('.member_out_btn_error_text').textContent = result.message;
                    check_function_end = true;
                }
            })
        } else {
            document.querySelector('.member_out_btn_error_text').textContent = "字數不得超過200字";
            check_function_end = true;
        }
    }
})


/*-------------rnak----------------*/


let main_right_ranking = document.querySelector('.main_right_ranking')


function member_predict_add_rank(no, member_name, predict_win, predict_fail, predict_total, predict_win_rate, member_src, member_id) {
    let div_main_right_ranking_stock_box = document.createElement("div");
    div_main_right_ranking_stock_box.className = "main_right_ranking_stock box";
    main_right_ranking.appendChild(div_main_right_ranking_stock_box)

    let div_main_right_ranking_stock_no = document.createElement("div");
    div_main_right_ranking_stock_no.className = "main_right_ranking_stock_no";
    div_main_right_ranking_stock_no.textContent = no;
    div_main_right_ranking_stock_box.appendChild(div_main_right_ranking_stock_no)

    let div_main_right_ranking_stock_data = document.createElement("div");
    div_main_right_ranking_stock_data.className = "main_right_ranking_stock_data";
    div_main_right_ranking_stock_box.appendChild(div_main_right_ranking_stock_data)

    let div_main_right_rank_box = document.createElement("div");
    div_main_right_rank_box.className = "div_main_right_rank_box";
    div_main_right_rank_box.addEventListener('click', function() {
        location.href = '//member_forum?name=' + member_id
    });
    div_main_right_ranking_stock_data.appendChild(div_main_right_rank_box)

    let img_main_right_ranking_stock_member_img = document.createElement("img");
    img_main_right_ranking_stock_member_img.src = member_src;
    div_main_right_rank_box.appendChild(img_main_right_ranking_stock_member_img);

    let div_main_right_ranking_stock_member_name = document.createElement("a");
    div_main_right_ranking_stock_member_name.className = "main_right_ranking_stock_member_name";
    // div_main_right_ranking_stock_member_name.setAttribute("href", "/member?name=" + member_name)

    div_main_right_ranking_stock_member_name.textContent = member_name;
    div_main_right_rank_box.appendChild(div_main_right_ranking_stock_member_name);

    let span_main_right_ranking_stock_rate = document.createElement("span");
    span_main_right_ranking_stock_rate.className = "main_right_ranking_stock rate"
    div_main_right_ranking_stock_data.appendChild(span_main_right_ranking_stock_rate)

    let a_ranking_stocktitle_1 = document.createElement("a");
    a_ranking_stocktitle_1.className = "ranking_stocktitle";
    a_ranking_stocktitle_1.textContent = "勝率：";
    span_main_right_ranking_stock_rate.appendChild(a_ranking_stocktitle_1)
    let a_ranking_stocktitle_text_1 = document.createElement("a");
    a_ranking_stocktitle_text_1.className = "ranking_stocktitle_text";
    a_ranking_stocktitle_text_1.textContent = predict_win_rate + " %";
    span_main_right_ranking_stock_rate.appendChild(a_ranking_stocktitle_text_1)


    let span_main_right_ranking_stock_success = document.createElement("span");
    span_main_right_ranking_stock_success.className = "main_right_ranking_stock success"
    div_main_right_ranking_stock_data.appendChild(span_main_right_ranking_stock_success)

    let a_ranking_stocktitle_2 = document.createElement("a");
    a_ranking_stocktitle_2.className = "ranking_stocktitle";
    a_ranking_stocktitle_2.textContent = "成功：";
    span_main_right_ranking_stock_success.appendChild(a_ranking_stocktitle_2)
    let a_ranking_stocktitle_text_2 = document.createElement("a");
    a_ranking_stocktitle_text_2.className = "ranking_stocktitle_text";
    a_ranking_stocktitle_text_2.textContent = predict_win + " 次";
    span_main_right_ranking_stock_success.appendChild(a_ranking_stocktitle_text_2)


    let span_main_right_ranking_stock_fail = document.createElement("span");
    span_main_right_ranking_stock_fail.className = "main_right_ranking_stock fail"
    div_main_right_ranking_stock_data.appendChild(span_main_right_ranking_stock_fail)

    let a_ranking_stocktitle_3 = document.createElement("a");
    a_ranking_stocktitle_3.className = "ranking_stocktitle";
    a_ranking_stocktitle_3.textContent = "失敗：";
    span_main_right_ranking_stock_fail.appendChild(a_ranking_stocktitle_3)
    let a_ranking_stocktitle_text_3 = document.createElement("a");
    a_ranking_stocktitle_text_3.className = "ranking_stocktitle_text";
    a_ranking_stocktitle_text_3.textContent = predict_fail + " 次";
    span_main_right_ranking_stock_fail.appendChild(a_ranking_stocktitle_text_3)


    let span_main_right_ranking_stock_tatal = document.createElement("span");
    span_main_right_ranking_stock_tatal.className = "main_right_ranking_stock tatal"
    div_main_right_ranking_stock_data.appendChild(span_main_right_ranking_stock_tatal)

    let a_ranking_stocktitle_4 = document.createElement("a");
    a_ranking_stocktitle_4.className = "ranking_stocktitle";
    a_ranking_stocktitle_4.textContent = "預測：";
    span_main_right_ranking_stock_tatal.appendChild(a_ranking_stocktitle_4)
    let a_ranking_stocktitle_text_4 = document.createElement("a");
    a_ranking_stocktitle_text_4.className = "ranking_stocktitle_text";
    a_ranking_stocktitle_text_4.textContent = predict_total + " 次";
    span_main_right_ranking_stock_tatal.appendChild(a_ranking_stocktitle_text_4)

}

// 取排行資訊
function member_predict_rank_api_load() {
    fetch("/api/message_predict_rank?data_status=rate").then(function(response) {
        return response.json();
    }).then(function(result) {
        console.log(result)
        if (result.ok) {
            for (let i = 0; i < result.data.length; i++) {

                member_id = result.data[i].member_id;
                member_name = result.data[i].member_name;
                predict_win = result.data[i].predict_win
                predict_fail = result.data[i].predict_fail
                predict_total = result.data[i].predict_total
                predict_win_rate = result.data[i].predict_win_rate
                member_src = result.data[i].member_src
                    // console.log(i, member_name, predict_win, predict_fail, predict_total, predict_win_rate)
                member_predict_add_rank(i + 1, member_name, predict_win, predict_fail, predict_total, predict_win_rate, member_src, member_id)
            }
        }
        document.querySelector('.base_load_gif_forum_rank').style.display = "none";
    }
    )
}
/*-------------rnak end----------------*/


// 刪除討論預測
function administrator_delete_predict(mid, member_user_id) {
    let delete_predict = {
        "message_id": mid,
        "member_user_id": member_user_id
    }
    fetch("/api/message_predict_add", {
            method: 'DELETE',
            body: JSON.stringify(delete_predict),
            headers: {
                'Content-Type': 'application/json',
                // 'X-CSRFToken': csrfToken,
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

function init() {
    // member_predict_rank_api_load()
}

init()

