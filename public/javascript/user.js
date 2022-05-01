const urlParams = new URLSearchParams(window.location.search);
const user_id= urlParams.get("user_id")

$('#user_img').attr('src', ("/img/default_user.png"));
$.getJSON("/get_current_user").done(function(data){
    $("#username").text(data.user.username)
    $('#user_id').text(user_id)
})
