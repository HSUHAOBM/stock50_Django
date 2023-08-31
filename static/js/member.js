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
        // console.log("開始")
        if (member_name != "") {

            // console.log("註冊")
            data = {
                "member_name": member_name,
                "member_email": member_email,
                "member_password": member_password
            }
            methodtype = "POST";
        }
        if (member_name == "") {
            // console.log("登入")
            data = {
                "member_email": member_email,
                "member_password": member_password
            }
            methodtype = "PATCH";
        }
        // console.log(data, methodtype)
        fetch("/api/member", {
                method: methodtype,
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                }
            }).then(res => {
                return res.json();
            })
            .then(result => {
                // console.log(result);
                if (result.error) {
                    error_text.textContent = result.message;
                };
                if (result.ok) {
                    // console.log(result.member_name)
                    if (member_name == "") {
                        // alert("登入成功")
                        location.href = '/member?id=' + result.member_id
                            // head_member_name.textContent = result.member_name + "歡迎!!"
                            // window.location.reload();
                            // window.location.reload();
                    }
                    if (member_name != "") {
                        // alert("註冊成功")
                        location.href = '/member_sigin'

                        // textcontrol = !textcontrol
                        // window.location.reload();
                    }
                    // userboxhide();
                }
            });
    }
})