let set_ajx_load = true;

function clear_search_box() {
    // document.querySelector('.search_box').style.display = "none";

}

function clear_input() {

}

function sent_serch(value) {
    document.querySelector('#base_load_gif').style.display = "inline-block";

    document.querySelector('.search_data_stock_data_load>tr>td').innerHTML = ""
    document.querySelector('.search_data_member_data_load>tr>td').innerHTML = ""
    document.querySelector('.search_data_stock_title').style.display = "none";
    document.querySelector('.search_data_member_title').style.display = "none";
    document.querySelector('.search_data_stock_data').style.display = "none";
    document.querySelector('.search_data_member_data').style.display = "none";
    document.querySelector('.seach_no_data').style.display = "none";

    document.querySelector('.search_box').style.display = "block";
    if (set_ajx_load) { search_data_load(value) }
}

function search_stock_data_add(stock_id, stock_name) {
    let search_data_stock_data_load_box = document.querySelector('.search_data_stock_data_load>tr>td')

    let div_search_data_stock_data_load_box = document.createElement("div");
    div_search_data_stock_data_load_box.className = "serch_stock_result_name";
    div_search_data_stock_data_load_box.addEventListener('click', function() {
        location.href = 'stock_info/' + stock_id
    });
    search_data_stock_data_load_box.appendChild(div_search_data_stock_data_load_box)

    let a_search_data_stock_data_load_box = document.createElement("a");
    a_search_data_stock_data_load_box.textContent = stock_id + "－" + stock_name
    div_search_data_stock_data_load_box.appendChild(a_search_data_stock_data_load_box)
}

function search_member_data_add(member_name, img_src, id) {
    let search_data_stock_data_load_box = document.querySelector('.search_data_member_data_load>tr>td')

    let div_search_data_stock_data_load_box = document.createElement("div");
    div_search_data_stock_data_load_box.className = "serch_stock_result_name";
    div_search_data_stock_data_load_box.addEventListener('click', function() {
        location.href = '/member_forum?name=' + id
    });
    search_data_stock_data_load_box.appendChild(div_search_data_stock_data_load_box)
        //                                                         <img src="img/unknown.png ">

    let img_search_data_stock_data_load_box = document.createElement("img");
    img_search_data_stock_data_load_box.src = img_src
    div_search_data_stock_data_load_box.appendChild(img_search_data_stock_data_load_box)

    let a_search_data_stock_data_load_box = document.createElement("a");
    a_search_data_stock_data_load_box.textContent = member_name
    div_search_data_stock_data_load_box.appendChild(a_search_data_stock_data_load_box)
}

function search_data_load(keyword) {
    set_ajx_load = false

    let search_data_keyword = {
        "keyword": keyword,
    }


    fetch("/api/search_data", {
            method: 'POST',
            body: JSON.stringify(search_data_keyword),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            return res.json();
        })
        .then(result => {

            // console.log(result)
            if (result.loging_error) {
                location.href = '/member_register'


            }
            if (result.error) {
                set_ajx_load = true
                document.querySelector('#base_load_gif').style.display = "none";

            }
            if (result.serch_return.data_have) {
                document.querySelector('.seach_no_data').style.display = "none";
            } else {
                document.querySelector('.seach_no_data').style.display = "flex";
                document.querySelector('#base_load_gif').style.display = "none";

            }
            if (result.serch_return.data_stock) {

                document.querySelector('.search_data_stock_title').style.display = "flex";
                document.querySelector('.search_data_stock_data').style.display = "flex";

                // console.log(result.serch_return.stock_data.length)
                for (let i = 0; i < result.serch_return.stock_data.length; i++) {
                    search_stock_data_add(result.serch_return.stock_data[i][0], result.serch_return.stock_data[i][1])
                }
                document.querySelector('#base_load_gif').style.display = "none";

            } else {
                document.querySelector('.search_data_stock_title').style.display = "none";
            }

            if (result.serch_return.data_member) {

                document.querySelector('.search_data_member_title').style.display = "flex";
                document.querySelector('.search_data_member_data').style.display = "flex";

                // console.log(result.serch_return.member_data.length)
                for (let i = 0; i < result.serch_return.member_data.length; i++) {
                    search_member_data_add(result.serch_return.member_data[i][0], result.serch_return.member_data[i][1], result.serch_return.member_data[i][2])
                }
                document.querySelector('#base_load_gif').style.display = "none";

            } else {
                document.querySelector('.search_data_member_title').style.display = "none";
            }
            set_ajx_load = true

        })
}