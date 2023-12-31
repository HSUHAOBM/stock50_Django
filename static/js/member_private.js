function member_private_message_load_add(private_member_name, private_member_img, private_member_text, private_member_time, private_member_about_time, level) {
    let member_private_message = document.querySelector('.member_private_message' + level)

    let div_member_private_message_load = document.createElement("div");
    if (level == "") {
        div_member_private_message_load.className = "member_private_message_load private" + private_member_name;
    } else {
        div_member_private_message_load.className = "member_private_message_load private_" + private_member_name;

    }
    member_private_message.appendChild(div_member_private_message_load)

    let div_member_private_img = document.createElement("div");
    div_member_private_img.className = "member_private_img";
    div_member_private_message_load.appendChild(div_member_private_img)

    let img_member_private_img = document.createElement("img");
    img_member_private_img.src = private_member_img
    div_member_private_img.appendChild(img_member_private_img)

    let div_member_private_message_box = document.createElement("div");
    if (level == "") {
        div_member_private_message_box.className = "member_private_message_box message_box" + private_member_name;
    } else {
        div_member_private_message_box.className = "member_private_message_box message_box_" + private_member_name;

    }
    div_member_private_message_load.appendChild(div_member_private_message_box)

    let div_private_message_name = document.createElement("div");
    div_private_message_name.className = "private_message_name";
    div_private_message_name.textContent = private_member_name
    div_private_message_name.addEventListener('click', function() {
        location.href = '/member_forum?name=' + private_member_name
    });
    div_member_private_message_box.appendChild(div_private_message_name)

    let div_message_date = document.createElement("div");
    div_message_date.className = "message_date";
    div_message_date.textContent = private_member_about_time
    div_message_date.setAttribute("title", private_member_time)
    div_member_private_message_box.appendChild(div_message_date)


    let div_private_message_text = document.createElement("div");
    div_private_message_text.className = "private_message_text";
    div_private_message_text.textContent = private_member_text
    div_member_private_message_box.appendChild(div_private_message_text)



}

// 重複 user
// class="member_private_message_box message_boxh01.contact"
function member_private_message_load_add_(private_member_name, private_member_text, private_member_time, private_member_about_time, level) {
    let div_member_private_message_box;
    if (level == "") {
        div_member_private_message_box = document.querySelector('.member_private_message_box.message_box' + private_member_name)
    } else {
        div_member_private_message_box = document.querySelector('.member_private_message_box.message_box_' + private_member_name)
    }

    let div_message_date = document.createElement("div");
    div_message_date.className = "message_date";
    div_message_date.textContent = private_member_about_time
    div_message_date.setAttribute("title", private_member_time)
    div_member_private_message_box.appendChild(div_message_date)


    let div_private_message_text = document.createElement("div");
    div_private_message_text.className = "private_message_text";
    div_private_message_text.textContent = private_member_text
    div_member_private_message_box.appendChild(div_private_message_text)
}

console.log("memer_name :",memer_name)
function member_private_message_load() {
    fetch("/api/User/private_message/?name=" + memer_name).then(function(response) {
        return response.json();
    }).then(function(result) {
        console.log(result)
        if (result.ok) {
            for (let i = 0; i < result.data.length; i++) {
                private_member_name = result.data[i].sender.username;
                private_member_img = result.data[i].sender.avatar_url;
                private_member_text = result.data[i].message;
                private_member_time = result.data[i].create_date;
                private_member_about_time = timeAgo(result.data[i].create_date);

                if (document.querySelector('.member_private_message_load.private' + private_member_name)) {
                    member_private_message_load_add_(private_member_name, private_member_text, private_member_time, private_member_about_time, "")
                } else {
                    member_private_message_load_add(private_member_name, private_member_img, private_member_text, private_member_time, private_member_about_time, "")
                }
            }

            document.querySelector('.base_load_gif_member_message').style.display = "none";

        } else {
            document.querySelector('.data_not_message').style.display = "flex";
            document.querySelector('.base_load_gif_member_message').style.display = "none";
        }
        if(result.Error){
            location.href = '/'
        }
    })
}

// 最大權限可看
function member_contact_message_load() {
    fetch("api/contact_message_sent").then(function(response) {
        return response.json();
    }).then(function(result) {
        // console.log(result)

        if (result.data.contact_message_not) {
            document.querySelector('.data_not_message.contact').style.display = "flex";
            document.querySelector('.base_load_gif_member_message.contact').style.display = "none";

        } else {
            for (let i = 0; i < result.data.length; i++) {
                private_member_id = result.data[i].member_id;
                private_member_name = result.data[i].member_name;
                private_member_img = result.data[i].member_img;
                private_member_text = result.data[i].message_text;
                private_member_time = result.data[i].time;
                private_member_about_time = result.data[i].time_about;
                // class="member_private_message_load privateh01.contact"
                if (document.querySelector('.member_private_message_load.private_' + private_member_name)) {
                    member_private_message_load_add_(private_member_id, private_member_name, private_member_text, private_member_time, private_member_about_time, ".contact")
                } else {
                    member_private_message_load_add(private_member_id, private_member_name, private_member_img, private_member_text, private_member_time, private_member_about_time, ".contact")
                }

            }
            document.querySelector('.base_load_gif_member_message.contact').style.display = "none";

        }
    })
}



// if (login_member_level) {
//     document.querySelector('.base_load_gif_member_message.contact').style.display = "flex";
//     document.querySelector('.member_private_message_web_title.contact').style.display = "block";
//     member_contact_message_load();

// }


// 將時間轉換成XXX前
function timeAgo(timeAgo) {
    const now = new Date();
    const sentTime = new Date(timeAgo);

    const timeDifference = now - sentTime;
    const { days, hours, minutes } = daysHoursMinutes(timeDifference);

    if (days !== 0) {
        return days + " 天前";
    }
    if (hours !== 0) {
        return hours + " 小時前";
    }
    if (minutes !== 0) {
        return minutes + " 分鐘前";
    } else {
        return "剛剛";
    }
}
function daysHoursMinutes(ms) {
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    return { days, hours, minutes };
}

member_private_message_load();
