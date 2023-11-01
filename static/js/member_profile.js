function show_member_modify_data() {
    document.querySelector('.member_modify_data').style.display = "flex";
    //灰層
    let hidebg = document.getElementById("hidebg");
    hidebg.style.display = "block";
    hidebg.style.height = document.body.clientHeight + "px";
}

function close_member_modify_data() {
    document.querySelector('.member_modify_data').style.display = "none";
    //灰層
    document.getElementById("hidebg").style.display = "none";
}

// 修改會員資料
let member_modify_data_form = document.getElementById('member_modify_data');
member_modify_data_form.addEventListener('submit', function(event) {
    event.preventDefault();

    let csrftoken = Cookies.get('csrftoken');

    let member_modify_data_form_ = new FormData(member_modify_data_form);
    let member_modify_form_data = {};

    member_modify_form_data = {
        "name": member_modify_data_form_.get("member_modify_name"),
        "address": member_modify_data_form_.get("member_modify_address"),
        "birthday": member_modify_data_form_.get("member_modify_birthday"),
        "gender": member_modify_data_form_.get("member_modify_gender"),
        "interests": member_modify_data_form_.get("member_modify_interests"),
        "introduction": member_modify_data_form_.get("member_modify_introduction")
    }
    console.log(member_modify_form_data)
    if (member_modify_data_form_.get("member_modify_name").indexOf(" ") != -1) {
        document.querySelector('.member_modify_data_return_text').textContent = "請勿輸入空白字元"
    } else {
        fetch("/api/User/member_profile/", {
            method: "POST",
            body: JSON.stringify(member_modify_form_data),
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken
            }
        }).then(function(res) {
            return res.json();
        }).then(function(result) {
            console.log(result);
            console.log(result.message);

            if (result.ok) {
                location.href = '/member_profile?name=' + member_modify_data_form_.get("member_modify_name")
            }else{
                document.querySelector('.member_modify_data_return_text').textContent = result.message;
            }
        })
    }
})