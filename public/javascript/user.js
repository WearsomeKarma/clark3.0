//initialization
const urlParams = new URLSearchParams(window.location.search);
const user_id= urlParams.get("user_id")

//Set user image and details
$('#user_img').attr('src', ("/img/default_user.png"));
let current_user_id;
$.getJSON("/get_current_user").done(function(data){
    current_user_id = data.user._id
    console.log(current_user_id)
})
$.getJSON("/get_user", {user_id: user_id}).done(function(data){
    $("#username").text(data.user.username)
    $('#user_id').text(user_id)
    if (user_id !== current_user_id){
        $("#settings").hide()
    }
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

const post_list = $("#user_showcases");
posts.forEach(function(post){
    post_list.append(make_post(post))
})
