

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
        location.href = '/stock_info/' + stock_id
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

// 增加畫面
let predic_data_not_have = 0
// 讀取資料
function member_predict_load_rank() {
    fetch("score_statistics/?name=" + memer_name).then(function(response) {
        return response.json();
    }).then(function(result) {


        const topSuccessfulMessages = result.top_successful_messages;
        const topFailedMessages = result.top_failed_messages;
        const topSuccessRate = result.top_success_rate;

        console.log(topSuccessfulMessages)

        rank_view_create(topSuccessfulMessages, "win")

        rank_view_create(topFailedMessages, "fail")

        rank_view_create(topSuccessRate, "rate")

        if (predic_data_not_have == 3) {
            document.querySelector('.data_not_have').style.display = "flex";
            document.querySelector('.member_rank_win_title.rate').style.display = "none";
            document.querySelector('.member_rank_win_title.win').style.display = "none";
            document.querySelector('.member_rank_win_title.fail').style.display = "none";
            document.querySelector('.data_not_have.rate').style.display = "none";
            document.querySelector('.data_not_have.win').style.display = "none";
            document.querySelector('.data_not_have.fail').style.display = "none";
        }
        console.log("predic_data_not_have",predic_data_not_have)
    })
}


function rank_view_create(items,rank_type){
    document.querySelector('.data_not_have').style.display = "none";
    document.querySelector('.base_load_gif_member_rank.' + rank_type).style.display = "none";

    let i = 0

    // items.forEach(stock => {
    for (const stock of items) {
        stock_id = stock.stock__code
        stock_name = stock.stock__name
        predict_win_rate = stock.success_rate
        predict_win = stock.successful_messages
        predict_fail = stock.failed_messages
        predict_total = stock.total_messages

        if (rank_type === "win" && predict_win === 0) {
            continue;
        }
        if (rank_type === "fail" && predict_fail === 0) {
            continue;
        }
        if (rank_type === "rate" && predict_win_rate === 0) {
            continue;
        }
        load_rank_rate_add(i + 1, stock_id, stock_name, predict_win_rate, predict_win, predict_fail, predict_total, rank_type)
        i++;
    };
    if (i == 0) {
        document.querySelector('.data_not_have.' + rank_type).style.display = "flex";
        document.querySelector('.base_load_gif_member_rank.' + rank_type).style.display = "none";
        predic_data_not_have = predic_data_not_have + 1
    }
}


member_predict_load_rank()