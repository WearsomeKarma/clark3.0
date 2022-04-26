
function apply_header(user) {
    $('body').prepend(get_header(user));
}

function get_header(user) {
    return `
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark main_background">
        <img src="img/logo.png" style="width: 6rem;" class="mx-3">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav">
                <a class="nav-item nav-link active" href="/">Home</a>
                <a class="nav-item nav-link" href="/showcase">Showcases</a>
                <a class="nav-item nav-link" href="/gettingstarted">Getting Started</a>
                <a class="nav-item nav-link" href="contact">Contact Us</a>
              </div>
        </div>
        <div class="navbar-nav navbar-right">`
    +
        (
            (!user)
            ?
            `
                <a class="nav-link active login" href="/login">Login</a>
                <a class="nav-link active login" href="/register">Register</a>
            `
            :
            `
                <div class="navbar-brand mb-0 logout">Hello, <a id="showname" href="/user?user_id=${user._id}">${user.username}</a></div>
                <a class="nav-link active logout" href="/logout">Log out</a>
            `
        )
    +
        `
        </div>
      </nav>
    `;
}

function apply_footer() {
    $('#footer').append(get_footer());
}

function get_footer() {
    return `
        <div class="container">
            <div class="row">
                <div class="card bg-dark text-white">
                    <div class="card-body">
                        <p class="d-flex justify-content-center">All Rights Reserved to Darius & Mahdi.</p>
                        <p class="d-flex justify-content-center">Last updated: 4/22/2022</p>
                    </div>
                </div>
                
            </div>
        </div>
    `;
}

function apply_splash(target) {
    $(target ?? '#splash').append(get_splash());
}

function get_splash() {
    return `
        <div class="row">
            <img src="img/logo.png" style="width:12rem" class="d-block mx-auto mt-5">
        </div>

        <div class="row text-center">
            <h2>Web3.0 with GunJS</h2>
        </div>
    `;
}

function apply_socials(target, strategy) {
    if (strategy && strategy === 'prepend')
        $(target ?? '#socials').prepend(get_socials());
    else
        $(target ?? '#socials').append(get_socials());
}

function get_socials() {
    return `
            <div class="row">
                <div class="col-md-4 offset-4 d-flex justify-content-center">
                    <div class="btn-group" role="group">
                        <a type="button" class="btn" href="https://www.facebook.com/">
                        <img src="img/twitter.svg" style="width: 3rem;"></a>
                        <a type="button" class="btn" href="https://www.facebook.com/">
                        <img src="img/youtube.svg" style="width: 3rem;"></a>
                        <a type="button" class="btn" href="https://www.facebook.com/">
                        <img src="img/github.svg" style="width: 3rem;"></a>
                      </div>
                </div>
            </div>
    `;
}
