const urlParams = new URLSearchParams(window.location.search);
const discussion_id = urlParams.get("post_id");

apply_splash();
apply_socials('#splash');

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

    if (post_content)
        $('#post')
            .append
            (
                get_content_element
                (
                    post_content, 
                    await 
                    query_user_icon(post_content.user_id)
                )
            );

    const comments_list = $('#comment_list');

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

update_comments();
