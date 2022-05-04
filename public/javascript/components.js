const default_profile_img = (location.origin + "/img/default_user.png");

function apply_user_header(user) {
    apply_header(get_user_control(user));
}

function get_user_control(user) {
    if (!user)
        return `
            <a class="nav-link active login" href="/login">Login</a>
            <a class="nav-link active login" href="/register">Register</a>
        `
    return `
            <div class="navbar-brand mb-0 logout">Hello, <a id="showname" href="/user?user_id=${user._id}">${user.username}</a></div>
            <a class="nav-link active logout" href="/logout">Log out</a>
        `;
}

function apply_header(user_control) {
    $('nav').append(get_header(user_control));
    $('nav').addClass('navbar navbar-expand-lg navbar-dark bg-dark main_background');
}

function get_header(user_control) {
    return `
        <img src="img/logo.png" style="width: 6rem;" class="mx-3">
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNavAltMarkup">
            <div class="navbar-nav">
                <a class="nav-item nav-link active" href="/">Home</a>
                <a class="nav-item nav-link" href="/showcase">Showcases</a>
                <a class="nav-item nav-link" href="/get_started">Getting Started</a>
                <a class="nav-item nav-link" href="contact">Contact Us</a>
            </div>
        </div>
        <div id=user_control class="navbar-nav navbar-right">
            ${user_control}
        </div>
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
                        <a type="button" class="btn" href="https://twitter.com/marknadal">
                        <img src="img/twitter.svg" style="width: 3rem;"></a>
                        <a type="button" class="btn" href="https://www.youtube.com/channel/UC7kBESiHvbFf6ZBJPScRS3g">
                        <img src="img/youtube.svg" style="width: 3rem;"></a>
                        <a type="button" class="btn" href="https://github.com/amark/gun">
                        <img src="img/github.svg" style="width: 3rem;"></a>
                      </div>
                </div>
            </div>
    `;
}

function get_user_icon(img_url, user_id) {
    const path = 
        (img_url === '')
        ? '/img/default_user.png'
        : img_url;
    return `
    <a href="/user?user_id=${user_id}">
        <img style="width:full;"
            class=
            "profile_img main_background text-white border border-warning mb-2" 
            src="${path}" 
            onclick="location.href=/user?user_id=${user_id}"
        >
    </a>
    `;
}

function fill_discussion_list(target, query, data_array, callback)
{
    const target_element = $(target);

    $.getJSON('/get_discussions', {discussion_query: query})
    .done((data) => {
        if (data.message !== 'success') {
            if (callback)
                callback(data.message);
            return;
        }

        for(const discussion of data.discussions) {
            data_array?.append(discussion);
            $.getJSON('/get_user', {user_id: discussion.author_id}, (data) => {
                const author = data.user;

                $.getJSON('/get_content_by_id', {content_id: discussion.root_content_id},
                    (data) => {
                        if (data.message !== 'success') {
                            return;
                        }

                        target_element.append
                        (
                            get_discussion_overview
                            (
                                discussion,
                                author,
                                data.content
                            )
                        );
                    });
            });
        }

        if (callback)
            callback(data.message);
    });
}

// for reference only - to pull from before deleting
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

function get_discussion_overview(discussion, author, content) {
    return `
        <li class="list-group-item bg-dark text-white border border-warning">
            <div class="row">
                <div class="col-lg-10 position-relative">
                    <h5 class="position-absolute bottom-0 start-0 ms-3 mb-3">${discussion?.title}</h5>
                </div>
                <div class="col-lg-2">
                    ${get_user_icon(author?.profile_img, author?._id)}
                </div>
            </div>
            <div class="row">
                <div class="col-lg-10">
                    <p>${content?.content_paragraph}</p>
                </div>
                <div class="col-lg-2">
                    <div class="card bg-warning">
                        <img class="card-img-top" style="width= 12rem;" src="${discussion?.post_img ?? "img/logo.png"}">
                        <div class="card-body m-0 p-0 pb-1">
                            <button class="btn btn-dark col-lg-8 offset-lg-2" onclick="location.href='/discussion?post_id=${discussion?._id}'">Explore</button>
                            <!-- ADD CLAPS -->
                        </div>
                    </div>
                </div>
            </div>
        </li>
    `;
}

async function query_user_icon(user_id, callback) {
    const get__user = await $.getJSON('/get_user', {user_id: user_id});
    const user = get__user?.user;
    const icon = get_user_icon(user?.profile_img, user_id);

    if (callback){
        callback(icon);
    }

    return icon;
}

