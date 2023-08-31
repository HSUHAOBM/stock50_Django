function member_predict_add_rank_web(no, member_name, rank_text, member_src, status, member_id) {
    let main_right_ranking = document.querySelector('.ranK_main_' + status)

    let div_rank_data_box = document.createElement("div");
    div_rank_data_box.className = "rank_data_box";
    main_right_ranking.appendChild(div_rank_data_box)

    let div_rank_no = document.createElement("div");
    div_rank_no.className = "rank_no";
    div_rank_no.textContent = no;
    div_rank_data_box.appendChild(div_rank_no)

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
    div_rank_no.appendChild(img_a_member_rank_box_win_stock_name)

    let div_rank_data_member = document.createElement("div");
    div_rank_data_member.className = "rank_data_member";
    div_rank_data_box.appendChild(div_rank_data_member)

    let div_rank_data_member_box = document.createElement("div");
    div_rank_data_member_box.className = "div_rank_data_member_box";
    if (member_name != "從缺中") {
        div_rank_data_member_box.addEventListener('click', function() {
            location.href = '/member?id=' + member_id
        });
    }

    div_rank_data_member.appendChild(div_rank_data_member_box)

    let img_rank_data_member = document.createElement("img");
    img_rank_data_member.src = member_src;
    div_rank_data_member_box.appendChild(img_rank_data_member);


    let div_rank_data_member_name = document.createElement("a");
    div_rank_data_member_name.className = "rank_data_member_name";
    div_rank_data_member_name.textContent = member_name;
    div_rank_data_member_box.appendChild(div_rank_data_member_name);



    let span_rank_data_rate = document.createElement("span");
    span_rank_data_rate.className = "rank_data_ rate"
    div_rank_data_member.appendChild(span_rank_data_rate)
        //                 <a class="ranking_stocktitle">勝率：60%</a> </span>

    let a_ranking_stocktitle = document.createElement("a");
    a_ranking_stocktitle.className = "ranking_stocktitle";
    a_ranking_stocktitle.textContent = rank_text;
    span_rank_data_rate.appendChild(a_ranking_stocktitle)




}

function member_predict_rank_api_load_rank_web(status) {
    fetch("/api/message_predict_rank?data_status=" + status).then(function(response) {
        return response.json();
    }).then(function(result) {
        // console.log(result)
        if (result.ok) {
            for (let i = 0; i < 10; i++) {
                if (result.data[i]) {
                    member_id = result.data[i].member_id;

                    member_name = result.data[i].member_name;
                    if (status == "rate") {
                        rank_text = "勝率：" + result.data[i].predict_win_rate + " %"
                    }
                    if (status == "win") {
                        rank_text = "成功：" + result.data[i].predict_win + " 次"
                    }
                    if (status == "total") {
                        rank_text = "預測：" + result.data[i].predict_total + " 次"
                    }
                    if (status == "like") {
                        rank_text = result.data[i].predict_good + " 個讚"
                    }

                    member_src = result.data[i].member_src
                } else {
                    member_name = "從缺中"
                    rank_text = ""
                    member_src = 'img/unknown.png'
                }
                // console.log(i, member_name, predict_win, predict_fail, predict_total, predict_win_rate)
                member_predict_add_rank_web(i + 1, member_name, rank_text, member_src, status, member_id)
            }
            document.querySelector('.base_load_gif_rank').style.display = "none";
        }


    })

}

function init() {
    member_predict_rank_api_load_rank_web("rate")
    member_predict_rank_api_load_rank_web("like")
    member_predict_rank_api_load_rank_web("total")
}