let url = location.href;
url = url.split("stock_info/")
let stock_info_stock_id = url[url.length - 1]

let div_member_main_member_databydb = document.querySelector('.member_main_member_databydb.predict')
let web_stock_name = ""


/*-----------------------------*/
//stock_data
function stock_data_load() {
    fetch("/api/stock/get_last_info/?code=" + stock_info_stock_id)
    .then(function(response) {
        if (response.status === 200) {
            return response.json();
        } else {
            window.location.href = "/";
        }
        }).then(function(result) {

        let create_date = new Date(result.create_date);
        var formattedDateString = create_date.toLocaleString(undefined, {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false , // 使用24小时制
            // timeZone: 'UTC'
        });

        if (result) {
            document.querySelector('.stock_data_info.date').textContent = result.date;
            document.querySelector('.stock_data_info.total').textContent = result.volume;
            document.querySelector('.stock_data_info.open_price').textContent = result.open_price;
            document.querySelector('.stock_data_info.high_price').textContent = result.high_price;
            document.querySelector('.stock_data_info.low_price').textContent = result.low_price;
            document.querySelector('.stock_data_info.end_price').textContent = result.close_price;
            document.querySelector('.stock_data_info.differ').textContent = result.price_diff;
            document.querySelector('.stock_data_info.totaldeal').textContent = result.transaction_count;
            document.querySelector('.stock_info_update_time').textContent = "更新時間：" + formattedDateString;

            document.querySelector('.stock_data_info.date_').textContent = result.date;
            document.querySelector('.stock_data_info.total_').textContent = result.volume;
            document.querySelector('.stock_data_info.open_price_').textContent = result.open_price;
            document.querySelector('.stock_data_info.high_price_').textContent = result.high_price;
            document.querySelector('.stock_data_info.low_price_').textContent = result.low_price;
            document.querySelector('.stock_data_info.end_price_').textContent = result.close_price;
            document.querySelector('.stock_data_info.differ_').textContent = result.price_diff;
            document.querySelector('.stock_data_info.totaldeal_').textContent = result.transaction_count;
            document.querySelector('.stock_info_update_time_').textContent = "更新時間：" + formattedDateString;
            stock_news_load(result.stock_name)
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

    fetch("/api/stock/get_stock_news?stock_name=" + stock_name)
        .then(function(response) {
            return response.json();
        }).then(function(result) {
            if (result) {
                for (let i = 0; i < result.news.length; i++) {
                    stock_new_load_add(result.news[i].date, result.news[i].title, result.news[i].src)
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


function init() {
    // 會員排行
    // member_predict_load_message_stock_info()
    // 讀取股票資訊
    stock_data_load()
}
init()