async function query_content(content_id, callback) {
    const get__content = await $.getJSON('/get_content', {content_id: discussion.root_content_id});
    const content = get__content.content;

    const content_element = 
        content 
        ? get_content_element(content)
        : content;

    if (callback)
        callback(content_element);

    return content_element;
}

async function get_content_element(content, is_reply, callback) {
    const user_icon = await query_user_icon(content.user_id);
    const video_id = 
        content?.video_url?.substring
        (
            content.video_url.lastIndexOf('=')+1
        ) ?? undefined;
    const content_element = `
        <div class="row bg-dark text-white border border-warning">
            <div class="col d-flex justify-content-end p-3">
                ${user_icon}
            </div>
            ${
                !(content?.video_url) 
                ? ''
                : `
                <div class="row">
                    <iframe class="embed-responsive-item" style="width: 100%; height: 30rem;"
                        src="https://www.youtube.com/embed/${video_id}" allowfullscreen></iframe>
                </div>
                `
            }
            ${
                ((content?.content_paragraph?.length ?? 0) <= 0)
                ? ''
                : `
                <div class="row">
                    <p>${content.content_paragraph}<p>
                </div>
                `
            }
            <div class="row p-3" id=reply-${content._id}>
            </div>
            ${
                (is_reply)
                ? ''
                : `
                    <div class="container ps-5 pe-5 pb-5" id=replies-${content._id}>
                    </div>
                `
            }
        </div>
    `;

    if (callback)
        callback(content_element);

    return content_element;
}

function apply_content_reply(discussion_id, content_id, reply_id, reply_text) {
    const element = `
        <div class="content-reply row justify-content-end"> 
            <div class="col-3 d-flex justify-content-end">
                <button id=create_comment_id class="btn btn-info">${reply_text ?? 'Reply'}</button>
            </div>
        </div>
    `;

    const target = `#reply-${content_id}`;
    $(target).append(element);
    $(`${target} .content-reply`).on('click', () => {
        if ($(target).children().length > 1)
            return;
        apply_content_form(target, discussion_id, content_id, reply_id);
    });
}

function get_content_field(id) {
    const id_form     = `${id}_reply_form`;
    const id_textarea = `${id}_input_content`;
    const id_error    = `${id}_form_error_content`;
    const id_submit   = `${id}_button_submit`;
    const id_cancel   = `${id}_button_cancel`;

    return { 
        jq_id_form      : `#${id_form}`,
        jq_id_textarea  : `#${id_textarea}`,
        jq_id_error     : `#${id_error}`,
        jq_id_submit    : `#${id_submit}`,
        jq_id_cancel    : `#${id_cancel}`,
        form: `
        <form id=${id_form} action="/post_content" method="post">
            <div class="row">
                <input name="discussion_id" class="discussion-target d-none">
                <input name="reply_id" class="reply-target d-none">
                <label>Post</label>
                <textarea
                    id=${id_textarea}
                    name=content
                    class="form-control" 
                    id="post_content" 
                    rows="5"
                ></textarea>
            </div>
            <div> <p id="${id_error}" class="error_message py-0 my-0"</p> </div>
            <div class="row mt-4">
                <button id=${id_submit} type="submit" class="btn btn-info col-2">Post</button>
                <button id=${id_cancel} class="btn btn-danger col-2">Cancel</button>
            </div>
        </form>
        `
    };
}

function apply_content_form(target, discussion_id, source_id, reply_id) {
    const field_desc =
        get_content_field
        (
            source_id
        );

    const element =
        field_desc.form;

    $(target).append(element);

    $(`${field_desc.jq_id_form} .discussion-target`).val(discussion_id);
    $(`${field_desc.jq_id_form} .reply-target`).val(reply_id);

    $(field_desc.jq_id_form).on('submit', function (){
        if ($(field_desc.jq_id_textarea).val().length <= 10) {
            $(field_desc.jq_id_error).text('Replies must be at least 10 characters long.');
            return false;
        }
        return true;
    });

    $(field_desc.jq_id_cancel).on('click', function (){
        $(field_desc.jq_id_form).remove();
    });
}

async function GET_content(content_id, callback) {
    const get__content = await $.getJSON('/get_content', {content_id: discussion.root_content_id});
    if (callback)
        callback(get__content.message, get__content.content);
    return get__content.content;
}
