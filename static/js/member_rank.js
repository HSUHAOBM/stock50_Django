// 增加畫面
let predic_data_not_have = 0

function load_rank_rate_add(no, stock_id, stock_name, predict_win_rate, predict_win, predict_fail, predict_total, data_status) {
    let rate_div_member_rank_box = document.querySelector('.member_rank_box.' + data_status)
    let div_member_rank_box_win_load = document.createElement("div");
    div_member_rank_box_win_load.className = "member_rank_box_win_load";
    rate_div_member_rank_box.appendChild(div_member_rank_box_win_load)

    let div_member_rank_box_win_no = document.createElement("div");
    div_member_rank_box_win_no.className = "member_rank_box_win_no";
    div_member_rank_box_win_no.textContent = no;
    div_member_rank_box_win_load.appendChild(div_member_rank_box_win_no)

    let div_member_rank_box_win_stock = document.createElement("div");
    div_member_rank_box_win_stock.className = "member_rank_box_win_stock";
    div_member_rank_box_win_stock.addEventListener('click', function() {
        location.href = '/stock_info?stock_id=' + stock_id
    });
    div_member_rank_box_win_load.appendChild(div_member_rank_box_win_stock)

    let a_member_rank_box_win_stock_id = document.createElement("a");
    a_member_rank_box_win_stock_id.className = "member_rank_box_win_stock_id";
    a_member_rank_box_win_stock_id.textContent = stock_id;
    div_member_rank_box_win_stock.appendChild(a_member_rank_box_win_stock_id)

    let a_member_rank_box_win_stock_name = document.createElement("div");
    a_member_rank_box_win_stock_name.className = "member_rank_box_win_stock_name";
    a_member_rank_box_win_stock_name.textContent = stock_name;
    div_member_rank_box_win_stock.appendChild(a_member_rank_box_win_stock_name)

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
    div_member_rank_box_win_text_total.textContent = "討論：" + predict_total + "次";
    div_member_rank_box_win_load.appendChild(div_member_rank_box_win_text_total)
}

// 讀取資料
function member_predict_load_rank(data_status) {
    fetch("/api/message_predict_rank?id=" + memer_id + "&data_status=" + data_status).then(function(response) {
        return response.json();
    }).then(function(result) {
        if (result.data.member_no_data) {
            document.querySelector('.data_not_have.' + data_status).style.display = "flex";
            predic_data_not_have = predic_data_not_have + 1
            if (memer_id == login_member_id) {
                document.querySelector('.data_not_have_text_other').style.display = "flex";
            }
            if (predic_data_not_have == 3) {
                document.querySelector('.data_not_have').style.display = "flex";
                document.querySelector('.member_rank_win_title.rate').style.display = "none";
                document.querySelector('.member_rank_win_title.win').style.display = "none";
                document.querySelector('.member_rank_win_title.fail').style.display = "none";
                document.querySelector('.data_not_have.rate').style.display = "none";
                document.querySelector('.data_not_have.win').style.display = "none";
                document.querySelector('.data_not_have.fail').style.display = "none";

            }
            document.querySelector('.base_load_gif_member_rank.' + data_status).style.display = "none";
        }

        if (result.data[0].predict_load_rank) {
            document.querySelector('.data_not_have').style.display = "none";

            for (let i = 0; i < result.data.length; i++) {
                stock_id = result.data[i].stock_id;
                stock_name = result.data[i].stock_name;
                predict_win_rate = result.data[i].predict_win_rate
                predict_win = result.data[i].predict_win
                predict_fail = result.data[i].predict_fail
                predict_total = result.data[i].predict_total
                // console.log(i, member_name, predict_win, predict_fail, predict_total, predict_win_rate)
                load_rank_rate_add(i + 1, stock_id, stock_name, predict_win_rate, predict_win, predict_fail, predict_total, data_status)
            }
            document.querySelector('.base_load_gif_member_rank.' + data_status).style.display = "none";
        }
    })
}

function init() {
    member_predict_load_rank("rate")
    member_predict_load_rank("win")
    member_predict_load_rank("fail")
}