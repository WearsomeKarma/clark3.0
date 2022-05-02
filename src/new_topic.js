const urlParams = new URLSearchParams(window.location.search);
const url_error= urlParams.get("error")

let user = undefined;
$.getJSON('/get_current_user').done(data => user = data.user);

apply_splash();
apply_socials('#splash');

$('#button_cancel').on('click', function() {
    window.history.back();
    return false;
});

function hide_error(target){
    $(`#${target}`).hide();
}

function show_error(target, error){
    $(`#${target}`).text(error);
    $(`#${target}`).slideDown(300);
}

hide_error('form_error_title');
hide_error('form_error_content');

if (!url_error)
    show_error('form_error_content', url_error);

$('#topic_form').on('submit', function() {
    const title = $('#input_title').val();
    const has_title = title !== '';

    if (!has_title) {
        show_error('form_error_title', 'Title cannot be empty');
        return false;
    }
    hide_error('form_error_title');

    const video_url = $('#input_video_url').val();
    const has_video_url = video_url !== '';
    const video_url_valid = isValidHttpUrl(video_url);

    if (has_video_url && !video_url_valid) {
        show_error('form_error_content', 'Video URL is invalid.');
        return false;
    }

    const content = $('#input_content').val();
    const has_content = content !== '';

    if (!has_content && !has_video_url) {
        show_error('form_error_content', 'Discussion post cannot be empty if no video url is given.');
        return false;
    }

    if (has_content && content.length < 10) {
        show_error('form_error_content', 'Discussion post must be at least 10 characters long');
        return false;
    }

    //construct discussion and validate on backend.
    
    const discussion = {
        title: title,
    }

    $('form').append(`<input name=author_id value=${user._id}>`);

    return true;
});

/*
 *  Credit:
 *  https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url
 *  Pavlo
 *
 * */
function isValidHttpUrl(string) {
    let url;

    try {
    url = new URL(string);
    } catch (_) {
    return false;  
    }

    return url.protocol === "http:" || url.protocol === "https:";
}
