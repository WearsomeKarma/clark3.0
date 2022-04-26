const urlParams = new URLSearchParams(window.location.search);
const user_id = urlParams.get("user_id");

if(!user_id){
    location.href = "/";
}

function fill_user(user) {
    $('#user_img').attr('src', user.profile_image ?? "/img/default_user.png");    
    $('#user_name').text(user.username ?? "default");
    $('#user_bio').text(user.bio ?? "default");
    $('#user_email').text(user.email ?? "default");

    // fill ul with posts
}

$.getJSON('/get_user', { user_id: user_id })
.done((data) => {
    if(data.message !== "success") 
        alert("database error");
        location.href = "/";
    }

    fill_user(data.user);
});
