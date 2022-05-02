//initialization
const urlParams = new URLSearchParams(window.location.search);
const user_id= urlParams.get("user_id")

//Set user image and details, authenticate the user for editing
let current_user_id;
$('#user_img').attr('src', ("/img/default_user.png"));
$.getJSON("/get_current_user").done(function(data){
    current_user_id = data.user._id
    console.log(data.user.profile_img);
    if (data.user?.profile_img?.length ?? 0 > 0)
        $('#user_img').attr('src', (data.user?.profile_img));
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

//animate button group
$(".button_user").on("click", function(){
    $("#dashboard").children().removeClass("list-group-item-warning");
    $("#dashboard").children().addClass("list-group-item-dark");
    $(this).toggleClass("list-group-item-warning");
    $(this).toggleClass("list-group-item-dark");
})

// To be moved into components.
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

function get_settings_form(){
    return `
        <li class="list-group-item bg-dark text-white border border-warning">
            <form action="/user_edit" method="POST">
                <div class="form-group">
                    <label for="profile_img">Profile Image URL</label>
                    <input class="form-control" name="profile_img" id="profile_img">
                    <div> <p id="email_length_error" class="error_message py-0 my-0">hidden</p> </div>
                </div>
                <button type="submit" class="btn btn-dark mt-3">Submit Changes</button>
            </form>     
        </li>
    `;
}

function load_form(user){
    $("#email").val(user.username);
}

//hide and show showcases
const post_list = $("#user_showcases");
post_list.hide();
fill_discussion_list(post_list, {author_id: user_id});

//load settings
//$("#user_settings").append(make_settings_form());
$("#user_settings").append(get_settings_form());

//apply hide-show toggles

function apply_toggle(control, target, hide) {
    const target_element = $(target);
    $(control).on("click", function(){
        if (target_element.hasClass("hidden")){
            target_element.slideUp("1000");
        } else {
            target_element.slideDown("1000");
        }
        target_element.toggleClass("hidden");
    });
    if (hide)
        target_element.hide();
}

apply_toggle('#showcase', '#user_showcases');
apply_toggle('#settings', '#user_settings', true);
