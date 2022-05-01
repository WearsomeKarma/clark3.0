//initialization
const urlParams = new URLSearchParams(window.location.search);
const user_id= urlParams.get("user_id")

//Set user image and details, authenticate the user for editing
$('#user_img').attr('src', ("/img/default_user.png"));
let current_user_id;
$.getJSON("/get_current_user").done(function(data){
    current_user_id = data.user._id
})
let user;
$.getJSON("/get_user", {user_id: user_id}).done(function(data){
    user = data.user;
    $("#username").text(data.user.username)
    $('#user_id').text(user_id)
    if (user_id !== current_user_id){
        $("#settings").hide();
        
    }
})


//hide and show showcases
const post_list = $("#user_showcases");
$("#showcase").on("click", function(){
    if (post_list.hasClass("hidden")){
        post_list.slideUp("1000");
    } else {
        post_list.slideDown("1000");
    }
    post_list.toggleClass("hidden");

})

//animate button group
$(".button_user").on("click", function(){
    $("#dashboard").children().removeClass("list-group-item-warning");
    $("#dashboard").children().addClass("list-group-item-dark");
    $(this).toggleClass("list-group-item-warning");
    $(this).toggleClass("list-group-item-dark");
})

function make_post(post_dictionary){
    return `
    <li class="list-group-item bg-dark text-white border border-warning">
        <div class="row">
            <div class="col-lg-7">
                <p>${post_dictionary.description}</p>
            </div>
            <div class="col-lg-5">
                <div class="embed-responsive embed-responsive-16by9">
                    <iframe class="embed-responsive-item" style="width: 100%; height: 15rem;"
                        src="${post_dictionary.url}" allowfullscreen>
                    </iframe>
                </div>
            </div>

        </div>  
    </li>
    `;
}

function make_settings_form(){
return `
    <li class="list-group-item bg-dark text-white border border-warning">
        <form action="/user_edit" method="POST">
            <div class="form-group">
                <label for="email">New Email</label>
                <input type="email" class="form-control" name="username" id="email" required>
                <div> <p id="email_length_error" class="error_message py-0 my-0">hidden</p> </div>
            </div>
            <div class="form-group">
                <label for="password">New Password</label>
                <input type="password" class="form-control" name="password" id="password" required>
                <div> <p id="password_length_error" class="error_message py-0 my-0">hidden</p> </div>
            </div>
            <div class="form-group">
                <label for="confirm_password">Confirm Password</label>
                <input type="password" class="form-control" name="confirm_password" id="confirm_password" required>
                <div> <p id="password_length_error" class="error_message py-0 my-0">hidden</p> </div>
            </div>
            <div> <p id="error_message" class="error_message py-0 my-0"></p> </div>
            <button type="submit" class="btn btn-dark mt-3">Submit Changes</button>
        </form>     
    </li>
`;
}

function load_form(user){
    $("#email").val(user.username);
}

//hardcoded templates, to be deleted
const posts = [
    {
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        url: "https://www.youtube.com/watch?v=kgx4WGK0oNU"
    },
    {
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
        url: "https://www.youtube.com/watch?v=kgx4WGK0oNU"
    },
    
]

//loading showcases
post_list.hide();
posts.forEach(function(post){
    post_list.append(make_post(post))
})

//loading settings
$("#settings").on("click", function(){

    //toggle change; if post_list visible make it hidden, and otherwise.
    post_list.hide();
    $("#user_settings").append(make_settings_form());
    $("#user_settings").slideDown("500");

    
})
