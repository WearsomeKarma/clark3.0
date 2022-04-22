///Show username if logged in
$(document).ready(function(){
    $.getJSON('/get_current_user').done(function (data){
        if (data.message=== "success"){
            //_if the user is logged in, remove the register and log in buttons
            const user = data.user;
            $('.login').remove();
            $('#showname').text(user.username);
        } else {
            //_if the user is not logged in, then show the login and register buttons
            $('.logout').remove()
            //something here
        }
    })
})
