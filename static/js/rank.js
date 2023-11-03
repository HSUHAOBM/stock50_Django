function member_predict_add_rank_web(no, member_name, rank_text, member_src, status) {
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
        img_a_member_rank_box_win_stock_name.src = '/static/img/rank_first_.png';
    }
    if (no == 2) {
        img_a_member_rank_box_win_stock_name.src = '/static/img/rank_second_.png';
    }
    if (no == 3) {
        img_a_member_rank_box_win_stock_name.src = '/static/img/rank_third_.png';
    }
    div_rank_no.appendChild(img_a_member_rank_box_win_stock_name)

    let div_rank_data_member = document.createElement("div");
    div_rank_data_member.className = "rank_data_member";
    div_rank_data_box.appendChild(div_rank_data_member)

    let div_rank_data_member_box = document.createElement("div");
    div_rank_data_member_box.className = "div_rank_data_member_box";
    if (member_name != "從缺中") {
        div_rank_data_member_box.addEventListener('click', function() {
            location.href = '/member_forum?name=' + member_name
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
    fetch("/score_statistics/").then(function(response) {
        return response.json();
    }).then(function(result) {

        const top_success_rate = result.top_success_rate;
        const top_total_messages = result.top_total_messages;
        const top_like = result.top_like;

        rank_view_create(top_success_rate, "rate")
        rank_view_create(top_like, "like")
        rank_view_create(top_total_messages, "total")

    })

}

function rank_view_create(items, rank_type){
    let data_count = 0
    for (const user of items) {
        if (data_count >= 10){ return}

        if (user)
        {
            member_name = user.username
            member_src = user.user_img

            if (rank_type == "rate") {
                rank_text = "成功率：" + user.success_rate + " %"
            }
            if (rank_type == "total") {
                rank_text = "討論：" + user.total_messages + " 次"
            }
            if (rank_type == "like") {
                rank_text = user.likes_count  + " 個讚"
            }
        }else{
            member_name = "從缺中"
            rank_text = ""
            member_src = '/static/img/unknown.png'
        }
        member_predict_add_rank_web(data_count + 1, member_name, rank_text, member_src, rank_type)
        data_count++;
    }

    document.querySelector('.base_load_gif_rank').style.display = "none";
}

member_predict_rank_api_load_rank_web()