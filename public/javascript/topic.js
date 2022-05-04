const urlParams = new URLSearchParams(window.location.search);
const discussion_id = urlParams.get("post_id");

let discussion = undefined;    
let root_content = undefined;

async function initalize(callback) {
    const get__discussion = 
        await $.getJSON('/get_discussion_by_id', {discussion_id: discussion_id});

    discussion = get__discussion.discussion;

    const get__post_content = 
        (discussion) 
        ? await $.getJSON('/get_content_by_id', {content_id: discussion.root_content_id})
        : undefined;
    root_content = get__post_content?.content;

    if (root_content)
        $('#post')
            .append
            (
                await get_content_element
                (
                    root_content
                )
            );

    apply_content_reply
    (
        discussion_id,
        root_content._id,
        root_content._id,
        'Create Comment'
    );

    if(callback)
        callback();
}

apply_splash();
apply_socials('#splash');

async function update_comments(){
    const post = $('#post');

    const comments_list = $('#comment_list');

    $.getJSON("/get_contents", {discussion_id: discussion_id}).done((data) => {
        if (data.message !== "success") {
            alert('database error');
            return;
        }

        const late_contents = [];

        for(const content of data.contents){
            if (content.reply_id !== root_content._id) {
                late_contents.push(content);
                continue;
            }

            get_content_element(content, false, (content_element) => {
                comments_list.append(content_element);
                apply_content_reply(discussion_id, content._id, content._id);
            });
        }

        for(const late_content of late_contents) {
            get_content_element(late_content, true, (content_element) => {
                $(`#replies-${late_content.reply_id}`)
                    .append(content_element);
                apply_content_reply(discussion_id, late_content._id, late_content.reply_id);
            })
        }
    });
}

$('#create_comment_id').on('click', () => {
    apply_content_form('#reply_field', discussion_id);
});

initalize(() => update_comments());
