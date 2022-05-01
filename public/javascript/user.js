const urlParams = new URLSearchParams(window.location.search);
const user_id= urlParams.get("user_id")

function fill_user(user) {
    $('#user_img').attr('src', (user?.img ?? "/img/default_user.png"));
}

fill_user($.getJSON("/get_user", {user_id: user_id}));
