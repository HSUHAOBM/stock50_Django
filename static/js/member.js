document.querySelector('.member_register_input.username').value = "";
// document.querySelector('.member_register_input.email').value = "";
// document.querySelector('.member_register_input.password1').value = "";
document.querySelector('.member_register_input.password2').value = "";

let memberform = document.getElementById('member_form');

//會員註冊與登入
memberform.addEventListener('submit', function(event) {
    event.preventDefault();

    let member_name = document.querySelector('.member_register_input.username').value
    let member_email = document.querySelector('.member_register_input.email').value
    let member_password = document.querySelector('.member_register_input.password1').value
    let member_check_password = document.querySelector('.member_register_input.password2').value
    let error_text = document.querySelector('.errortext')

    if (member_email.indexOf(" ") != -1 || member_password.indexOf(" ") != -1 || member_check_password.indexOf(" ") != -1 || member_name.indexOf(" ") != -1) {
        error_text.textContent = "請勿輸入空白字元"
    } else if (member_name != "" && member_password != member_check_password) {
        error_text.textContent = "請再次確認密碼";
    } else {
        // 註冊
        if (member_name != "") {
            data = {
                "member_name": member_name,
                "member_email": member_email,
                "member_password": member_password
            }

            fetch("/api/User/", {
                method:  "POST",
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(res => {
                return res.json();
            })
            .then(result => {
                if (result.ok) {
                    if (member_name != "") {
                        location.href = '/member_sigin'
                    }else{
                        error_text.textContent = result.message;
                    }
                }
            });
        }

        //  登入
        if (member_name == "") {
            data = {
                "member_email": member_email,
                "member_password": member_password
            }
            fetch("/api/User/login/", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(res => {
                return res.json();
            })
            .then(result => {
                if (result.ok) {
                    location.href = '/member_forum?name=' + result.name
                }else{
                    error_text.textContent = result.message;
                }
            });
        }
    }
})