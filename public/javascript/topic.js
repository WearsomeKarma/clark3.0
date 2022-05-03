const urlParams = new URLSearchParams(window.location.search);
const discussion_id = urlParams.get("post_id");

apply_splash();
apply_socials('#splash');

let comments = [];

async function update_comments(){
    const post = $('#post');

    const get__discussion = 
        await $.getJSON('/get_discussion_by_id', {discussion_id: discussion_id});
    const discussion = get__discussion.discussion;    

    const get__post_content = 
        (discussion) 
        ? await $.getJSON('/get_content', {content_id: discussion.root_content_id})
        : undefined;
    const post_content = get__post_content?.content;

    console.log(discussion);
    console.log(post_content);

    if (post_content)
        $('#post').append(get_content_element(post_content, query_user_icon(post_content.author_id)));

    return;

    const comments_list = $('#discussions_list')

    comments.empty();
    $.getJSON("/get_comments", {discussion_id: discussion_id}).done((data) => {
        if (data.message !== "success") {
            alert('database error');
            return;
        }

        for(const comment of data.comments){
            comments.push(comment);

            comment_list.append(get_comments(comment));
        }
    });
}

async function query_user_icon(user_id) {
    const get__user = await $.getJSON('/get_user', {user_id: user_id});
    const user = get__user?.user;

    return get_user_icon(user_id, user?.profile_img);
}

function get_content_element(content, user_icon) {
    return `
        <div class="row">
            <div class="col d-flex justify-content-end">
                ${user_icon}
            </div>
            ${
                !(content?.video_url) 
                ? ''
                : `
                <div class="row">
                    <iframe>
                    </iframe>
                </div>
                `
            }
            ${
                !(content?.content_paragraph?.length ?? 0 <= 0)
                ? ''
                : `
                <div class="row">
                    <p>${content.content_paragraph}<p>
                </div>
                `
            }
        </div>
    `;
}

update_comments();
