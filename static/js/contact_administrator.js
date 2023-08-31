// 私訊
function show_contact_message_box() {
    if (login_member_name == "") {
        location.href = '/member_register'
    } else {
        document.querySelector('.contact_message_box').style.display = "flex";
        //灰層
        let hidebg = document.getElementById("hidebg_contact");
        hidebg.style.display = "block";
        hidebg.style.height = document.body.clientHeight + "px";
    }
}

function close_contact_message_box() {
    document.querySelector('.contact_message_box').style.display = "none";
    document.getElementById("hidebg_contact").style.display = "none";
}

//字數判斷
function check_input_contact_message(value) {
    let maxLen = 500;

    if (value.length > maxLen) {
        document.querySelector('.contact_message_box_text_textarea').value = value.substring(0, maxLen);
    }
    else if (value.length == 0) {
        document.querySelector('.contact_message_box_error_text').style.display = "none"
    } else {
        document.querySelector('.contact_message_box_error_text').textContent = maxLen - value.length;
        document.querySelector('.contact_message_box_error_text').style.display = "flex"
    }
}

// 傳送私人訊息會員資料
let member_contact_message_form = document.getElementById('member_contact_message');
member_contact_message_form.addEventListener('submit', function(event) {
    var member_contact_message_form_ = new FormData(member_contact_message_form);
    let member_contact_message_form_data = {};
    event.preventDefault();
    member_contact_message_form_data = {
        "message_sent_text": member_contact_message_form_.get("contact_message_text"),
    }
    if (member_contact_message_form_.get("contact_message_text").length > 500) {
        document.querySelector('.contact_message_box_error_text').textContent = "字數大於500，超過規定。";
    }
    console.log("g")
    fetch("/api/contact_message_sent", {
        method: "POST",
        body: JSON.stringify(member_contact_message_form_data),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function(res) {
        return res.json();
    }).then(function(result) {
        // console.log(result);
        if (result.ok) {
            // location.href = '/member?name=' + member_modify_data_form_.get("member_modify_name")
            window.location.reload();

        }
        if (result.error) {
            document.querySelector('.contact_message_box_error_text').textContent = result.message;
        }



    })

})